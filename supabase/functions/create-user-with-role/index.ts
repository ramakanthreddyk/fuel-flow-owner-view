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
      return new Response(JSON.stringify({ error: "Missing required fields: name, email, or password" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Create user in auth.users
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

    const userId = userData.user.id;

    // 2. Insert into users table (application-specific user record)
    const { error: userInsertError } = await supabase
      .from("users")
      .insert([{ id: userId, name, email, password }]);

    if (userInsertError) {
      return new Response(JSON.stringify({ error: "User DB insert failed", details: userInsertError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 3. Ensure user role is set AFTER user insert is confirmed
    const ensureUserRole = async (uid: string, roleVal: string) => {
      const { data: existingRole, error: readErr } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", uid)
        .eq("role", roleVal)
        .maybeSingle();

      if (readErr) return { error: `Error reading user_roles: ${readErr.message}` };

      if (!existingRole) {
        const { error: insertErr } = await supabase
          .from("user_roles")
          .insert([{ user_id: uid, role: roleVal }]);

        if (insertErr) return { error: `Role insert failed: ${insertErr.message}` };
      }

      return { ok: true };
    };

    const roleResult = await ensureUserRole(userId, role);
    if ("error" in roleResult) {
      return new Response(JSON.stringify({ error: roleResult.error }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ id: userId, name, email, role, message: "User created successfully" }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
