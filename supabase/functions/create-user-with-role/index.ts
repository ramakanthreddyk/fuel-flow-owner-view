import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, password, role = "employee" } = await req.json();
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Instantiate admin client with Service Role Key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Create Auth User (in auth.users)
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name }
    });

    if (authError || !userData?.user) {
      return new Response(JSON.stringify({ error: authError?.message || "Failed to create auth user" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 2. Check if user is already in public.users
    const { user } = userData;
    const { data: existingUser, error: fetchUserError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (fetchUserError) {
      return new Response(JSON.stringify({ error: fetchUserError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Helper to upsert user_roles
    async function ensureUserRole(userId: string, roleVal: string) {
      // Check if user_role row exists for this user and role
      const { data: existRoleRow, error: roleReadErr } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", roleVal)
        .maybeSingle();
      if (roleReadErr) return { error: roleReadErr };
      if (!existRoleRow) {
        // Insert new user_role
        const { error: insErr } = await supabase
          .from("user_roles")
          .insert([{ user_id: userId, role: roleVal }]);
        if (insErr) return { error: insErr };
      }
      return { ok: true };
    }

    if (existingUser) {
      // User already exists in the users table. Ensure correct role exists.
      await ensureUserRole(existingUser.id, role);
      return new Response(
        JSON.stringify({ id: existingUser.id, name: existingUser.name, email: existingUser.email, role, message: "User already exists." }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. Add entry to public.users (trigger will handle user_roles, but we override it right after)
    const { data: appUser, error: userTableError } = await supabase
      .from("users")
      .insert([{ id: user.id, name, email, password }])
      .select("id, name, email")
      .maybeSingle();

    if (userTableError || !appUser) {
      return new Response(JSON.stringify({ error: userTableError?.message || "User insert failed" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 4. Insert intended role (overriding default if needed)
    await ensureUserRole(appUser.id, role);

    return new Response(
      JSON.stringify({ id: appUser.id, name: appUser.name, email: appUser.email, role }),
      { headers: corsHeaders }
    );
  } catch (err) {
    // Catch-all error
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
