// src/app/api/extract/route.ts

import { z } from "zod";
import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Create a custom provider pointing to gapgpt
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
  const { input } = await req.json();

  const result = streamObject({
    model: gapgpt("gpt-5.1"),  // Uses your custom provider
    schema: orderSchema,
    prompt: `Extract structured order information from this text. 
Only extract what is explicitly mentioned. 
If something is not mentioned, make a reasonable inference.

User input: "${input}"`,
  });

  return result.toTextStreamResponse();
}
