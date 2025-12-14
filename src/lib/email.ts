const ACTIVEPIECES_WEBHOOK_URL = "https://cloud.activepieces.com/api/v1/webhooks/4zuxgu8TBVsw07tiglwmn";
const DEFAULT_RECIPIENT = "a.a.zwartsenberg@gmail.com";

interface EmailOptions {
  subject: string;
  html: string;
  to?: string; // Optional - defaults to a.a.zwartsenberg@gmail.com
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const recipient = options.to || DEFAULT_RECIPIENT;
  
  try {
    console.log("Sending email via ActivePieces:", { to: recipient, subject: options.subject });
    
    const response = await fetch(ACTIVEPIECES_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: recipient,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Email send failed:", errorText);
      return { success: false, error: errorText };
    }

    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
