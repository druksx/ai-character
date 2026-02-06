# ai-character

## Stack

- **Framework**: Next.js 16 (App Router, React 19, React Compiler)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`)
- **Database**: Supabase
- **Validation**: Zod v4

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Project structure

```
src/
├── app/          # Next.js App Router (pages, layouts, API routes)
├── lib/          # Shared utilities
```

Path alias: `@/*` → `./src/*`

## Conventions

- Server Components by default, `"use client"` only when needed
- Prefer Radix UI primitives via shadcn/ui (`components.json` configured)
- Use `cn()` from `@/lib/utils` for class merging
- Validate external data with Zod schemas
