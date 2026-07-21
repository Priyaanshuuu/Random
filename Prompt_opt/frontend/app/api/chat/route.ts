import { chat } from "../../services/chat.services";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await chat(message);

    return Response.json(response);
  } catch (error){
    console.log("Chat API Error" , error);
    
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}