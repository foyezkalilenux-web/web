import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireStaffRole } from "@/lib/auth";
import { createCategorySchema } from "@/lib/validations/catalog";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  forbiddenResponse,
} from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
        children: true,
      },
      orderBy: { name: "asc" },
    });

    return successResponse(categories);
  } catch (err: any) {
    return errorResponse("Failed to load categories", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireStaffRole(req, ["SUPER_ADMIN", "INVENTORY_MANAGER"]);
  if (!auth.authorized) {
    return forbiddenResponse(auth.error);
  }

  try {
    const body = await req.json();
    const validation = createCategorySchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { name, slug, imageUrl, parentId } = validation.data;

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse("A category with this slug already exists", 400);
    }

    const category = await prisma.category.create({
      data: { name, slug, imageUrl, parentId },
    });

    return successResponse(category, "Category created successfully", 201);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to create category", 500);
  }
}
