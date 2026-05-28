"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleExtract() {
    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Stream error:", error);
      setOutput(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">AI Smart Forms - Day 1 Demo</h1>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Describe your order in natural language:
        </label>
        <textarea
          className="h-32 w-full rounded-lg border p-3 text-black"
          placeholder="e.g. Hi, I'm Ali and I need a laptop for my work. My budget is around two thousand dollars and I need it ASAP."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <button
        onClick={handleExtract}
        disabled={isLoading || !input.trim()}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Extracting..." : "Extract Data"}
      </button>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Raw Stream Output:</h2>
        <pre className="min-h-[200px] overflow-auto whitespace-pre-wrap rounded-lg bg-gray-900 p-4 text-sm text-green-400">
          {output || "Stream output will appear here..."}
        </pre>
      </div>
    </main>
  );
}
