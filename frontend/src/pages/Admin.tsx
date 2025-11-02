import React from 'react';
import { api } from '../api';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/currency';

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
    await api.addSweet(auth.token, {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity)
    });
    setForm({ name: '', category: '', price: '', quantity: '0' });
    await load();
  };

  const updateSweet = async () => {
    if (!auth || !edit || !edit.id) return;
    const data: any = {};
    if (edit.name) data.name = edit.name;
    if (edit.category) data.category = edit.category;
    if (edit.price != null) data.price = Number(edit.price);
    await api.updateSweet(auth.token, edit.id, data);
    setEdit(null);
    await load();
  };

  const deleteSweet = async (id: string) => {
    if (!auth) return;
    if (!confirm('Delete this mithai?')) return;
    await api.deleteSweet(auth.token, id);
    await load();
  };

  const restock = async (id: string) => {
    if (!auth) return;
    const qtyStr = prompt('Quantity to restock:', '5');
    if (!qtyStr) return;
    await api.restock(auth.token, id, Number(qtyStr));
    await load();
  };

  return (
    <>
      <div className="card">
        <h2>Add New Mithai (₹)</h2>
        <form onSubmit={addSweet}>
          <input placeholder="Name (e.g., Gulab Jamun)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Category (e.g., Mithai/Bengali)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <button className="primary">Add</button>
        </form>
      </div>

      <div className="card">
        <h2>Manage Mithai</h2>
        {sweets.map((s) => (
          <div key={s.id} className="card">
            <b>{s.name}</b> — {s.category} — {formatINR(s.price)} — Stock: {s.quantity}
            <div>
              <button className="primary" onClick={() => restock(s.id)}>Restock</button>
              <button onClick={() => setEdit({ id: s.id, name: s.name, category: s.category, price: s.price })}>Edit</button>
              <button className="danger" onClick={() => deleteSweet(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <div className="card">
          <h3>Edit Mithai</h3>
          <input placeholder="Name" value={edit.name || ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
          <input placeholder="Category" value={edit.category || ''} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
          <input placeholder="Price (₹)" value={String(edit.price ?? '')} onChange={(e) => setEdit({ ...edit, price: e.target.value })} />
          <button className="primary" onClick={updateSweet}>Save</button>
          <button onClick={() => setEdit(null)}>Cancel</button>
        </div>
      )}
    </>
  );
}