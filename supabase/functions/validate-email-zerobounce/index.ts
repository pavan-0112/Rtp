
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailValidationRequest {
  email?: string;
}

interface ZeroBounceResponse {
  address: string;
  status: string;
  sub_status: string;
  free_email: boolean;
  did_you_mean: string | null;
  account: string;
  domain: string;
  domain_age_days: string;
  smtp_provider: string;
  mx_found: string;
  mx_record: string;
  firstname: string;
  lastname: string;
  gender: string;
  country: string;
  region: string;
  city: string;
  zipcode: string;
  processed_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: EmailValidationRequest = await req.json();

    // If email is not provided, return None equivalent
    if (!email || email.trim() === "") {
      return new Response(JSON.stringify({ 
        result: null,
        message: "No email provided" 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const apiKey = Deno.env.get("ZEROBOUNCE_API_KEY");
    if (!apiKey) {
      console.error("ZEROBOUNCE_API_KEY not found in environment variables");
      return new Response(JSON.stringify({ 
        result: null,
        error: "API key not configured" 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Make request to ZeroBounce API
    const apiUrl = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email.trim())}`;
    
    console.log(`Making request to ZeroBounce API for email: ${email.trim()}`);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`ZeroBounce API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        result: null,
        error: `API request failed: ${response.status}` 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const data: ZeroBounceResponse = await response.json();
    console.log("ZeroBounce API response:", data);

    // Determine if email is valid based on ZeroBounce status
    // Valid statuses: "valid", "catch-all"
    // Invalid statuses: "invalid", "disposable", "spamtrap", "abuse", "do_not_mail"
    const validStatuses = ["valid", "catch-all"];
    const isValid = validStatuses.includes(data.status);

    return new Response(JSON.stringify({ 
      result: {
        isValid,
        status: data.status,
        subStatus: data.sub_status,
        freeEmail: data.free_email,
        didYouMean: data.did_you_mean,
        domain: data.domain,
        processed_at: data.processed_at
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in email validation function:", error);
    return new Response(
      JSON.stringify({ 
        result: null,
        error: "Network error or invalid response" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
