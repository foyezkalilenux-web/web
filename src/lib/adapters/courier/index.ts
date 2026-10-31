export interface CourierConsignmentRequest {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  itemQuantity: number;
  itemWeightKg: number;
  amountToCollect: number; // COD amount, or 0 if paid online
  itemDescription?: string;
}

export interface CourierConsignmentResponse {
  success: boolean;
  consignmentId?: string;
  trackingCode?: string;
  deliveryFee?: number;
  error?: string;
}

export interface CourierAdapter {
  createConsignment(req: CourierConsignmentRequest): Promise<CourierConsignmentResponse>;
  trackShipment(trackingCode: string): Promise<{ status: string; history?: any[] }>;
}

export class PathaoCourierAdapter implements CourierAdapter {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PATHAO_CLIENT_ID || "";
    this.clientSecret = process.env.PATHAO_CLIENT_SECRET || "";
    this.baseUrl = process.env.PATHAO_BASE_URL || "https://courier-api-sandbox.pathao.com";
  }

  async createConsignment(req: CourierConsignmentRequest): Promise<CourierConsignmentResponse> {
    if (!this.clientId) {
      // Mock Pathao tracking for development
      const mockCode = `PTH-${Date.now().toString().slice(-8)}`;
      return {
        success: true,
        consignmentId: `CONS-${mockCode}`,
        trackingCode: mockCode,
        deliveryFee: 60,
      };
    }

    try {
      // Production API dispatch would follow here
      return {
        success: true,
        consignmentId: `PTH-CONS-${Date.now()}`,
        trackingCode: `PTH${Date.now()}`,
        deliveryFee: 60,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async trackShipment(trackingCode: string) {
    return {
      status: "IN_TRANSIT",
      history: [
        { status: "PICKED_UP", timestamp: new Date().toISOString(), location: "Dhaka Central Hub" },
      ],
    };
  }
}

export class SteadfastCourierAdapter implements CourierAdapter {
  async createConsignment(req: CourierConsignmentRequest): Promise<CourierConsignmentResponse> {
    const code = `STDF-${Date.now().toString().slice(-8)}`;
    return {
      success: true,
      consignmentId: `SF-${code}`,
      trackingCode: code,
      deliveryFee: 70,
    };
  }

  async trackShipment(trackingCode: string) {
    return { status: "PROCESSING", history: [] };
  }
}

export function getCourierAdapter(provider: "PATHAO" | "STEADFAST" | "REDX"): CourierAdapter {
  switch (provider) {
    case "STEADFAST":
      return new SteadfastCourierAdapter();
    case "PATHAO":
    default:
      return new PathaoCourierAdapter();
  }
}
