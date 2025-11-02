import React from 'react';
import { api } from '../api';
import { useAuth } from '../useAuth';
import { formatINR } from '../utils/currency';

type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  quantity: number;
};

export default function Dashboard() {
  const [sweets, setSweets] = React.useState<Sweet[]>([]);
  const [filters, setFilters] = React.useState({ name: '', category: '', minPrice: '', maxPrice: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { auth } = useAuth();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listSweets();
      setSweets(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const search = async () => {
    setLoading(true);
    try {
      const data = await api.search(filters);
      setSweets(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const purchase = async (id: string) => {
    if (!auth) return alert('Please login');
    try {
      await api.purchase(auth.token, id, 1);
      await search();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <>
      <div className="card">
        <h2>Search Indian Mithai</h2>
        <input placeholder="Name (e.g., Gulab)" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Category (e.g., Mithai/Bengali)" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input placeholder="Min Price (₹)" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input placeholder="Max Price (₹)" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button className="primary" onClick={search}>Apply</button>
        <button onClick={load}>Reset</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && sweets.length === 0 && <p>No mithai found. Try Reset or loosen your filters.</p>}

      <div className="grid">
        {sweets.map((s) => (
          <div key={s.id} className="card">
            <h3>{s.name}</h3>
            <div>Category: {s.category}</div>
            <div>Price: {formatINR(s.price)}</div>
            <div>In stock: {s.quantity}</div>
            <button className="primary" disabled={!auth || s.quantity === 0} onClick={() => purchase(s.id)}>
              Purchase
            </button>
          </div>
        ))}
      </div>
    </>
  );
}