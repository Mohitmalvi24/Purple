import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from './App';
import { SectionRenderer } from './Components';

export default function Editor() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const themes = ['minimal', 'neobrutal', 'dark-neon', 'pastel', 'luxury', 'retro'];

  useEffect(() => {
    fetch(`/api/pages/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setPage(data); setLoading(false); });
  }, [id]);

  const save = async (dataToSave = page) => {
    setSaving(true);
    await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataToSave)
    });
    setTimeout(() => setSaving(false), 500);
  };

  const togglePublish = async () => {
    const pub = !page.isPublished;
    await fetch(`/api/pages/${id}/${pub ? 'publish' : 'unpublish'}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }
    });
    setPage({...page, isPublished: pub});
  };

  const updateField = (field: string, val: string) => {
    let updated = { ...page, [field]: val };
    if (field === 'title') {
      // Auto-suggest slug from title if slug is empty or matches previous title slug
      const oldSlug = page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!page.slug || page.slug === oldSlug || page.slug === 'new-page') {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
    }
    setPage(updated);
  };

  const moveSection = (idx: number, dir: number) => {
    if (idx + dir < 0 || idx + dir >= page.sections.length) return;
    const newSections = [...page.sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[idx + dir];
    newSections[idx + dir] = temp;
    const updated = { ...page, sections: newSections };
    setPage(updated);
    save(updated);
  };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading Editor...</div>;
  if (!page) return <div style={{ padding: '48px', color: 'red' }}>Page not found.</div>;

  const previewWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{ width: '350px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--surface-color)', zIndex: 10 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <Link to="/app" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px', display: 'inline-block' }}>← Back to Dashboard</Link>
          <h2 style={{ margin: '8px 0', fontSize: '24px' }}>Editor</h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="v-btn" onClick={() => save()}>Save</button>
            <button className="v-surface" onClick={togglePublish} style={{ flex: 1, border: '1px solid var(--border-color)', background: page.isPublished ? '#4caf50' : '#ff9800', color: '#fff', padding: '12px' }}>
              {page.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
          {saving && <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', display: 'block' }}>Saving...</span>}
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Page Title</label>
            <input className="v-input" value={page.title} onChange={e => updateField('title', e.target.value)} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>URL Slug</label>
            <input className="v-input" value={page.slug} onChange={e => updateField('slug', e.target.value)} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Theme preset</label>
            <select className="v-input" value={page.theme} onChange={e => updateField('theme', e.target.value)}>
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <h3 style={{ fontSize: '18px', margin: '32px 0 16px' }}>Sections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {page.sections.map((sec: any, idx: number) => (
              <div key={idx} className="v-surface" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'capitalize' }}>{sec.type}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => moveSection(idx, -1)} disabled={idx===0} style={{ padding: '4px' }}>↑</button>
                  <button onClick={() => moveSection(idx, 1)} disabled={idx===page.sections.length-1} style={{ padding: '4px' }}>↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
      
      <main style={{ flex: 1, backgroundColor: '#e5e5e5', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
          {['desktop', 'tablet', 'mobile'].map(m => (
            <button key={m} onClick={() => setPreviewMode(m as any)} style={{ padding: '8px 16px', background: previewMode === m ? 'var(--text-primary)' : 'transparent', color: previewMode === m ? 'var(--bg-color)' : 'var(--text-primary)', border: '1px solid var(--text-primary)', borderRadius: '16px', cursor: 'pointer', textTransform: 'capitalize' }}>
              {m}
            </button>
          ))}
          {page.isPublished && (
            <a href={`/p/${page.slug}`} target="_blank" className="v-btn" style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}>View Public URL ↗</a>
          )}
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <div data-vibe={page.theme} style={{ 
            width: previewWidths[previewMode], 
            backgroundColor: 'var(--bg-color)', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'width 0.3s ease',
            minHeight: '100%',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}>
            {page.sections.map((sec: any, idx: number) => (
              <SectionRenderer key={idx} type={sec.type} data={sec.data} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
