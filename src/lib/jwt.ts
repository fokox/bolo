import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "bolo-secure-jwt-secret-key-2026-super-safe-and-fast";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface JWTPayload {
  username: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT token with the user's username
 */
export async function signJWT(payload: { username: string; id?: string }): Promise<string> {
  return await new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.id || payload.username)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT token and return the payload, or null if invalid
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Hash plain password using bcrypt with 10 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare plain password against stored bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
