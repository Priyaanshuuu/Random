import { chat } from "../../services/chat.service";

export async function POST(req: Request) {
  try {
    const { message, conversationId } = await req.json();

    if (typeof message !== "string" || message.trim() === "") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await chat(message, conversationId);

    return Response.json(response);
  } catch (error) {
    console.error("Chat API Error", error);

    // "No active prompt" / "Conversation not found" are the caller's problem
    // and are safe to surface; anything else stays generic.
    const reason = error instanceof Error ? error.message : "";
    if (reason === "No active prompt" || reason === "Conversation not found") {
      return Response.json({ error: reason }, { status: 400 });
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
