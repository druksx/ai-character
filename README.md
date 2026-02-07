# Le Sous-Chef

A passionate (and slightly opinionated) French AI chef built with Next.js 16, Vercel AI SDK v6, and Supabase. Ask for recipes, nutrition info, or ingredient substitutions and get structured UI cards instead of plain text.

No auth wall. Open the app and start cooking.

## The Character

**Le Sous-Chef** is a warm but demanding French chef who mixes French expressions into casual English. He has strong opinions: butter over margarine (always), overcooked pasta is a crime, the microwave is strictly for reheating.

Why a chef? Cooking is the perfect domain for Generative UI. Recipes have rigid structure (ingredients, steps, times, servings) that maps cleanly to typed tool schemas. Nutrition has numbers. Substitutions have ratings. Every tool produces data that deserves a purpose-built card, not a markdown blob. The character's personality on top makes the structured data feel alive.

The system prompt enforces tool usage: Le Sous-Chef is instructed to **never describe a recipe in plain text** and always call the appropriate tool, ensuring the Generative UI pattern is consistently triggered.

## Intelligence Architecture

### How the AI SDK is wired

```
useChat<SousChefMessage>()
     │
     │ DefaultChatTransport { body: () => ({ conversationId }) }
     ▼
POST /api/chat
     │
     ▼
ToolLoopAgent
├── model: Gemini 2.5 Flash (thinkingBudget: 4096)
├── instructions: systemPrompt (French chef character)
└── tools: getRecipe, calculateNutrition, substituteIngredient
     │
     ▼
createAgentUIStreamResponse()
├── streams tool inputs to client as typed message parts
└── onFinish: saves complete assistant message to Supabase

Client receives parts → MessagePart dispatcher renders:
  text        → <Message>           (streaming markdown)
  reasoning   → <Reasoning>         (collapsible thinking trace)
  tool-*      → <RecipeCard>        | <NutritionLabel>
                <SubstitutionCard>
```

### Why it's smart

1. **Generative UI, not markdown.** Tools define Zod v4 schemas as `inputSchema`. The model generates structured JSON as tool input, and the client renders typed React components. The model never outputs HTML for recipes: it produces data.

2. **Tools with no-op execute.** Each tool has `execute: async () => ({ success: true })`. The value is in the structured *input*, not the result. AI SDK v6 requires `execute` though: without it, tool parts stay `input-available` and cause `MissingToolResultsError` on follow-up messages.

3. **ToolLoopAgent for multi-step calls.** If the user asks "Give me a pasta recipe and its nutrition", the agent calls `getRecipe`, gets the ack, then calls `calculateNutrition` in sequence, all in one streaming response.

4. **Thinking traces.** Gemini 2.5 Flash runs with a 4096-token thinking budget. The client renders `reasoning` parts as collapsible traces so users can see why the chef chose certain ingredients.

5. **Typed message parts.** `useChat<SousChefMessage>()` with `InferUITools<typeof tools>` gives full TypeScript types for each tool part. The dispatcher in `message-parts.tsx` switches on `part.type` with proper input types, no `any` casts.

6. **Lazy conversation creation.** Conversations are created on first message, not on page load. The `conversationId` lives in a ref (not state) and a numeric `chatKey` counter prevents unmounting `useChat` mid-stream when the ID is assigned.

## SQL Logic

Custom SQL in `supabase/migrations/001_functions_and_triggers.sql`.

### Trigger: auto-update conversation timestamps

```sql
create or replace function update_conversation_timestamp()
returns trigger as $$
begin
  update conversations set updated_at = now()
  where id = NEW.conversation_id;
  return NEW;
end;
$$ language plpgsql;

create trigger on_message_inserted
  after insert on messages
  for each row execute function update_conversation_timestamp();
```

The sidebar sorts conversations by `updated_at`. The trigger keeps it in sync automatically on every message insert, no application code needed.

### Client-side cuisine stats

The `/recipes` page shows "Top Cuisines" badges with counts. Stats are computed client-side from the recipes array using `useMemo`, so they update instantly when a recipe is deleted. No server round-trip or materialized counter table needed for this dataset size.

### Schema choices

- **No Postgres ENUMs**: `text` + `CHECK` constraints instead. Easier to evolve.
- **Public RLS**: `using (true) with check (true)` on all tables. No auth wall.
- **JSONB for nested data**: `ingredients` and `steps` stored as `jsonb`, matching the Zod schema shape directly.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19 + React Compiler |
| AI | Vercel AI SDK v6 (`ai`, `@ai-sdk/react`) |
| Model | Gemini 2.5 Flash via AI Gateway, thinking budget 4096 |
| Database | Supabase (Postgres, public RLS) |
| Styling | Tailwind CSS v4, warm amber oklch theme |
| Components | Radix UI via shadcn/ui |
| Validation | Zod v4 |

## Development

This project was built with AI assistance (Claude Code) and guided by [react-best-practices](https://github.com/anthropics/react-best-practices) to deliver clean, idiomatic React and Next.js code. The codebase follows Server Components by default, colocates client state close to where it's needed, avoids prop drilling, and uses `useMemo`/`useCallback` where appropriate for derived data and stable references.

## Getting Started

Requires Node.js 20+, a Supabase project, and a Gemini API key.

```bash
git clone <repo-url> && cd ai-character && npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
AI_GATEWAY_API_KEY=your-api-key
```

Run `supabase/migrations/*.sql` in order against your Supabase project, then `npm run dev`.
