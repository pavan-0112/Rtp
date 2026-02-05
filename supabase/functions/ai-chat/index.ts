
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userRole } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

    const systemPrompt = `You are an AI assistant for a property management system. You help ${userRole}s with their questions about rentals, maintenance, payments, and property management. 

    Context about the system:
    - This is a property management platform connecting landlords and tenants
    - Tenants can browse properties, apply for rentals, pay rent, and submit maintenance requests
    - Landlords can manage properties, review applications, and handle maintenance
    - Users can verify property status through government verification

    Your responses should be:
    - Helpful and specific to property management
    - Professional but friendly
    - Relevant to the user's role (${userRole})
    - Concise and actionable

    Common topics include:
    - Rent payments and due dates
    - Maintenance request procedures
    - Application processes
    - Landlord/tenant communication
    - Property verification
    - Account management`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
