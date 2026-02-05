
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  name: string;
  role: 'landlord' | 'tenant';
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, role, token }: ConfirmationEmailRequest = await req.json();

    const confirmationUrl = `${Deno.env.get("SUPABASE_URL")?.replace('/v1', '')}/confirm-account?token=${token}&email=${encodeURIComponent(email)}`;

    const emailResponse = await resend.emails.send({
      from: "PropertyPro <onboarding@resend.dev>",
      to: [email],
      subject: "Confirm Your PropertyPro Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">PropertyPro</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Property Management Platform</p>
          </div>
          
          <h2 style="color: #1f2937;">Welcome ${name}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for signing up as a <strong>${role}</strong> on PropertyPro. 
            To complete your registration and activate your account, please confirm your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold; 
                      display: inline-block;">
              Confirm Account
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${confirmationUrl}" style="color: #2563eb; word-break: break-all;">
              ${confirmationUrl}
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
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
