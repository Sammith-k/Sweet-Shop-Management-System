import React from 'react';
import { api } from '../api';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import AdminSweetCard from '../components/AdminSweetCard';

type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  quantity: number;
};

export default function Admin() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = React.useState<Sweet[]>([]);
  const [form, setForm] = React.useState({ name: '', category: '', price: '', quantity: '0' });
  const [edit, setEdit] = React.useState<Partial<Sweet> | null>(null);

  React.useEffect(() => {
    if (!auth || auth.user.role !== 'ADMIN') navigate('/');
    load();
  }, []);

  const load = async () => {
    const data = await api.listSweets();
    setSweets(data);
  };

  const addSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await api.addSweet(auth.token, {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity)
      });
      alert('Mithai added');
      setForm({ name: '', category: '', price: '', quantity: '0' });
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to add');
    }
  };

  const updateSweet = async () => {
    if (!auth || !edit || !edit.id) return;
    try {
      const data: any = {};
      if (edit.name) data.name = edit.name;
      if (edit.category) data.category = edit.category;
      if (edit.price != null) data.price = Number(edit.price);
      await api.updateSweet(auth.token, edit.id, data);
      alert('Updated');
      setEdit(null);
      await load();
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
  };

  const deleteSweet = async (id: string) => {
    if (!auth) return;
    if (!confirm('Delete this mithai?')) return;
    await api.deleteSweet(auth.token, id);
    alert('Deleted');
    await load();
  };

  const restock = async (id: string) => {
    if (!auth) return;
    const qtyStr = prompt('Quantity to restock:', '5');
    if (!qtyStr) return;
    await api.restock(auth.token, id, Number(qtyStr));
    alert('Restocked');
    await load();
  };

  return (
    <>
      <div className="card">
        <h2 style={{ margin: 0 }}>Add New Mithai</h2>
        <p className="kicker">Price is per piece in ₹.</p>
        <form onSubmit={addSweet} style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
          <input placeholder="Name (e.g., Kaju Katli)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Category (e.g., Dry Fruit)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <button className="primary">Add</button>
        </form>
      </div>

      <div style={{ height: 12 }} />

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Manage Mithai</h2>
        <div className="grid">
          {sweets.map((s) => (
            <AdminSweetCard
              key={s.id}
              sweet={s}
              onRestock={restock}
              onEdit={(x) => setEdit(x)}
              onDelete={deleteSweet}
            />
          ))}
        </div>
      </div>

      {edit && (
        <>
          <div style={{ height: 12 }} />
          <div className="card">
            <h3>Edit Mithai</h3>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 1fr auto' }}>
              <input placeholder="Name" value={edit.name || ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              <input placeholder="Category" value={edit.category || ''} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
              <input placeholder="Price (₹)" value={String(edit.price ?? '')} onChange={(e) => setEdit({ ...edit, price: e.target.value })} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="primary" onClick={updateSweet}>Save</button>
                <button className="ghost" onClick={() => setEdit(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}