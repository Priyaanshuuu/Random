import { NextRequest, NextResponse } from "next/server";
import {
  activatePrompt,
  deletePrompt,
} from "../../../services/prompt.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prompt = await activatePrompt(params.id);

  return NextResponse.json(prompt);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await deletePrompt(params.id);

  return NextResponse.json({
    success: true,
  });
}