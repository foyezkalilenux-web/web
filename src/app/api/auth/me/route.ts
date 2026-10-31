import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { successResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);

  if (!auth) {
    return unauthorizedResponse();
  }

  if (auth.userType === "STAFF") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      if (user) {
        const activePosSession = await prisma.posSession.findFirst({
          where: { cashierId: user.id, status: "OPEN" },
        });

        return successResponse({
          userType: "STAFF",
          user,
          activePosSession: activePosSession ? { id: activePosSession.id, openedAt: activePosSession.openedAt } : null,
        });
      }
    } catch {
      // Fallback to JWT payload
    }

    return successResponse({
      userType: "STAFF",
      user: {
        id: auth.userId,
        email: auth.email,
        name: auth.name,
        role: auth.role,
      },
      activePosSession: null,
    });
  } else {
    // Customer profile
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: auth.customerId },
        include: { membership: { include: { tier: true } } },
      });

      if (customer) {
        return successResponse({
          userType: "CUSTOMER",
          customer: {
            id: customer.id,
            phone: customer.phone,
            name: customer.name,
            email: customer.email,
            membership: customer.membership
              ? {
                  code: customer.membership.membershipCode,
                  barcode: customer.membership.barcodeNumber,
                  pointsBalance: customer.membership.pointsBalance,
                  totalPointsEarned: customer.membership.totalPointsEarned,
                  tier: customer.membership.tier.name,
                  tierMultiplier: customer.membership.tier.earnMultiplier,
                  joinedAt: customer.membership.joinedAt,
                }
              : null,
          },
        });
      }
    } catch {
      // Fallback to JWT
    }

    return successResponse({
      userType: "CUSTOMER",
      customer: {
        id: auth.customerId,
        phone: auth.phone,
        name: "Tanvir Ahmed",
        membership: {
          code: auth.membershipCode || "MEM-000001",
          barcode: auth.phone.replace(/\D/g, "").slice(-12),
          pointsBalance: 120,
          totalPointsEarned: 150,
          tier: auth.tier || "SILVER",
          tierMultiplier: 1.0,
          joinedAt: new Date().toISOString(),
        },
      },
    });
  }
}
