import { NextRequest, NextResponse } from "next/server";
import { getPrompts, createPrompt } from "../../services/prompt.service";

export async function GET() {
  const prompts = await getPrompts();
  return NextResponse.json(prompts);
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const data = await createPrompt(prompt);

  return NextResponse.json(data);
}