import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useProgress() {
  const { user } = useAuth();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("skill_name", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: allTasks } = useQuery({
    queryKey: ["all-tasks-stats", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("task_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalTasks = allTasks?.length || 0;
  const completedTasks = allTasks?.filter((t) => t.completed).length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate streak
  const tasksByDate = new Map<string, boolean>();
  allTasks?.forEach((t) => {
    const date = t.task_date;
    if (!tasksByDate.has(date)) tasksByDate.set(date, true);
    if (!t.completed) tasksByDate.set(date, false);
  });

  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const allCompleted = tasksByDate.get(dateStr);
    if (allCompleted === true) {
      currentStreak++;
    } else if (allCompleted === false || (i > 0 && allCompleted === undefined)) {
      break;
    }
  }

  const longestStreak = progress?.reduce((max, p) => Math.max(max, p.longest_streak), 0) || 0;

  return {
    progress,
    isLoading,
    totalTasks,
    completedTasks,
    completionRate,
    currentStreak,
    longestStreak,
  };
}
