import { NextRequest, NextResponse } from "next/server";
import { optimizePrompt } from "../../services/optimize.service";

export async function POST(req: NextRequest) {
  try {
    const { promptId } = await req.json();

    const optimized = await optimizePrompt(promptId);

    return NextResponse.json(optimized);
  } catch {
    return NextResponse.json(
      {
        error: "Optimization failed",
      },
      {
        status: 500,
      }
    );
  }
}