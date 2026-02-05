
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  role: 'landlord' | 'tenant';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, role }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "PropertyPro <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to PropertyPro!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">PropertyPro</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Property Management Platform</p>
          </div>
          
          <h2 style="color: #1f2937;">Welcome to PropertyPro, ${name}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Congratulations! Your ${role} account has been successfully created and is ready to use.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">What's next?</h3>
            ${role === 'landlord' ? `
              <ul style="color: #4b5563; line-height: 1.6;">
                <li>Add your properties to the platform</li>
                <li>Manage tenant applications</li>
                <li>Track rent payments and maintenance requests</li>
                <li>Use our AI-powered customer support</li>
              </ul>
            ` : `
              <ul style="color: #4b5563; line-height: 1.6;">
                <li>Browse available properties</li>
                <li>Submit rental applications</li>
                <li>Pay rent online securely</li>
                <li>Request maintenance services</li>
              </ul>
            `}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace('/v1', '')}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold; 
                      display: inline-block;">
              Get Started
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            If you have any questions or need assistance, feel free to reach out to our support team.
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Thank you for choosing PropertyPro for your property management needs.
          </p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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
