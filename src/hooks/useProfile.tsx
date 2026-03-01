import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { DEMO_PROFILE, SKIP_AUTH_FOR_TESTING } from "@/lib/testingMode";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id, SKIP_AUTH_FOR_TESTING],
    queryFn: async () => {
      if (!user && SKIP_AUTH_FOR_TESTING) return DEMO_PROFILE;
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user || SKIP_AUTH_FOR_TESTING,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: {
      role_category?: string;
      selected_role?: string;
      daily_time_minutes?: number;
      onboarding_completed?: boolean;
      full_name?: string;
    }) => {
      if (!user && SKIP_AUTH_FOR_TESTING) return;
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return { profile, isLoading, updateProfile };
}
