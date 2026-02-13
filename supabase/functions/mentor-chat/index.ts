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

    const { messages } = await req.json();

    const { data: profile } = await supabase
      .from("profiles")
      .select("selected_role, role_category, daily_time_minutes, full_name")
      .eq("user_id", user.id)
      .single();

    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id);

    const progressInfo = progress && progress.length > 0
      ? progress.map(p => `${p.skill_name}: ${p.completion_percentage}% (${p.days_practiced} days, streak: ${p.current_streak})`).join("\n")
      : "No progress tracked yet.";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are J-AI Mentor, a friendly and knowledgeable career assistant. 
    
User: ${profile?.full_name || "Learner"}
Role: ${profile?.selected_role || "Not selected"}
Category: ${profile?.role_category || "Not selected"}  
Daily time: ${profile?.daily_time_minutes || 60} minutes

Progress:
${progressInfo}

You help with:
- Career advice and guidance for their chosen role
- Skill recommendations and learning paths
- Resume tips and project suggestions
- Motivation and consistency coaching
- Technical concept explanations

Keep responses concise, actionable, and encouraging. Use markdown formatting. Only recommend free resources.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mentor-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
