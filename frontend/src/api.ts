const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export type LoginResult = {
  token: string;
  user: { id: string; name: string; email: string; role: 'USER' | 'ADMIN' };
};

function authHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export const api = {
  async register(name: string, email: string, password: string): Promise<LoginResult> {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  async login(email: string, password: string): Promise<LoginResult> {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  async listSweets() {
    const res = await fetch(`${API_URL}/api/sweets`);
    if (!res.ok) throw new Error('Failed to load');
    return res.json();
  },
  async search(params: { name?: string; category?: string; minPrice?: string; maxPrice?: string }) {
    const filtered: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v != null && String(v).trim() !== '') filtered[k] = String(v).trim();
    }
    const q = new URLSearchParams(filtered).toString();
    const res = await fetch(`${API_URL}/api/sweets/search${q ? `?${q}` : ''}`);
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to load');
    return res.json();
  },
  async addSweet(token: string, data: any) {
    const res = await fetch(`${API_URL}/api/sweets`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  async updateSweet(token: string, id: string, data: any) {
    const res = await fetch(`${API_URL}/api/sweets/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  async deleteSweet(token: string, id: string) {
    const res = await fetch(`${API_URL}/api/sweets/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return true;
  },
  async purchase(token: string, id: string, quantity: number) {
    const res = await fetch(`${API_URL}/api/sweets/${id}/purchase`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  async restock(token: string, id: string, quantity: number) {
    const res = await fetch(`${API_URL}/api/sweets/${id}/restock`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  }
};