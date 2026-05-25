import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'asesor'
  const [loading, setLoading] = useState(true);

  // Carga el rol desde la tabla `usuarios`
  async function fetchRole(userId) {
    console.log("FETCH ROLE", userId);

    const { data, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("auth_id", userId)
      .maybeSingle();

    console.log("ROLE DATA", data);
    console.log("ROLE ERROR", error);

    if (error) {
      console.error("fetchRole:", error);
      return null;
    }

    return data?.rol ?? null;
  }
  useEffect(() => {
    // Sesión activa al montar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setRole(await fetchRole(session.user.id));
      }
      setLoading(false);
    });

    // Listener para cambios de sesión (login / logout / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setRole(await fetchRole(session.user.id));
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    console.log("LOGIN START");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESPONSE", data);
    console.log("LOGIN ERROR", error);

    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el contexto
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
