import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  parentId: z.string().uuid().optional().nullable(),
});

export const createBrandSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const variantInputSchema = z.object({
  sku: z.string().min(3, "SKU is required"),
  barcode: z.string().min(4, "Barcode is required"),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  price: z.number().positive("Price must be positive"),
  costPrice: z.number().nonnegative().optional().nullable(),
  initialStock: z.number().int().nonnegative().default(0),
  lowStockAlert: z.number().int().nonnegative().default(5),
  shelfLocation: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().optional(),
  basePrice: z.number().positive("Base price must be positive"),
  discountPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().uuid("Valid category ID is required"),
  brandId: z.string().uuid().optional().nullable(),
  images: z.array(z.string().url()).min(1, "At least one product image is required"),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  specifications: z.record(z.any()).optional().nullable(),
  variants: z.array(variantInputSchema).min(1, "At least one product variant is required"),
});

export const stockAdjustmentSchema = z.object({
  variantId: z.string().uuid("Valid variant ID required"),
  newQuantity: z.number().int().nonnegative("Quantity cannot be negative"),
  reason: z.string().min(3, "Adjustment reason is required"),
  movementType: z.enum(["MANUAL_ADJUSTMENT", "DAMAGE_WRITE_OFF"]).default("MANUAL_ADJUSTMENT"),
});

export const restockSchema = z.object({
  variantId: z.string().uuid("Valid variant ID required"),
  quantity: z.number().int().positive("Restock quantity must be greater than zero"),
  reference: z.string().min(2, "Purchase order or invoice reference required"),
  reason: z.string().optional(),
});
