import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>
      <p className="kicker">Shop your favourite mithai and enjoy sweet deals.</p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="primary">Register</button>
      </form>
      {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
    </div>
  );
}