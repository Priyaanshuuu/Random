import { NextRequest, NextResponse } from "next/server";
import { evaluateConversation } from "../../services/judge.service";

export async function POST(req: NextRequest) {
  try {
    const { conversationId } = await req.json();

    const evaluation = await evaluateConversation(
      conversationId
    );

    return NextResponse.json(evaluation);
  } catch (error) {
    console.log("Evaluate API Error:" , error);
    
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}