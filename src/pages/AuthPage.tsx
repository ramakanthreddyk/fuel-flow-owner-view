
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const redirectTo = `${window.location.origin}/auth`;
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: redirectTo }
      });
      if (error) setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>
        <form className="grid gap-4" onSubmit={handleSubmit} autoComplete="on">
          <Input
            required
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            required
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button className="w-full mt-2" type="submit" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-center">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button
                className="text-blue-600 font-medium ml-1"
                onClick={() => setMode("signup")}
                disabled={loading}
                type="button"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                className="text-blue-600 font-medium ml-1"
                onClick={() => setMode("login")}
                disabled={loading}
                type="button"
              >
                Log in
              </button>
            </>
          )}
        </div>
        <div className="text-muted-foreground text-xs italic mt-2">
          For demo: Use any email, password &gt;6 characters.
        </div>
      </div>
    </div>
  );
}

