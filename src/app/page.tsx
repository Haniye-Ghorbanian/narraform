"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { orderSchema } from "@/schemas/orderSchema";

type FieldStatus = "idle" | "streaming" | "complete";

export default function Home() {
  const [input, setInput] = useState("");
  const [snapshots, setSnapshots] = useState<Array<{ t: number; data: string }>>([]);
  const streamStartRef = useRef<number | null>(null);

  const { object, isLoading, submit, stop } = useObject({
    api: "/api/extract",
    schema: orderSchema,
  });

  // Reset statuses on new submission
  function handleSubmit() {
    streamStartRef.current = performance.now();
    setSnapshots([]);
    submit({ input });
  }

  useEffect(() => {
    if (!object) return;

    const now = performance.now();
    const startedAt = streamStartRef.current ?? now;
    const next = {
      t: now - startedAt,
      data: JSON.stringify(object),
    };

    // Schedule state update asynchronously so it is treated as stream-event handling.
    const timer = setTimeout(() => {
      setSnapshots((prev) => {
        if (prev[prev.length - 1]?.data === next.data) return prev;
        return [...prev, next].slice(-25);
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [object]);

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">AI Smart Forms - Week 2</h1>

      <textarea
        className="h-32 w-full rounded-lg border p-3 text-black"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="I'm Ali, need a laptop, budget $2000, urgent"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Extracting..." : "Extract"}
        </button>
        {isLoading && (
          <button onClick={stop} className="rounded-lg bg-red-500 px-6 py-2 text-white">
            Stop
          </button>
        )}
      </div>

      <div className="space-y-2 rounded-lg bg-gray-900 p-4">
        {Object.keys(orderSchema.shape).map((key) => {
          const value = object?.[key as keyof typeof object];
          const status: FieldStatus =
            value !== undefined ? "complete" : isLoading ? "streaming" : "idle";

          return (
            <div
              key={key}
              className={`flex gap-3 rounded p-2 transition-all duration-300 ${
                status === "complete" ? "bg-gray-800" : ""
              }`}
            >
              <span className="w-36 text-sm text-gray-400">{key}</span>
              <span
                className={`font-mono text-sm transition-all duration-500 ${
                  status === "complete" ? "text-green-400" : "text-gray-600"
                }`}
              >
                {value !== undefined ? String(value) : "—"}
              </span>
              {status === "complete" && (
                <span className="text-xs text-green-600">✓</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2 rounded-lg border border-gray-300 bg-white p-4 text-black">
        <h2 className="font-semibold">Stream Debug</h2>
        <p className="text-sm text-gray-600">
          snapshots: {snapshots.length} | loaded fields: {Object.values(object ?? {}).filter((v) => v !== undefined).length}/{Object.keys(orderSchema.shape).length}
        </p>
        <div className="max-h-56 space-y-1 overflow-auto rounded bg-gray-100 p-2 font-mono text-xs">
          {snapshots.length === 0 && <div>Waiting for chunks...</div>}
          {snapshots.map((snapshot, index) => (
            <div key={`${snapshot.t}-${index}`}>
              [{snapshot.t.toFixed(0)}ms] {snapshot.data}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
