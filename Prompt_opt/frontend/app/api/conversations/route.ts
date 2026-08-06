import { NextResponse } from "next/server";
import { getConversations } from "../../services/chat.service";

// Threads are read fresh on every request; a cached list would go stale as soon
// as the user sends a message.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getConversations());
  } catch (error) {
    console.error("Conversations API Error:", error);

    return NextResponse.json(
      { error: "Could not load conversations" },
      { status: 500 },
    );
  }
}
