import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

export default function App() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header>
        <div className="nav">
          <Link to="/" className="brand">Indian Mithai Shop</Link>
          <div>
            {auth ? (
              <>
                <span style={{ marginRight: 12, color: '#94a3b8' }}>
                  {auth.user.name} ({auth.user.role})
                </span>
                {auth.user.role === 'ADMIN' && <Link to="/admin" style={{ marginRight: 12 }}>Admin</Link>}
                <button className="danger" onClick={() => { logout(); navigate('/'); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" style={{ marginLeft: 12 }}>Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}