import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().describe("Full name of the customer"),
  productType: z.string().describe("Type of product they want"),
  budget: z.number().describe("Budget in USD"),
  urgency: z.enum(["low", "medium", "high"]).describe("How urgent"),
});

