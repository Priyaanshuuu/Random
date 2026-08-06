import { NextRequest, NextResponse } from "next/server";
import { evaluateMessage } from "../../services/judge.service";

export async function POST(req: NextRequest) {
  try {
    const { messageId } = await req.json();

    if (typeof messageId !== "string" || messageId === "") {
      return NextResponse.json(
        { error: "messageId is required" },
        { status: 400 },
      );
    }

    return NextResponse.json(await evaluateMessage(messageId));
  } catch (error) {
    console.error("Evaluate API Error:", error);

    // A malformed judge reply is upstream's fault, not the caller's.
    const reason = error instanceof Error ? error.message : "Evaluation failed";
    const status = reason.startsWith("Judge ") ? 502 : 500;

    return NextResponse.json({ error: reason }, { status });
  }
}
