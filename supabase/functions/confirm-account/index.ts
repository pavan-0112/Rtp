
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return new Response(
        JSON.stringify({ error: "Token and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get pending user data
    const { data: pendingUser, error: fetchError } = await supabase
      .from('pending_users')
      .select('*')
      .eq('confirmation_token', token)
      .eq('email', email)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !pendingUser) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired confirmation token" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create the user account
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: pendingUser.email,
      password: pendingUser.password_hash,
      email_confirm: true,
      user_metadata: {
        name: pendingUser.name,
        role: pendingUser.role,
        phone: pendingUser.phone,
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: "Failed to create user account" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Remove the pending user record
    await supabase
      .from('pending_users')
      .delete()
      .eq('id', pendingUser.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account confirmed successfully",
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
          role: pendingUser.role
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error confirming account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
