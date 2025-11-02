import request from 'supertest';
import { app } from '../app';

describe('Auth', () => {
  const email = `user${Date.now()}@example.com`;
  const password = 'Secret123!';

  it('registers a user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('logs in the user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});