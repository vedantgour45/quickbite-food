import request from 'supertest';
import { createApp } from '../app';
import { orderStore } from '../store/orderStore';
import {
  _resetSubscribers,
  setStatusIntervalMs,
} from '../controllers/order.controller';

const app = createApp();

beforeAll(() => {
  // Slow the auto-advance way down so it doesn't fire during the test run.
  setStatusIntervalMs(60_000);
});

beforeEach(() => {
  orderStore.reset();
  _resetSubscribers();
});

const validBody = {
  items: [
    { menuItemId: 'pizza-margherita', quantity: 2 },
    { menuItemId: 'drink-mango-lassi', quantity: 1 },
  ],
  customer: {
    name: 'Alex Morgan',
    phone: '9876543210',
    address: '123 Jubilee Hills, Hyderabad',
    pincode: '500033',
  },
};

describe('POST /api/orders', () => {
  it('returns 201 and the created order on a valid body', async () => {
    const res = await request(app).post('/api/orders').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^ORD-[0-9A-F]{12}$/);
    expect(res.body.status).toBe('received');
    expect(res.body.items).toHaveLength(2);
    expect(res.body.customer.name).toBe('Alex Morgan');
    expect(res.body.statusHistory).toHaveLength(1);
    expect(res.body.statusHistory[0].status).toBe('received');
    expect(res.body.statusHistory[0].at).toBeDefined();
  });

  it('returns 400 when an item quantity exceeds 99', async () => {
    const body = {
      ...validBody,
      items: [{ menuItemId: 'pizza-margherita', quantity: 100 }],
    };
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
  });

  it('rejects an oversized payload', async () => {
    const huge = 'x'.repeat(60_000);
    const body = { ...validBody, customer: { ...validBody.customer, name: huge } };
    const res = await request(app).post('/api/orders').send(body);
    // Either Express's body-parser rejects (413) or Zod rejects (400). Both prove the limit.
    expect([400, 413]).toContain(res.status);
  });

  it('calculates subtotal, tax, deliveryFee, and total server-side', async () => {
    const res = await request(app).post('/api/orders').send(validBody);
    // Margherita 299 x 2 + Mango Lassi 99 x 1 = 697
    expect(res.body.subtotal).toBe(697);
    expect(res.body.deliveryFee).toBe(40);
    expect(res.body.tax).toBeCloseTo(34.85, 2);
    expect(res.body.total).toBeCloseTo(771.85, 2);
  });

  it('returns 400 when customer.name is missing', async () => {
    const body = {
      ...validBody,
      customer: { ...validBody.customer, name: '' },
    };
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when customer.phone is missing', async () => {
    const body = {
      ...validBody,
      customer: { ...validBody.customer, phone: '' },
    };
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid phone number', async () => {
    const body = {
      ...validBody,
      customer: { ...validBody.customer, phone: '12345' },
    };
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
  });

  it('returns 400 when items array is empty', async () => {
    const body = { ...validBody, items: [] };
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
  });

  it('returns 400 for a non-existent menuItemId', async () => {
    const body = {
      ...validBody,
      items: [{ menuItemId: 'no-such-item', quantity: 1 }],
    };
    const res = await request(app).post('/api/orders').send(body);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/orders/:id', () => {
  it('returns the order after creation', async () => {
    const created = await request(app).post('/api/orders').send(validBody);
    const fetched = await request(app).get(`/api/orders/${created.body.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.id).toBe(created.body.id);
  });

  it('returns 404 for an unknown ID', async () => {
    const res = await request(app).get('/api/orders/ORD-00000');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/orders/:id/status', () => {
  it("returns { id, status: 'received' } right after creation", async () => {
    const created = await request(app).post('/api/orders').send(validBody);
    const res = await request(app).get(
      `/api/orders/${created.body.id}/status`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: created.body.id, status: 'received' });
  });
});

describe('PATCH /api/orders/:id/status', () => {
  it('updates and returns the updated order', async () => {
    const created = await request(app).post('/api/orders').send(validBody);
    const res = await request(app)
      .patch(`/api/orders/${created.body.id}/status`)
      .send({ status: 'preparing' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('preparing');
    expect(res.body.statusHistory.map((h: { status: string }) => h.status)).toEqual([
      'received',
      'preparing',
    ]);
  });

  it('returns 400 for an invalid status value', async () => {
    const created = await request(app).post('/api/orders').send(validBody);
    const res = await request(app)
      .patch(`/api/orders/${created.body.id}/status`)
      .send({ status: 'cooked' });
    expect(res.status).toBe(400);
  });

  it('rejects a backwards status transition', async () => {
    const created = await request(app).post('/api/orders').send(validBody);
    // Move forward to delivered
    await request(app)
      .patch(`/api/orders/${created.body.id}/status`)
      .send({ status: 'delivered' });
    // Try to move back to preparing → 400
    const res = await request(app)
      .patch(`/api/orders/${created.body.id}/status`)
      .send({ status: 'preparing' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/back to preparing/i);
  });
});
