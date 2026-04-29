# QuickBite — Food Delivery App

A full-stack food delivery web app built as a monorepo. Customers can browse a menu, add items to a cart, place an order, and track its progress in real time.

## Repository layout

```
food-delivery-app/
├── frontend/   React 18 + Vite + TypeScript + Tailwind + shadcn/ui
├── backend/    Node + Express + TypeScript (in-memory store)
└── README.md
```

The frontend is deployed to **Vercel** and the backend is deployed to **Railway**.

## Tech stack

**Frontend:** React 18, Vite, TypeScript (strict), Tailwind CSS, shadcn/ui, Zustand, TanStack Query v5, React Router v6, Axios, React Hook Form + Zod, Framer Motion, Vitest + React Testing Library.

**Backend:** Node.js, Express, TypeScript (strict), Zod for validation, Server-Sent Events for live order updates, Jest + Supertest.

## Prerequisites

- Node.js 18+
- npm 9+

## Local development

Run two terminals — one for the backend, one for the frontend.

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The web app opens on `http://localhost:5173`.

## Running tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Deployment

| Surface  | Host    | Notes                                                             |
| -------- | ------- | ----------------------------------------------------------------- |
| Frontend | Vercel  | Set `VITE_API_BASE_URL` to the deployed Railway URL               |
| Backend  | Railway | Set `ALLOWED_ORIGIN` to the deployed Vercel URL, plus `PORT` if needed |

### Live URLs

- **Frontend:** _add Vercel URL here once deployed_
- **Backend:** _add Railway URL here once deployed_

## Feature highlights

- Browse 12 menu items across 6 categories with search + filter
- Persistent cart (survives refresh via `localStorage`)
- Real checkout form with phone/pincode validation
- Live order tracking via Server-Sent Events — status moves automatically
  through Received → Preparing → Out for Delivery → Delivered
- Server-side price calculation; the client never decides totals
