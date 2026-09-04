import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { supabase } from "@/lib/supabase";
import { generateLinkId } from "@/lib/linkId";

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

    // Fetch profile to get random link identifier
    const { data: profile } = await supabase
      .from("bolo_profiles")
      .select("id, username, display_name")
      .eq("username", payload.username)
      .maybeSingle();

    let linkId = profile?.display_name;
    if (!linkId || linkId === profile?.username) {
      linkId = generateLinkId();
      if (profile?.id) {
        await supabase
          .from("bolo_profiles")
          .update({ display_name: linkId })
          .eq("id", profile.id);
      }
    }

    return NextResponse.json({
      authenticated: true,
      username: payload.username,
      linkId,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
