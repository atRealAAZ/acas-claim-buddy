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

    // Filter out system messages and prepend context to the first user message
    // GreenPT's green-l model doesn't support system prompts
    const systemMessage = messages.find((m: { role: string }) => m.role === 'system');
    const nonSystemMessages = messages.filter((m: { role: string }) => m.role !== 'system');
    
    let processedMessages = nonSystemMessages;
    if (systemMessage && nonSystemMessages.length > 0) {
      // Prepend system context to the first user message
      processedMessages = nonSystemMessages.map((m: { role: string; content: string }, index: number) => {
        if (index === 0 && m.role === 'user') {
          return {
            ...m,
            content: `[Context: ${systemMessage.content}]\n\nUser question: ${m.content}`
          };
        }
        return m;
      });
    }

    console.log('Calling GreenPT API with messages:', JSON.stringify(processedMessages));

    const response = await fetch('https://api.greenpt.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GREENPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'green-l',
        messages: processedMessages,
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
