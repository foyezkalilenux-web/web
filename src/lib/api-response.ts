import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
  errors?: Record<string, string[]>;
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, status = 400, error?: any) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
}

export function validationErrorResponse(error: ZodError) {
  const formattedErrors = error.flatten().fieldErrors;
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Validation failed",
      errors: formattedErrors as Record<string, string[]>,
    },
    { status: 422 }
  );
}

export function unauthorizedResponse(message = "Unauthorized access") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden: Insufficient permissions") {
  return errorResponse(message, 403);
}
