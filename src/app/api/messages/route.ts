import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { supabase } from "@/lib/supabase";

async function getAuthenticatedUser(): Promise<string | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get("bolo_token")?.value;

  if (!token) {
    const headerList = await headers();
    const authHeader = headerList.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;
  const payload = await verifyJWT(token);
  return payload?.username || null;
}

export async function GET() {
  const username = await getAuthenticatedUser();
  if (!username) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to view your inbox." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("bolo_messages")
    .select("*")
    .eq("recipient_username", username)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }

  return NextResponse.json({ messages: data || [] });
}

export async function DELETE(request: Request) {
  const username = await getAuthenticatedUser();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("bolo_messages")
    .delete()
    .eq("id", id)
    .eq("recipient_username", username);

  if (error) {
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
