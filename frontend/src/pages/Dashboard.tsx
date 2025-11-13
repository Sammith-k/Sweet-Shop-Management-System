import React from 'react';
import { api } from '../api';
import { useAuth } from '../useAuth';
import SweetCard from '../components/SweetCard';
import SkeletonGrid from '../components/Skeleton';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';

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
    if (!auth) {
      toast.error('Please login to purchase');
      return;
    }
    try {
      await api.purchase(auth.token, id, 1);
      toast.success('Purchased 🎉');
      await search();
    } catch (e: any) {
      toast.error(e.message || 'Purchase failed');
    }
  };

  return (
    <>
      <SearchBar filters={filters} setFilters={setFilters} onSearch={search} onReset={load} />

      {loading && <SkeletonGrid count={6} />}
      {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
      {!loading && sweets.length === 0 && <p className="empty">No mithai found. Try Reset or loosen your filters.</p>}

      {!loading && sweets.length > 0 && (
        <div className="grid">
          {sweets.map((s) => (
            <SweetCard key={s.id} sweet={s} onPurchase={purchase} isAuthed={!!auth} />
          ))}
        </div>
      )}
    </>
  );
}