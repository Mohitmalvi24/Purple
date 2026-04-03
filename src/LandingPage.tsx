import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './App';

export default function LandingPage() {
  const { token } = useContext(AuthContext);
  return (
    <div className="reveal" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>VibeKit Studio</h1>
        <nav>
          {token ? (
            <Link to="/app" className="v-btn" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
          ) : (
            <Link to="/auth" className="v-btn" style={{ textDecoration: 'none' }}>Login</Link>
          )}
        </nav>
      </header>
      
      <main style={{ flex: 1, padding: '48px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1.2 }}>Generate a theme, build a mini-site, publish it.</h2>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Create polished, blazing-fast web pages in minutes using beautiful design systems with our powerful Vibe Generator.
        </p>
        <Link to={token ? "/app" : "/auth"} className="v-btn" style={{ display: 'inline-block', fontSize: '18px', padding: '16px 32px', textDecoration: 'none' }}>
          Create your first page
        </Link>
      </main>

      <section style={{ padding: '48px 24px', background: 'var(--surface-color)' }}>
        <h3 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '32px' }}>Explore Example Vibes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Example 1 */}
          <div data-vibe="minimal" className="v-surface reveal" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>Minimal / Editorial</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Clean structure, precise typography.</p>
            <button className="v-btn" style={{ marginTop: 'auto' }}>Preview Template</button>
          </div>
          {/* Example 2 */}
          <div data-vibe="dark-neon" className="v-surface reveal" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animationDelay: '0.1s' }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>Dark / Neon</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Vibrant cyberpunk aesthetic.</p>
            <button className="v-btn" style={{ marginTop: 'auto' }}>Preview Template</button>
          </div>
          {/* Example 3 */}
          <div data-vibe="pastel" className="v-surface reveal" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animationDelay: '0.2s' }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>Pastel / Soft</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Warm, inviting colors and rounded corners.</p>
            <button className="v-btn" style={{ marginTop: 'auto' }}>Preview Template</button>
          </div>
        </div>
      </section>
    </div>
  );
}
