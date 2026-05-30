// src/app/api/extract/route.ts
import { z } from "zod";
import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const gapgpt = createOpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const orderSchema = z.object({
  customerName: z.string().describe("Full name of the customer"),
  productType: z.string().describe("Type of product they want"),
  budget: z.number().describe("Budget in USD"),
  urgency: z.enum(["low", "medium", "high"]).describe("How urgent"),
});

export async function POST(req: Request) {
  // Input validation
  const body = await req.json().catch(() => null);
  if (!body?.input || typeof body.input !== "string") {
    return new Response("Bad request", { status: 400 });
  }
  const input = body.input.slice(0, 2000); // hard cap

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