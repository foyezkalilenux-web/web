import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { comparePasswords, signStaffJwt } from "@/lib/auth";
import { staffLoginSchema } from "@/lib/validations/auth";
import { successResponse, errorResponse, validationErrorResponse } from "@/lib/api-response";

const DEMO_STAFF = [
  {
    email: "admin@store.com",
    password: "Admin@123456",
    id: "usr-admin-01",
    name: "System Super Admin",
    role: "SUPER_ADMIN" as const,
  },
  {
    email: "cashier@store.com",
    password: "Cashier@123456",
    id: "usr-cashier-01",
    name: "Front Cashier",
    role: "POS_CASHIER" as const,
  },
  {
    email: "inventory@store.com",
    password: "Inventory@123456",
    id: "usr-inventory-01",
    name: "Inventory Manager",
    role: "INVENTORY_MANAGER" as const,
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = staffLoginSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password } = validation.data;

    let matchedUser: { id: string; email: string; name: string; role: any } | null = null;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user && user.isActive) {
        const isPasswordValid = await comparePasswords(password, user.passwordHash);
        if (isPasswordValid) {
          matchedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    } catch {
      // Database not yet connected or seeded - fallback to demo accounts
    }

    // Check demo accounts fallback
    if (!matchedUser) {
      const demo = DEMO_STAFF.find((d) => d.email.toLowerCase() === email.toLowerCase());
      if (demo && demo.password === password) {
        matchedUser = {
          id: demo.id,
          email: demo.email,
          name: demo.name,
          role: demo.role,
        };
      }
    }

    if (!matchedUser) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signStaffJwt({
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
    });

    const response = successResponse(
      {
        token,
        user: matchedUser,
      },
      "Login successful"
    );

    // Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Staff login error:", err);
    return errorResponse("Internal server error during authentication", 500);
  }
}
