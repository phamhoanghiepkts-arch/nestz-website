# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

NestZ Calorie is a Vietnamese-language meal calorie counter web app. Users upload or take a photo of food; the app sends the image (as base64) to Google Gemini's vision API and displays a full nutrition breakdown (calories, macros, health score, per-item detail).

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

No test runner is configured.

## Architecture

### Request Flow

1. `app/page.tsx` (client component) owns all state: `imageData`, `mediaType`, `result`, `loading`, `error`
2. `app/components/ImageUpload.tsx` converts the selected/captured file to base64 via `FileReader` and calls `onImageSelect(base64, mimeType)`
3. On "Phân tích" click, `page.tsx` POSTs `{ imageData, mediaType }` to `/api/analyze`
4. `app/api/analyze/route.ts` calls Gemini `gemini-2.0-flash` with a multimodal prompt (inline image data + Vietnamese text instruction)
5. Gemini returns a raw text response; the route regex-extracts `{…}` and parses it as JSON, then returns it
6. `app/components/CalorieResult.tsx` renders the structured result: total calories, macro progress bars, per-item breakdown, health score badge

### Shared Data Shape

The `AnalysisResult` / `FoodItem` interfaces are duplicated between `app/page.tsx` and `app/components/CalorieResult.tsx`. Keep them in sync if you modify the data model; the canonical shape is defined by the JSON prompt in `app/api/analyze/route.ts`.

### AI Integration

- Uses `@google/genai` (`GoogleGenAI`) — the only active AI package
- `@anthropic-ai/sdk` is installed as a dependency but **not used** anywhere; do not add new code that imports it without removing or replacing the Gemini integration
- The Gemini prompt is hardcoded in `route.ts`; it instructs the model to respond with a specific JSON schema and fall back to `{"error": "..."}` if food is not detected

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google AI Studio key used by `app/api/analyze/route.ts` |

## Styling Conventions

- **Tailwind CSS v4** — import syntax is `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Custom utilities (`animate-spin-slow`, `drop-zone-active`) live in `app/globals.css`
- Color palette: green/emerald throughout; background is `from-green-50 to-emerald-50`
- Layout is **mobile-first** with a `max-w-md` centered container; maintain this for all new UI

## Localization

All UI text and AI prompts are in **Vietnamese**. Keep new UI copy and error messages in Vietnamese.

## Path Aliases

`@/*` maps to the project root, so `@/app/components/Foo` resolves to `./app/components/Foo`.

## Next.js Version Note

This project uses **Next.js 16**, which has breaking API changes relative to earlier versions covered by most training data. Before writing Next.js-specific code (routing, middleware, caching, data fetching), consult `node_modules/next/dist/docs/` for current conventions — do not rely on training knowledge for Next.js APIs.
