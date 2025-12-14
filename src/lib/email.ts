const ACTIVEPIECES_WEBHOOK_URL = "https://cloud.activepieces.com/api/v1/webhooks/4zuxgu8TBVsw07tiglwmn";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Sending email via ActivePieces:", { to: options.to, subject: options.subject });
    
    const response = await fetch(ACTIVEPIECES_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: options.to,
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
