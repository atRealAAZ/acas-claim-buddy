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
    const { formType, formData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${formType} form with data:`, formData);

    let systemPrompt = "";
    let userPrompt = "";

    if (formType === "acas") {
      systemPrompt = `You are an expert legal assistant helping with UK Employment Tribunal claims. Generate a complete ACAS Early Conciliation form based on the provided information. Format the response as a clear, structured form that can be used to fill in the official ACAS Early Conciliation notification.`;
      
      userPrompt = `Please generate an ACAS Early Conciliation form based on the following information:

Personal Details:
- Full Name: ${formData.fullName || 'Not provided'}
- Address: ${formData.address || 'Not provided'}
- Email: ${formData.email || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}

Employer Details:
- Employer Name: ${formData.employerName || 'Not provided'}
- Employer Address: ${formData.employerAddress || 'Not provided'}

Employment Details:
- Start Date: ${formData.employmentStartDate || 'Not provided'}
- End Date: ${formData.employmentEndDate || 'Not provided'}
- Job Title: ${formData.jobTitle || 'Not provided'}

Complaint Summary:
${formData.complaintSummary || 'Not provided'}

Please generate a complete, properly formatted ACAS Early Conciliation notification with all sections filled in appropriately.`;
    } else if (formType === "et1") {
      systemPrompt = `You are an expert legal assistant helping with UK Employment Tribunal claims. Generate a complete ET1 Claim Form based on the provided information. This should include a detailed "Grounds of Complaint" section that clearly explains the legal basis for the claim.`;
      
      userPrompt = `Please generate an ET1 Employment Tribunal Claim Form based on the following information:

Personal Details:
- Full Name: ${formData.fullName || 'Not provided'}
- Address: ${formData.address || 'Not provided'}
- Email: ${formData.email || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}

ACAS Certificate:
- Certificate Number: ${formData.acasCertificateNumber || 'Not provided'}

Employer Details:
- Employer Name: ${formData.employerName || 'Not provided'}
- Employer Address: ${formData.employerAddress || 'Not provided'}

Employment Details:
- Start Date: ${formData.employmentStartDate || 'Not provided'}
- End Date: ${formData.employmentEndDate || 'Not provided'}
- Job Title: ${formData.jobTitle || 'Not provided'}
- Weekly Pay: ${formData.weeklyPay || 'Not provided'}
- Notice Period: ${formData.noticePeriod || 'Not provided'}

Type of Claim:
${formData.claimType || 'Not provided'}

Detailed Complaint:
${formData.detailedComplaint || 'Not provided'}

Please generate a complete ET1 form with a comprehensive "Grounds of Complaint" section that explains the legal basis for this claim.`;
    } else {
      throw new Error("Invalid form type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedForm = data.choices?.[0]?.message?.content;

    console.log("Form generated successfully");

    return new Response(JSON.stringify({ generatedForm }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-form function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
