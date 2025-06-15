
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

    // Create user in auth.users
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

    // Insert into users table (if not already inserted via triggers)
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

    // Insert into user_roles if not present (in case triggers don't do it, or a custom role is requested)
    const { data: userRoleData, error: userRoleError } = await supabase
      .from("user_roles")
      .select("id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!userRoleData) {
      // Insert with requested role (superadmin/owner/employee)
      const { error: insertRoleErr } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role }]);
      if (insertRoleErr) {
        return new Response(JSON.stringify({
          error: "Role DB insert failed",
          details: insertRoleErr.message,
          code: insertRoleErr.code,
          constraint: insertRoleErr.constraint,
          column: insertRoleErr.column,
          table: insertRoleErr.table,
        }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    }

    // Done - leave additional logic (station creation/assignment) to the client/other endpoints
    return new Response(JSON.stringify({
      id: userId,
      name,
      email,
      role,
      message: "User created successfully (no station/assignment done; handle in follow-up calls)"
    }), {
      status: 200,
      headers: corsHeaders,
    });

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
