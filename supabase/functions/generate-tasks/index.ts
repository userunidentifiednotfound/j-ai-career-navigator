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

    const { data: profile } = await supabase
      .from("profiles")
      .select("selected_role, role_category, daily_time_minutes")
      .eq("user_id", user.id)
      .single();

    if (!profile?.selected_role) throw new Error("No role selected");

    // Check if tasks already exist for today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingTasks } = await supabase
      .from("daily_tasks")
      .select("id")
      .eq("user_id", user.id)
      .eq("task_date", today);

    if (existingTasks && existingTasks.length > 0) {
      return new Response(JSON.stringify({ message: "Tasks already generated for today", tasks: existingTasks }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user progress to personalize tasks
    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const timeMinutes = profile.daily_time_minutes || 60;
    const progressSummary = progress && progress.length > 0
      ? progress.map(p => `${p.skill_name}: ${p.completion_percentage}%`).join(", ")
      : "Brand new learner, no progress yet.";

    const systemPrompt = `You are J-AI, a career learning assistant. Generate daily learning tasks for a "${profile.selected_role}" in the "${profile.role_category}" category.

The user has ${timeMinutes} minutes per day. Split into:
- Learn (40% of time): Theory, concepts, tutorials
- Practice (40% of time): Hands-on coding/exercises
- Revise (20% of time): Review and reinforce

User's current progress: ${progressSummary}

Rules:
- Only recommend FREE platforms (YouTube, freeCodeCamp, Coursera audit, LeetCode, HackerRank, Kaggle, GeeksforGeeks, W3Schools, MDN, etc.)
- Tasks should be progressive - start from fundamentals if new, advance if experienced
- Be specific about what to learn/practice (not vague)
- Include platform name and URL for each task`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate exactly 3-5 tasks for today. Respond with valid JSON only, no markdown. Format: { "tasks": [{ "title": "...", "description": "...", "task_type": "learn|practice|revise", "duration_minutes": N, "platform_name": "...", "platform_url": "https://..." }] }` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_daily_tasks",
              description: "Generate daily learning tasks",
              parameters: {
                type: "object",
                properties: {
                  tasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        task_type: { type: "string", enum: ["learn", "practice", "revise"] },
                        duration_minutes: { type: "number" },
                        platform_name: { type: "string" },
                        platform_url: { type: "string" },
                      },
                      required: ["title", "description", "task_type", "duration_minutes", "platform_name", "platform_url"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["tasks"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_daily_tasks" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let tasks;

    if (toolCall) {
      tasks = JSON.parse(toolCall.function.arguments).tasks;
    } else {
      // Fallback: parse from content
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse AI response");
      tasks = JSON.parse(jsonMatch[0]).tasks;
    }

    // Insert tasks into database
    const taskRecords = tasks.map((t: any) => ({
      user_id: user.id,
      title: t.title,
      description: t.description,
      task_type: t.task_type,
      duration_minutes: t.duration_minutes,
      platform_name: t.platform_name || null,
      platform_url: t.platform_url || null,
      task_date: today,
      completed: false,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("daily_tasks")
      .insert(taskRecords)
      .select();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ tasks: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-tasks error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
