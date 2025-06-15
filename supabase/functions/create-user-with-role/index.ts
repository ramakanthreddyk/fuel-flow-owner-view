
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
      return new Response(JSON.stringify({ error: authError?.message || "Failed to create auth user", details: authError }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const userId = userData.user.id;

    // 2. Check if user already exists in users table
    const { data: existingUser, error: userCheckErr } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("id", userId)
      .maybeSingle();

    if (userCheckErr) {
      return new Response(JSON.stringify({ error: "User lookup failed", details: userCheckErr.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!existingUser) {
      const { error: userInsertError } = await supabase
        .from("users")
        .insert([{ id: userId, name, email, password }]);

      if (userInsertError) {
        // Enhanced error details:
        return new Response(JSON.stringify({
          error: "User DB insert failed",
          details: userInsertError.message,
          code: userInsertError.code,
          hint: userInsertError.hint,
          constraint: userInsertError.constraint,
          column: userInsertError.column,
          table: userInsertError.table,
        }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    }

    // 3. user_roles row is now inserted automatically by database trigger after inserting into users.
    // Optional: You may want to update the role from its default value (employee) if requested specifically.
    // If you need to support a non-default role at insert time, you may want extra logic.
    // For now, the role will always default to 'employee' on user creation.

    return new Response(
      JSON.stringify({ id: userId, name, email, role: "employee", message: "User created successfully" }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Server error",
      details: err && typeof err === "object" ? (
        typeof err.message === "string" ? err.message : JSON.stringify(err)
      ) : String(err)
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
