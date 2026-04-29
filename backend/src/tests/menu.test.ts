import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Menu API', () => {
  describe('GET /api/menu', () => {
    it('returns 200 and an array of 12 items', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(12);
    });

    it('each item has the expected shape', async () => {
      const res = await request(app).get('/api/menu');
      const requiredKeys = [
        'id',
        'name',
        'description',
        'price',
        'image',
        'category',
        'rating',
        'prepTime',
        'isAvailable',
      ];
      for (const item of res.body) {
        for (const key of requiredKeys) {
          expect(item).toHaveProperty(key);
        }
        expect(typeof item.price).toBe('number');
        expect(typeof item.rating).toBe('number');
        expect(typeof item.isAvailable).toBe('boolean');
      }
    });

    it('?category=pizza returns only pizza items', async () => {
      const res = await request(app).get('/api/menu?category=pizza');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      for (const item of res.body) {
        expect(item.category).toBe('pizza');
      }
    });

    it('?category=invalid returns an empty array, not an error', async () => {
      const res = await request(app).get('/api/menu?category=invalid');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('returns the correct item for a valid ID', async () => {
      const res = await request(app).get('/api/menu/pizza-margherita');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('pizza-margherita');
      expect(res.body.name).toBe('Margherita Pizza');
    });

    it('returns 404 for an invalid ID', async () => {
      const res = await request(app).get('/api/menu/does-not-exist');
      expect(res.status).toBe(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Static menu images', () => {
    it('serves an existing menu image with cross-origin headers', async () => {
      const res = await request(app).get(
        '/static/menu/margherita_pizza.png',
      );
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/^image\/png/);
      expect(res.headers['cross-origin-resource-policy']).toBe(
        'cross-origin',
      );
    });

    it('returns 404 for an unknown image', async () => {
      const res = await request(app).get('/static/menu/nope.png');
      expect(res.status).toBe(404);
    });
  });
});
