import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const clearCorruptSession = async () => {
      localStorage.removeItem("sb-vhxzeywrjzdpwxagzfbg-auth-token");
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // Ignore network/abort errors during local cleanup
      }
      if (mounted) {
        setSession(null);
        setUser(null);
      }
    };

    // Never block UI indefinitely on auth bootstrap
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 2500);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" && !session) {
        void clearCorruptSession();
        if (mounted) setLoading(false);
        clearTimeout(timeout);
        return;
      }

      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
      clearTimeout(timeout);
    });

    supabase.auth.getSession()
      .then(async ({ data: { session }, error }) => {
        if (error) {
          await clearCorruptSession();
        } else if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      })
      .catch(async (err) => {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Auth bootstrap error:", err);
        }
        await clearCorruptSession();
      })
      .finally(() => {
        if (mounted) setLoading(false);
        clearTimeout(timeout);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
