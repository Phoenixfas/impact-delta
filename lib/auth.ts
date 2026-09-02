import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "impact_admin_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "impact-b2b-secure-jwt-secret-key-2026-cpanel-node"
);

export type UserRole = "ADMIN" | "SALES";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signJwt(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.id || !payload.email || !payload.role) {
      return null;
    }
    return {
      id: payload.id as string,
      name: (payload.name as string) || "User",
      email: payload.email as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJwt(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest): SessionUser | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  // In synchronous/middleware context, verifyJwt returns a promise
  return null;
}

export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}
