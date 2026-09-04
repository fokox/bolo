import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("bolo_token")?.value;

    if (!token) {
      const headerList = await headers();
      const authHeader = headerList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: payload.username,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
