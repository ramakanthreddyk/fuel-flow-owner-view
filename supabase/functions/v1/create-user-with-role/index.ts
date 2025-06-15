
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
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert user
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

    // Insert user role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ user_id: user.id, role }]);

    if (roleError) {
      // Attempt rollback if possible
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
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
