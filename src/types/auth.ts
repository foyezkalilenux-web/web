export type UserRole = "SUPER_ADMIN" | "INVENTORY_MANAGER" | "POS_CASHIER";

export interface StaffJwtPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  userType: "STAFF";
}

export interface CustomerJwtPayload {
  customerId: string;
  phone: string;
  membershipId?: string;
  membershipCode?: string;
  tier?: string;
  userType: "CUSTOMER";
}

export type AuthJwtPayload = StaffJwtPayload | CustomerJwtPayload;
