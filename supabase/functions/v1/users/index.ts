
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { pathname } = new URL(req.url);

  // Create user (add to users + user_roles)
  if (pathname.endsWith("/create") && req.method === "POST") {
    const body = await req.json();
    // expects: {name, email, password, role}
    const { name, email, password, role } = body;
    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    // Insert into users
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select("id, name, email")
      .maybeSingle();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: userError?.message || "User insert failed" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    // Insert role into user_roles
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ user_id: user.id, role }]);
    if (roleError) {
      // rollback user creation for consistency
      await supabase.from("users").delete().eq("id", user.id);
      return new Response(JSON.stringify({ error: "Role insert failed: " + roleError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    return new Response(
      JSON.stringify({ id: user.id, name: user.name, email: user.email, role }),
      { headers: corsHeaders }
    );
  }

  // List all users
  if (pathname.endsWith("/list") && req.method === "GET") {
    const { data: usersList, error } = await supabase
      .from("users")
      .select("id, name, email");
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }
    // fetch their roles
    const { data: rolesTable } = await supabase.from("user_roles").select("user_id, role");
    const withRoles = usersList!.map(u => ({
      ...u,
      role: rolesTable?.find(r => r.user_id === u.id)?.role ?? null,
    }));
    return new Response(JSON.stringify(withRoles), { headers: corsHeaders });
  }

  // Not found fallback
  return new Response("Not Found", { status: 404, headers: corsHeaders });
});
