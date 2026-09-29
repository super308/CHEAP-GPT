import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-3.8-flash"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}