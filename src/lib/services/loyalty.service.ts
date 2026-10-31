import { prisma } from "@/lib/db";
import { MemberTierType } from "@prisma/client";

export class LoyaltyService {
  /**
   * Generates the next unique membership code: MEM-000001, MEM-000002, etc.
   */
  static async generateNextMembershipCode(): Promise<string> {
    const count = await prisma.membership.count();
    const nextNumber = count + 1;
    return `MEM-${String(nextNumber).padStart(6, "0")}`;
  }

  /**
   * Generates a unique barcode for membership physical scanning: 880 + 10 digits
   */
  static generateMembershipBarcode(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.slice(-12);
  }

  /**
   * Fetches or defaults to the base SILVER membership tier
   */
  static async getDefaultTier() {
    let tier = await prisma.membershipTier.findUnique({
      where: { name: MemberTierType.SILVER },
    });

    if (!tier) {
      tier = await prisma.membershipTier.create({
        data: {
          name: MemberTierType.SILVER,
          minSpendThreshold: 0,
          earnMultiplier: 1.0,
          perkDescription: "Base loyalty member, earn 1 point per ৳100 spent.",
        },
      });
    }

    return tier;
  }

  /**
   * Calculates points earned from order total and member tier multiplier
   */
  static async calculatePointsEarned(totalAmount: number, tierMultiplier = 1.0): Promise<number> {
    const ratioSetting = await prisma.systemSetting.findUnique({
      where: { key: "LOYALTY_EARN_SPEND_RATIO" },
    });
    const earnRatio = ratioSetting ? parseFloat(ratioSetting.value) : 100;

    const basePoints = Math.floor(totalAmount / earnRatio);
    return Math.floor(basePoints * tierMultiplier);
  }

  /**
   * Validates redemption request and calculates discount
   */
  static async validateRedemption(
    currentPoints: number,
    requestedPoints: number,
    orderSubtotal: number
  ): Promise<{ valid: boolean; discountAmount: number; error?: string }> {
    if (requestedPoints <= 0) {
      return { valid: true, discountAmount: 0 };
    }

    if (requestedPoints > currentPoints) {
      return { valid: false, discountAmount: 0, error: "Insufficient loyalty points" };
    }

    const minSetting = await prisma.systemSetting.findUnique({ where: { key: "LOYALTY_MIN_REDEEM_POINTS" } });
    const minPoints = minSetting ? parseInt(minSetting.value, 10) : 50;

    if (requestedPoints < minPoints) {
      return { valid: false, discountAmount: 0, error: `Minimum redemption is ${minPoints} points` };
    }

    const valSetting = await prisma.systemSetting.findUnique({ where: { key: "LOYALTY_POINT_REDEEM_VALUE" } });
    const pointValue = valSetting ? parseFloat(valSetting.value) : 1.0;
    const discountAmount = requestedPoints * pointValue;

    const maxPercentSetting = await prisma.systemSetting.findUnique({ where: { key: "LOYALTY_MAX_REDEEM_PERCENT" } });
    const maxPercent = maxPercentSetting ? parseFloat(maxPercentSetting.value) : 25;
    const maxDiscountAllowed = (orderSubtotal * maxPercent) / 100;

    if (discountAmount > maxDiscountAllowed) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Loyalty discount cannot exceed ${maxPercent}% of order subtotal (max ৳${maxDiscountAllowed.toFixed(2)})`,
      };
    }

    return { valid: true, discountAmount };
  }
}
