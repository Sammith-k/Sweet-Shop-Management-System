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
        <nav className="container">
          <Link to="/">Indian Sweet Shop</Link>
          <span style={{ float: 'right' }}>
            {auth ? (
              <>
                <span style={{ marginRight: 8 }}>{auth.user.name} ({auth.user.role})</span>
                {auth.user.role === 'ADMIN' && <Link to="/admin" style={{ marginRight: 8 }}>Admin</Link>}
                <button onClick={() => { logout(); navigate('/'); }} className="danger">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" style={{ marginLeft: 8 }}>Register</Link>
              </>
            )}
          </span>
        </nav>
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