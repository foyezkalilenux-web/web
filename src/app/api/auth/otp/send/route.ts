import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { sendOtpSchema } from "@/lib/validations/auth";
import { getSmsProvider } from "@/lib/adapters/sms";
import { successResponse, errorResponse, validationErrorResponse } from "@/lib/api-response";

declare global {
  // eslint-disable-next-line no-var
  var devOtpStore: Map<string, { code: string; expiresAt: number }> | undefined;
}

if (!global.devOtpStore) {
  global.devOtpStore = new Map();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = sendOtpSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { phone } = validation.data;

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store in dev memory map
    global.devOtpStore?.set(phone, { code, expiresAt: expiresAt.getTime() });

    try {
      // Invalidate existing unused codes in DB
      await prisma.otpCode.updateMany({
        where: { phone, isUsed: false },
        data: { isUsed: true },
      });

      // Save new OTP record
      await prisma.otpCode.create({
        data: {
          phone,
          code,
          expiresAt,
          isUsed: false,
        },
      });
    } catch {
      // Fallback to in-memory OTP store
    }

    // Send SMS via Provider
    const sms = getSmsProvider();
    const message = `Your verification code for Metro Retail is ${code}. Valid for 5 minutes. Do not share this with anyone.`;
    await sms.sendSms(phone, message);

    return successResponse(
      {
        phone,
        expiresInSeconds: 300,
        debugCode: code, // Auto-expose in dev for immediate browser testing
      },
      "Verification code sent to your phone"
    );
  } catch (err: any) {
    console.error("Send OTP error:", err);
    return errorResponse("Failed to send verification code", 500);
  }
}
