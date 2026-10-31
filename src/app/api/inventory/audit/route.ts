import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaffRole } from "@/lib/auth";
import { successResponse, errorResponse, forbiddenResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const auth = requireStaffRole(req, ["SUPER_ADMIN", "INVENTORY_MANAGER"]);
  if (!auth.authorized) {
    return forbiddenResponse(auth.error);
  }

  try {
    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get("variantId");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    const where: any = {};
    if (variantId) {
      where.inventory = { variantId };
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        inventory: {
          include: {
            variant: {
              include: {
                product: { select: { title: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const formatted = movements.map((m) => ({
      id: m.id,
      productTitle: m.inventory.variant.product.title,
      sku: m.inventory.variant.sku,
      barcode: m.inventory.variant.barcode,
      size: m.inventory.variant.size,
      color: m.inventory.variant.color,
      movementType: m.movementType,
      quantityDelta: m.quantityDelta,
      balanceAfter: m.balanceAfter,
      reference: m.reference,
      reason: m.reason,
      createdAt: m.createdAt,
    }));

    return successResponse(formatted);
  } catch (err: any) {
    console.error("Audit log error:", err);
    return errorResponse("Failed to load audit logs", 500);
  }
}
