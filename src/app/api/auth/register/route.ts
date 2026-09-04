import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword, signJWT } from "@/lib/jwt";
import { generateLinkId } from "@/lib/linkId";

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
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters." },
        { status: 400 }
      );
    }

    if (rawPassword.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("bolo_profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken. Please log in or pick another." },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(rawPassword);

    // Generate random short link identifier (e.g. "m7k2x9q")
    const linkId = generateLinkId();

    // Insert new profile with random link identifier
    const { data: newProfile, error: insertError } = await supabase
      .from("bolo_profiles")
      .insert({
        username,
        display_name: linkId,
        secret_passcode: hashedPassword,
      })
      .select("id, username, display_name")
      .single();

    if (insertError || !newProfile) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      );
    }

    // Generate JWT
    const token = await signJWT({
      username: newProfile.username,
      id: newProfile.id,
    });

    const response = NextResponse.json({
      success: true,
      username: newProfile.username,
      linkId: newProfile.display_name || linkId,
      token,
    });

    // Set secure cookie
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
