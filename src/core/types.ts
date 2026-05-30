export type FieldMeta = {
  key: string;
  type: "string" | "number" | "boolean" | "enum" | "date" | "unknown";
  label: string;
  options?: string[];
  required: boolean;
};

export type FieldStatus = "idle" | "streaming" | "complete" | "error" | "missing";