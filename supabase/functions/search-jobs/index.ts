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

    const { query } = await req.json();

    const { data: profile } = await supabase
      .from("profiles")
      .select("selected_role, role_category")
      .eq("user_id", user.id)
      .single();

    const { data: progress } = await supabase
      .from("user_progress")
      .select("skill_name, completion_percentage")
      .eq("user_id", user.id);

    const skillSummary = progress && progress.length > 0
      ? progress.map(p => `${p.skill_name} (${p.completion_percentage}%)`).join(", ")
      : "Beginner level";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const searchQuery = query || `${profile?.selected_role || "software"} jobs and internships`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a job search assistant. The user is pursuing a career as a "${profile?.selected_role || "professional"}" (${profile?.role_category || "general"} category). Their skill levels: ${skillSummary}.
            
Find relevant job and internship opportunities. For each opportunity provide realistic job listings that would be found on platforms like LinkedIn, Indeed, Internshala, Glassdoor, and company career pages.`,
          },
          {
            role: "user",
            content: `Search for: ${searchQuery}. Return exactly 6-8 job opportunities.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_jobs",
              description: "Return job listings",
              parameters: {
                type: "object",
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        company: { type: "string" },
                        location: { type: "string" },
                        type: { type: "string", enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"] },
                        experience: { type: "string" },
                        skills: { type: "array", items: { type: "string" } },
                        platform: { type: "string" },
                        url: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["title", "company", "location", "type", "experience", "skills", "platform", "url", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["jobs"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_jobs" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let jobs;

    if (toolCall) {
      jobs = JSON.parse(toolCall.function.arguments).jobs;
    } else {
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse response");
      jobs = JSON.parse(jsonMatch[0]).jobs;
    }

    return new Response(JSON.stringify({ jobs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-jobs error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
