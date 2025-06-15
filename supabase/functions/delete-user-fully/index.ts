
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
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing user id" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Delete user from auth.users
    const { error: authErr } = await supabase.auth.admin.deleteUser(id);
    if (authErr) {
      return new Response(JSON.stringify({ error: `Auth user deletion failed: ${authErr.message}` }), {
        status: 500, headers: corsHeaders
      });
    }

    // 2. Delete from user_roles
    const { error: rolesErr } = await supabase.from("user_roles").delete().eq("user_id", id);
    if (rolesErr) {
      return new Response(JSON.stringify({ error: `user_roles deletion failed: ${rolesErr.message}` }), {
        status: 500, headers: corsHeaders
      });
    }

    // 3. Delete from users table
    const { error: usersErr } = await supabase.from("users").delete().eq("id", id);
    if (usersErr) {
      return new Response(JSON.stringify({ error: `users deletion failed: ${usersErr.message}` }), {
        status: 500, headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", details: err?.message || String(err) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
