"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { z } from "zod";

const orderSchema = z.object({
  customerName: z.string().describe("Full name of the customer"),
  productType: z.string().describe("Type of product they want"),
  budget: z.number().describe("Budget in USD"),
  urgency: z.enum(["low", "medium", "high"]).describe("How urgent"),
});

export default function Home() {
  const [input, setInput] = useState("");

  const { object, isLoading, submit, stop } = useObject({
    api: "/api/extract",
    schema: orderSchema,
  });

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">AI Smart Forms - Day 2</h1>

      <textarea
        className="h-32 w-full rounded-lg border p-3 text-black"
        placeholder="e.g. Hi, I'm Ali and I need a laptop for my work. Budget around $2000, need it ASAP."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={() => submit({ input })}
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Extracting..." : "Extract Data"}
        </button>

        {isLoading && (
          <button
            onClick={stop}
            className="rounded-lg bg-red-500 px-6 py-2 text-white"
          >
            Stop
          </button>
        )}
      </div>

      {/* Live partial object — this is the DeepPartial streaming in action */}
      <div className="space-y-2">
        {Object.entries(orderSchema.shape).map(([key]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-32 text-sm font-medium capitalize text-gray-400">
              {key}
            </span>
            <span className="rounded bg-gray-800 px-3 py-1 font-mono text-sm text-green-400">
              {object?.[key as keyof typeof object] !== undefined
                ? String(object[key as keyof typeof object])
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}