import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { StaffJwtPayload, CustomerJwtPayload, UserRole } from "@/types/auth";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-development-key-32chars";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function signStaffJwt(payload: Omit<StaffJwtPayload, "userType">, expiresIn: string | number = "7d"): string {
  return jwt.sign({ ...payload, userType: "STAFF" }, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function signCustomerJwt(payload: Omit<CustomerJwtPayload, "userType">, expiresIn: string | number = "30d"): string {
  return jwt.sign({ ...payload, userType: "CUSTOMER" }, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}

export function getAuthFromRequest(req: NextRequest): StaffJwtPayload | CustomerJwtPayload | null {
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Check cookie fallback
    const cookieToken = req.cookies.get("token")?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) return null;
  return verifyJwt<StaffJwtPayload | CustomerJwtPayload>(token);
}

export function requireStaffRole(
  req: NextRequest,
  allowedRoles: UserRole[] = ["SUPER_ADMIN", "INVENTORY_MANAGER", "POS_CASHIER"]
): { authorized: boolean; payload?: StaffJwtPayload; error?: string } {
  const payload = getAuthFromRequest(req);

  if (!payload || payload.userType !== "STAFF") {
    return { authorized: false, error: "Authentication required as staff" };
  }

  const staff = payload as StaffJwtPayload;
  if (!allowedRoles.includes(staff.role)) {
    return { authorized: false, error: `Forbidden: requires one of [${allowedRoles.join(", ")}]` };
  }

  return { authorized: true, payload: staff };
}
