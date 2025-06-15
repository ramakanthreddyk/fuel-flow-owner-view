
import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project info (already present in doc context)
const SUPABASE_URL = "https://lkzodyzhxdyztormkfbw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrem9keXpoeGR5enRvcm1rZmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODA3OTksImV4cCI6MjA2NTU1Njc5OX0.l9dI4QqKS44ImFK-Y7FrgIUtXMPErYK3fjiGKkadj5o";

// Customize localStorage & session persistence here if needed
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
