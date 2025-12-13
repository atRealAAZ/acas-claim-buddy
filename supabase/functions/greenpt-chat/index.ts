import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GREENPT_API_KEY = Deno.env.get('GREENPT_API_KEY');
    
    if (!GREENPT_API_KEY) {
      throw new Error('GREENPT_API_KEY is not configured');
    }

    console.log('Calling GreenPT API with messages:', JSON.stringify(messages));

    const response = await fetch('https://api.greenpt.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GREENPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'green-l',
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GreenPT API error:', response.status, errorText);
      throw new Error(`GreenPT API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('GreenPT response:', JSON.stringify(data));
    
    const assistantMessage = data.choices?.[0]?.message?.content || 'No response from GreenPT';

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in greenpt-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
