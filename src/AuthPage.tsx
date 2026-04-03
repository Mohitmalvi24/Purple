import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const contentType = res.headers.get('content-type');
      let data: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      login(data.token, data.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--surface-color)' }}>
      <form onSubmit={handleSubmit} className="v-surface reveal" style={{ padding: '32px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 16px', fontSize: '24px' }}>{isLogin ? 'Login to VibeKit' : 'Join VibeKit Studio'}</h2>
        {error && <div style={{ color: 'red', fontSize: '14px', background: '#ffebee', padding: '8px', borderRadius: '4px' }}>{error}</div>}
        <input 
          type="email" 
          placeholder="Email address" 
          className="v-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="v-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit" className="v-btn" style={{ marginTop: '16px' }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </form>
    </div>
  );
}
