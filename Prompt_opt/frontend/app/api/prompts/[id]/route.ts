import { NextRequest, NextResponse } from "next/server";
import {
  activatePrompt,
  deletePrompt,
} from "../../../services/prompt.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prompt = await activatePrompt(id);

  return NextResponse.json(prompt);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deletePrompt(id);

  return NextResponse.json({
    success: true,
  });
}