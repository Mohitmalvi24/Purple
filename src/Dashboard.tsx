import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './App';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const createPage = async () => {
    const defaultSections = [
      { id: '1', type: 'hero', data: { title: 'Welcome to my site', subtitle: 'This is a custom hero section', buttonText: 'Learn More', buttonHref: '#' } },
      { id: '2', type: 'features', data: { items: [{title: 'Feature 1', desc: 'Detail 1'}, {title: 'Feature 2', desc: 'Detail 2'}] } },
      { id: '3', type: 'gallery', data: { images: ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop'] } },
      { id: '4', type: 'contact', data: { title: 'Get in Touch' } }
    ];

    const slug = `site-${Date.now()}`;
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'New Page', slug, theme: 'minimal', sections: defaultSections
      })
    });
    if (res.ok) {
      const newPage = await res.json();
      navigate(`/app/editor/${newPage.id}`);
    }
  };

  const duplicatePage = async (id: string) => {
    await fetch(`/api/pages/${id}/duplicate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPages();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="v-btn" onClick={createPage}>Create New Page</button>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      {loading ? (
        <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: '8px' }}></div>
      ) : pages.length === 0 ? (
        <div className="v-surface" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any pages yet.</p>
          <button className="v-btn" onClick={createPage} style={{ marginTop: '16px' }}>Start Building</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {pages.map((p) => (
            <div key={p.id} className="v-surface reveal" style={{ padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '12px', background: p.isPublished ? '#4caf50' : '#ff9800', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>
                {p.isPublished ? 'Published' : 'Draft'}
              </div>
              <h3 style={{ margin: '0 0 8px 0', paddingRight: '60px' }}>{p.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Views: {p.viewCount}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Theme: {p.theme}</p>
              
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <Link to={`/app/editor/${p.id}`} className="v-btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Edit</Link>
                <button className="v-surface" style={{ flex: 1, border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }} onClick={() => duplicatePage(p.id)}>Clone</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
