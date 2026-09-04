import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword, hashPassword, signJWT } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUsername = body.username as string | undefined;
    const rawPassword = body.password as string | undefined;

    if (!rawUsername || !rawPassword) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const username = rawUsername.trim().toLowerCase().replace(/[^a-z0-9_.]/g, "");

    // Fetch user profile from Supabase
    const { data: profile, error } = await supabase
      .from("bolo_profiles")
      .select("id, username, secret_passcode")
      .eq("username", username)
      .maybeSingle();

    if (error || !profile) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const storedHash = profile.secret_passcode;
    let isValid = false;

    if (storedHash) {
      if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$")) {
        // Stored as bcrypt hash
        isValid = await verifyPassword(rawPassword, storedHash);
      } else {
        // Plaintext PIN or password from earlier accounts -> upgrade to bcrypt
        if (storedHash === rawPassword) {
          isValid = true;
          const upgradedHash = await hashPassword(rawPassword);
          await supabase
            .from("bolo_profiles")
            .update({ secret_passcode: upgradedHash })
            .eq("id", profile.id);
        }
      }
    } else {
      // First time setting password on legacy account without password
      isValid = true;
      const newHash = await hashPassword(rawPassword);
      await supabase
        .from("bolo_profiles")
        .update({ secret_passcode: newHash })
        .eq("id", profile.id);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signJWT({
      username: profile.username,
      id: profile.id,
    });

    const response = NextResponse.json({
      success: true,
      username: profile.username,
      token,
    });

    response.cookies.set("bolo_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
