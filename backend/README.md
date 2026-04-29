# QuickBite Backend

Express + TypeScript API powering the QuickBite food delivery app. Stores menu and orders in memory and pushes live order-status updates over Server-Sent Events.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
cp .env.example .env
```

## Environment variables

| Name             | Default                  | Description                                                       |
| ---------------- | ------------------------ | ----------------------------------------------------------------- |
| `PORT`           | `5000`                   | Port the Express server listens on                                |
| `ALLOWED_ORIGIN` | `http://localhost:5173`  | Comma-separated list of origins allowed by CORS                   |
| `NODE_ENV`       | `development`            | Standard Node environment flag                                    |

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the server with hot reload (tsx watch) |
| `npm run build`  | Compile TypeScript to `dist/`                |
| `npm start`      | Run the compiled server (`dist/server.js`)   |
| `npm test`       | Run Jest + Supertest suites                  |

## API reference

### Menu

#### `GET /api/menu`

Returns all menu items. The `image` field is a path relative to the API origin —
the frontend prepends `VITE_API_BASE_URL` to fetch the actual file from
`/static/menu/...` (see [Static images](#static-images) below).

```json
[
  {
    "id": "pizza-margherita",
    "name": "Margherita Pizza",
    "description": "...",
    "price": 299,
    "image": "/static/menu/margherita_pizza.png",
    "category": "pizza",
    "rating": 4.6,
    "prepTime": "20-25 min",
    "isAvailable": true
  }
]
```

#### `GET /api/menu?category=pizza`

Filter by category. Valid categories: `pizza`, `burger`, `pasta`, `salad`, `drinks`, `chicken`. An invalid category returns `[]`, not an error.

#### `GET /api/menu/:id`

Returns one menu item or `404`.

### Orders

#### `POST /api/orders`

Place a new order. The server calculates subtotal, tax, delivery fee, and total — never trust client prices.

```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    { "menuItemId": "pizza-margherita", "quantity": 2 }
  ],
  "customer": {
    "name": "Alex Morgan",
    "phone": "9876543210",
    "address": "123 Jubilee Hills, Hyderabad",
    "pincode": "500033"
  }
}
```

Response `201`:

```json
{
  "id": "ORD-48217",
  "items": [
    { "menuItemId": "pizza-margherita", "name": "Margherita Pizza", "quantity": 2, "price": 299 }
  ],
  "customer": { "name": "Alex Morgan", "phone": "9876543210", "address": "...", "pincode": "500033" },
  "status": "received",
  "subtotal": 598,
  "deliveryFee": 40,
  "tax": 29.9,
  "total": 667.9,
  "createdAt": "2026-04-28T12:15:00.000Z",
  "estimatedDelivery": "12:55 PM"
}
```

#### `GET /api/orders/:id`

Returns the full order or `404`.

#### `GET /api/orders/:id/status`

Returns just the current status:

```json
{ "id": "ORD-48217", "status": "preparing" }
```

#### `PATCH /api/orders/:id/status`

Manually override status — useful for tests and dev.

```json
{ "status": "out_for_delivery" }
```

#### `GET /api/orders/:id/stream` (SSE)

Server-Sent Events stream that pushes status changes as they happen. The first event is the current status; subsequent events fire as the simulated kitchen advances the order.

```
data: {"id":"ORD-48217","status":"received"}

data: {"id":"ORD-48217","status":"preparing"}
```

### Static images

Menu photos live in `backend/public/menu/` and are served by `express.static`
under `/static/menu/<filename>.png`. Each response sets
`Cross-Origin-Resource-Policy: cross-origin` so the deployed frontend on a
different origin can `<img>` them. Cached for 7 days (`maxAge: '7d', immutable`).

```
GET /static/menu/margherita_pizza.png   → 200, image/png
GET /static/menu/no-such-image.png      → 404
```

### Error responses

| Status | Meaning                              | Body                                                       |
| ------ | ------------------------------------ | ---------------------------------------------------------- |
| `400`  | Validation failed                    | `{ "error": "Validation failed", "fieldErrors": [...] }`   |
| `404`  | Menu item / order / route not found  | `{ "error": "Order not found" }`                           |
| `500`  | Unexpected server error              | `{ "error": "Internal server error" }`                     |

## Status simulation

After an order is placed, an interval fires every 15 seconds and walks the order through the four statuses: `received` → `preparing` → `out_for_delivery` → `delivered`. Each transition is broadcast to all SSE subscribers for that order.

## Deployment (Railway)

The included `Procfile` runs `npm start` (i.e. `node dist/server.js`). Railway will run `npm run build` automatically before starting. Set `ALLOWED_ORIGIN` in the Railway dashboard to your deployed Vercel frontend URL.
