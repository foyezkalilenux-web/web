import { prisma } from "@/lib/db";
import type { StockMovementType } from "@prisma/client";

export interface StockDeductionItem {
  variantId: string;
  quantity: number;
}

export class InventoryService {
  /**
   * Transactional stock deduction for Online Orders or POS Sales.
   * Throws an error if any item has insufficient stock, preventing overselling.
   */
  static async deductStock(
    items: StockDeductionItem[],
    movementType: "ONLINE_ORDER_DEDUCT" | "POS_SALE_DEDUCT",
    reference: string,
    actorId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const results = [];

      for (const item of items) {
        // Fetch current inventory
        const inv = await tx.inventory.findUnique({
          where: { variantId: item.variantId },
          include: { variant: { include: { product: true } } },
        });

        if (!inv) {
          throw new Error(`Inventory record not found for variant ID: ${item.variantId}`);
        }

        if (inv.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${inv.variant.product.title} - ${inv.variant.sku}". Available: ${inv.quantity}, Requested: ${item.quantity}`
          );
        }

        const newBalance = inv.quantity - item.quantity;

        // Atomically update inventory
        const updatedInv = await tx.inventory.update({
          where: { id: inv.id },
          data: {
            quantity: newBalance,
          },
        });

        // Record immutable stock movement log
        await tx.stockMovement.create({
          data: {
            inventoryId: inv.id,
            movementType,
            quantityDelta: -item.quantity,
            balanceAfter: newBalance,
            reference,
            reason: movementType === "POS_SALE_DEDUCT" ? "In-Store POS Sale" : "Online Web Order",
            createdById: actorId,
          },
        });

        results.push(updatedInv);
      }

      return results;
    });
  }

  /**
   * Restock or return inventory addition.
   */
  static async addStock(
    variantId: string,
    quantity: number,
    movementType: "PURCHASE_RECEIPT" | "CUSTOMER_RETURN",
    reference: string,
    reason?: string,
    actorId?: string
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    return prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.upsert({
        where: { variantId },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          variantId,
          quantity,
          lowStockAlert: 5,
        },
      });

      await tx.stockMovement.create({
        data: {
          inventoryId: inv.id,
          movementType,
          quantityDelta: quantity,
          balanceAfter: inv.quantity,
          reference,
          reason: reason || (movementType === "PURCHASE_RECEIPT" ? "Supplier Restock" : "Customer Return"),
          createdById: actorId,
        },
      });

      return inv;
    });
  }

  /**
   * Manual inventory adjustment (e.g. physical count reconciliation or damage write-off).
   */
  static async adjustStock(
    variantId: string,
    newQuantity: number,
    reason: string,
    movementType: "MANUAL_ADJUSTMENT" | "DAMAGE_WRITE_OFF" = "MANUAL_ADJUSTMENT",
    actorId?: string
  ) {
    if (newQuantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    return prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.findUniqueOrThrow({
        where: { variantId },
      });

      const delta = newQuantity - inv.quantity;
      if (delta === 0) return inv;

      const updated = await tx.inventory.update({
        where: { id: inv.id },
        data: { quantity: newQuantity },
      });

      await tx.stockMovement.create({
        data: {
          inventoryId: inv.id,
          movementType,
          quantityDelta: delta,
          balanceAfter: newQuantity,
          reason,
          createdById: actorId,
        },
      });

      return updated;
    });
  }

  /**
   * Fetch SKUs that are running low on stock.
   */
  static async getLowStockAlerts() {
    const items = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.lowStockAlert,
        },
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { quantity: "asc" },
    });

    return items;
  }
}
