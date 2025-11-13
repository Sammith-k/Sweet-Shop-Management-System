import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('admin@example.com');
  const [password, setPassword] = React.useState('Admin123!');
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <p className="kicker">Use the seeded admin or create your own account.</p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary">Login</button>
      </form>
      {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
    </div>
  );
}