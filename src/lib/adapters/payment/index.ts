export interface PaymentInitiateRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerPhone: string;
  callbackUrl: string;
}

export interface PaymentInitiateResponse {
  success: boolean;
  paymentUrl?: string;
  transactionRef?: string;
  error?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status: "PAID" | "FAILED" | "PENDING";
  transactionRef?: string;
  rawPayload?: any;
  error?: string;
}

export interface PaymentAdapter {
  initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResponse>;
  verifyPayment(paymentId: string, params: Record<string, any>): Promise<PaymentVerifyResponse>;
}

export class CashPaymentAdapter implements PaymentAdapter {
  async initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    return {
      success: true,
      transactionRef: `CASH-${req.orderNumber}`,
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentVerifyResponse> {
    return {
      success: true,
      status: "PAID",
      transactionRef: `CASH-${Date.now()}`,
    };
  }
}

export class BkashPaymentAdapter implements PaymentAdapter {
  private appKey: string;
  private appSecret: string;
  private username: string;
  private password: string;
  private baseUrl: string;

  constructor() {
    this.appKey = process.env.BKASH_APP_KEY || "";
    this.appSecret = process.env.BKASH_APP_SECRET || "";
    this.username = process.env.BKASH_USERNAME || "";
    this.password = process.env.BKASH_PASSWORD || "";
    this.baseUrl = process.env.BKASH_BASE_URL || "https://tokenized.sandbox.bka.sh/v1.2.0-beta";
  }

  async initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    if (!this.appKey || !this.appSecret) {
      // Mock bKash URL for testing without credentials
      return {
        success: true,
        paymentUrl: `${req.callbackUrl}?paymentId=BKASH-MOCK-${Date.now()}&status=success`,
        transactionRef: `BKASH-MOCK-${Date.now()}`,
      };
    }

    try {
      // Call tokenized bKash API
      const tokenRes = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          username: this.username,
          password: this.password,
        },
        body: JSON.stringify({
          app_key: this.appKey,
          app_secret: this.appSecret,
        }),
      });

      const tokenData = await tokenRes.json();
      const idToken = tokenData.id_token;

      const createRes = await fetch(`${this.baseUrl}/tokenized/checkout/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
          "X-APP-Key": this.appKey,
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: req.customerPhone,
          callbackURL: req.callbackUrl,
          amount: req.amount.toFixed(2),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: req.orderNumber,
        }),
      });

      const createData = await createRes.json();
      return {
        success: !!createData.bkashURL,
        paymentUrl: createData.bkashURL,
        transactionRef: createData.paymentID,
        error: createData.statusMessage,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async verifyPayment(paymentId: string, params: Record<string, any>): Promise<PaymentVerifyResponse> {
    if (paymentId.startsWith("BKASH-MOCK")) {
      return {
        success: true,
        status: "PAID",
        transactionRef: `TRX-${Date.now().toString().slice(-8)}`,
      };
    }

    return {
      success: true,
      status: "PAID",
      transactionRef: paymentId,
    };
  }
}

export function getPaymentAdapter(method: "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "CARD"): PaymentAdapter {
  switch (method) {
    case "BKASH":
      return new BkashPaymentAdapter();
    case "CASH":
    default:
      return new CashPaymentAdapter();
  }
}
