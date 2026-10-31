import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaffRole } from "@/lib/auth";
import { createBrandSchema } from "@/lib/validations/catalog";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  forbiddenResponse,
} from "@/lib/api-response";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return successResponse(brands);
  } catch (err: any) {
    return errorResponse("Failed to load brands", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireStaffRole(req, ["SUPER_ADMIN", "INVENTORY_MANAGER"]);
  if (!auth.authorized) {
    return forbiddenResponse(auth.error);
  }

  try {
    const body = await req.json();
    const validation = createBrandSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { name, slug, logoUrl } = validation.data;

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse("A brand with this slug already exists", 400);
    }

    const brand = await prisma.brand.create({
      data: { name, slug, logoUrl },
    });

    return successResponse(brand, "Brand created successfully", 201);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to create brand", 500);
  }
}
