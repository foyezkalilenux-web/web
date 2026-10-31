export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsProvider {
  sendSms(to: string, message: string): Promise<SmsSendResult>;
}

class MockSmsProvider implements SmsProvider {
  async sendSms(to: string, message: string): Promise<SmsSendResult> {
    console.log(`\n================= [DEV SMS GATEWAY] =================`);
    console.log(`📲 TO:      ${to}`);
    console.log(`💬 MESSAGE: ${message}`);
    console.log(`=====================================================\n`);
    return {
      success: true,
      messageId: `mock-msg-${Date.now()}`,
    };
  }
}

class GreenwebSmsProvider implements SmsProvider {
  private token: string;

  constructor() {
    this.token = process.env.SMS_API_KEY || "";
  }

  async sendSms(to: string, message: string): Promise<SmsSendResult> {
    if (!this.token) {
      console.warn("⚠️ Greenweb SMS token missing. Falling back to mock SMS.");
      return new MockSmsProvider().sendSms(to, message);
    }

    try {
      const formattedTo = to.replace("+", "");
      const params = new URLSearchParams({
        token: this.token,
        to: formattedTo,
        message: message,
      });

      const response = await fetch("http://api.greenweb.com.bd/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const text = await response.text();
      return {
        success: text.toLowerCase().includes("ok"),
        messageId: text,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to dispatch SMS",
      };
    }
  }
}

export function getSmsProvider(): SmsProvider {
  const provider = (process.env.SMS_PROVIDER || "mock").toLowerCase();
  switch (provider) {
    case "greenweb":
      return new GreenwebSmsProvider();
    case "mock":
    default:
      return new MockSmsProvider();
  }
}
