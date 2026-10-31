import { z } from "zod";

export const staffLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .transform((val) => {
      // Normalize Bangladesh phone numbers to standard format (+8801XXXXXXXXX)
      let cleaned = val.replace(/\s+/g, "").replace(/-/g, "");
      if (cleaned.startsWith("01")) {
        cleaned = "+88" + cleaned;
      } else if (cleaned.startsWith("8801")) {
        cleaned = "+" + cleaned;
      }
      return cleaned;
    })
    .refine((val) => /^\+8801[3-9]\d{8}$/.test(val), {
      message: "Please enter a valid Bangladesh mobile number (e.g., 017XXXXXXXX)",
    }),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .transform((val) => {
      let cleaned = val.replace(/\s+/g, "").replace(/-/g, "");
      if (cleaned.startsWith("01")) {
        cleaned = "+88" + cleaned;
      } else if (cleaned.startsWith("8801")) {
        cleaned = "+" + cleaned;
      }
      return cleaned;
    }),
  code: z.string().length(6, "OTP code must be exactly 6 digits"),
  name: z.string().optional(),
});

export const createStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "INVENTORY_MANAGER", "POS_CASHIER"]),
});
