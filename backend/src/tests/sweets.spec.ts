import request from 'supertest';
import { app } from '../app';

async function loginAsAdmin() {
  const res = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'Admin123!'
  });
  return res.body.token as string;
}

async function registerAndLoginUser() {
  const email = `user${Date.now()}@ex.com`;
  const password = 'Secret123!';
  const res = await request(app).post('/api/auth/register').send({
    name: 'Joe',
    email,
    password
  });
  return res.body.token as string;
}

describe('Sweets & Inventory', () => {
  let adminToken: string;
  let userToken: string;
  let sweetId: string;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    userToken = await registerAndLoginUser();
  });

  it('admin can create a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Caramel-${Date.now()}`,
        category: 'Candy',
        price: 1.2,
        quantity: 10
      });
    expect(res.status).toBe(201);
    sweetId = res.body.id;
  });

  it('anyone can list sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('search works', async () => {
    const res = await request(app).get('/api/sweets/search?category=candy');
    expect(res.status).toBe(200);
  });

  it('user can purchase a sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBeGreaterThanOrEqual(0);
  });

  it('admin can restock', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
  });

  it('non-admin cannot delete', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('admin can delete', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});