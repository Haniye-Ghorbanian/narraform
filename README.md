# narraform

> Fill any React form with natural language. Schema-driven. Streaming. Zero configuration.

```tsx
const schema = z.object({
  name: z.string().describe("Customer full name"),
  budget: z.number().describe("Budget in USD"),
  urgency: z.enum(["low", "medium", "high"]),
});

function MyForm() {
  const { register, isStreaming, submitText } = useAiForm({ schema });

  return (
    <form>
      <input {...register("name")} />
      <input {...register("budget")} />
      <select {...register("urgency")} />
      <button onClick={() => submitText("I'm Ali, budget $2000, need it ASAP")}>
        Fill with AI
      </button>
    </form>
  );
}
```

> **Status:** Early development — not yet published to NPM.

---

## What it does

The user describes what they want in plain text. An LLM parses it and fills your form fields automatically, one by one, as the response streams in.

Your Zod schema is the single source of truth — it defines the field types, the validation rules, and the instructions sent to the LLM. No separate configuration needed.

## Why

Most AI form tools are either locked to a specific UI or require you to wire up the LLM yourself. This library sits in between: bring your own schema, get AI-powered form filling in ~10 lines of code.

## Tech

- [Vercel AI SDK](https://sdk.vercel.ai) — `streamObject` + `useObject` for field-by-field streaming
- [Zod](https://zod.dev) — schema definition and runtime validation  
- [React Hook Form](https://react-hook-form.com) — form state management
- TypeScript — end-to-end type safety from schema to form fields

## Roadmap

- [x] Natural language → structured JSON via `streamObject`
- [ ] `extractFieldMeta()` — introspect any Zod schema into field descriptors
- [ ] Dynamic form rendering from schema alone
- [ ] `useAiForm` hook — single import for the full experience
- [ ] Ghost typing animation on field value arrival
- [ ] Per-field status indicators (`idle` / `streaming` / `complete` / `error`)
- [ ] Missing field detection and correction loop
- [ ] NPM package with `tsup` build (ESM + CJS)
- [ ] Examples: flight booking, contact form, order intake

## Contributing

This project is in active early development. Issues and PRs are welcome once the core API stabilizes. Feel free to open a discussion if you have ideas.

## License

MIT