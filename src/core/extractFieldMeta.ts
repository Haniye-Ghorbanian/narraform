import { z } from "zod";
import type { FieldMeta } from "./types";

export function extractFieldMeta(schema: z.ZodObject<any>): FieldMeta[] {
  const shape = schema.shape;
  return Object.entries(shape).map(([key, field]) => {
    return parseField(key, field as z.ZodTypeAny);
  });
}

function parseField(key: string, field: z.ZodTypeAny): FieldMeta {
  const isOptional = field instanceof z.ZodOptional;
  const inner: z.ZodTypeAny = isOptional ? field.unwrap() : field;

  const label = inner._def.description ?? keyToLabel(key);

  if (inner instanceof z.ZodString) {
    return { key, type: "string", label, required: !isOptional };
  }
  if (inner instanceof z.ZodNumber) {
    return { key, type: "number", label, required: !isOptional };
  }
  if (inner instanceof z.ZodBoolean) {
    return { key, type: "boolean", label, required: !isOptional };
  }
  if (inner instanceof z.ZodEnum) {
    return { key, type: "enum", label, options: inner._def.values, required: !isOptional };
  }
  if (inner instanceof z.ZodDate) {
    return { key, type: "date", label, required: !isOptional };
  }
  return { key, type: "unknown", label, required: !isOptional };
}

// "customerName" → "Customer Name"
function keyToLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}