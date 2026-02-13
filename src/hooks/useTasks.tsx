import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", user?.id, today],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("task_date", today)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const generateTasks = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("generate-tasks");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Tasks generated!", description: "Your daily learning tasks are ready." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to generate tasks.", variant: "destructive" });
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("daily_tasks")
        .update({ completed })
        .eq("id", taskId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });

  const completedCount = tasks?.filter((t) => t.completed).length || 0;
  const totalCount = tasks?.length || 0;

  return { tasks, isLoading, generateTasks, toggleTask, completedCount, totalCount };
}
