import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { personalInfo, experience, education, skills, targetRole } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Generate an ATS-optimized resume in JSON format for the following person applying for: ${targetRole || "a tech role"}.

Personal Info: ${JSON.stringify(personalInfo)}
Experience: ${JSON.stringify(experience)}
Education: ${JSON.stringify(education)}
Skills: ${JSON.stringify(skills)}

Return a JSON object with these fields:
- summary: A professional summary (2-3 sentences, keyword-rich)
- experienceBullets: Array of objects { company, role, duration, bullets: string[] } with quantified, action-verb bullet points
- skillCategories: Array of { category, skills: string[] } organized by relevance
- keywords: Array of ATS keywords relevant to the target role
- tips: Array of 3-5 improvement suggestions

Make bullet points action-oriented with metrics. Use industry keywords.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert resume writer specializing in ATS optimization. Always respond with valid JSON only, no markdown." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_resume",
              description: "Generate an ATS-optimized resume",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  experienceBullets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        role: { type: "string" },
                        duration: { type: "string" },
                        bullets: { type: "array", items: { type: "string" } }
                      },
                      required: ["company", "role", "duration", "bullets"]
                    }
                  },
                  skillCategories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        skills: { type: "array", items: { type: "string" } }
                      },
                      required: ["category", "skills"]
                    }
                  },
                  keywords: { type: "array", items: { type: "string" } },
                  tips: { type: "array", items: { type: "string" } }
                },
                required: ["summary", "experienceBullets", "skillCategories", "keywords", "tips"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_resume" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let resume;
    if (toolCall?.function?.arguments) {
      resume = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      resume = JSON.parse(content.replace(/```json\n?|```/g, "").trim());
    }

    return new Response(JSON.stringify({ resume }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
