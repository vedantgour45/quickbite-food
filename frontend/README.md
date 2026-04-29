# QuickBite Frontend

React + Vite + TypeScript app for QuickBite. Customers browse the menu, add items to a persistent cart, place an order, and watch its status update live via Server-Sent Events.

## Prerequisites

- Node.js 18+
- npm 9+
- Backend running on `http://localhost:5000` (see `../backend`)

## Setup

```bash
npm install
cp .env.example .env
```

## Environment variables

| Name                 | Default                  | Description                                  |
| -------------------- | ------------------------ | -------------------------------------------- |
| `VITE_API_BASE_URL`  | `http://localhost:5000`  | Base URL of the QuickBite backend API        |

In production set `VITE_API_BASE_URL` to the deployed Railway backend URL.

## Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server on port 5173           |
| `npm run build`   | Type-check and produce a production bundle       |
| `npm run preview` | Preview the production bundle locally            |
| `npm test`        | Run the Vitest + React Testing Library suite     |

## Pages

| Route          | Component                | Notes                                            |
| -------------- | ------------------------ | ------------------------------------------------ |
| `/`            | `MenuPage`                | Menu, search, category filter, item modal       |
| `/cart`        | `CartPage`                | Cart review, qty steppers, totals               |
| `/checkout`    | `CheckoutPage`            | Form validation, place order mutation           |
| `/order/:id`   | `OrderTrackingPage`       | Live status via SSE, delivery agent card        |

## Architecture notes

- **State management**: Zustand for cart (persisted to `localStorage`); TanStack Query for all server data.
- **Live updates**: a custom `useOrderSSE` hook wraps the browser `EventSource` API, opens on mount, closes on unmount or once status reaches `delivered`.
- **Forms**: React Hook Form + Zod for validation. Errors render inline beneath the field.
- **Server-side pricing**: the backend computes subtotal, tax, delivery fee, and total. The frontend mirrors the math only for display before submission.
- **Tests**: jsdom environment with mocked `fetch`/`axios` modules; `EventSource` and `framer-motion` are stubbed in `src/tests/setup.ts`.

## Deployment (Vercel)

The included `vercel.json` rewrites every path to `/` so React Router works on hard refresh. Set `VITE_API_BASE_URL` in the Vercel dashboard. Build command: `npm run build`. Output dir: `dist`.
