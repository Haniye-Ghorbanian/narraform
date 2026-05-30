// src/app/api/extract/route.ts
import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { orderSchema } from "@/schemas/orderSchema";

const gapgpt = createOpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.input || typeof body.input !== "string") {
    return new Response("Bad request", { status: 400 });
  }
  const input = body.input.slice(0, 2000);

  const result = streamObject({
    model: gapgpt("gpt-5.1"),
    schema: orderSchema,
    prompt: `Extract structured form data from the user's message.
<user_message>
${input}
</user_message>
Extract what is stated. Use reasonable defaults for anything not mentioned.`,
  });

  return result.toTextStreamResponse();
}
