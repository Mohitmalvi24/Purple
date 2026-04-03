import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SectionRenderer } from './Components';

export default function PublicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/pages/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setPage(data);
        setLoading(false);
        // Track view
        fetch(`/api/public/pages/${slug}/view`, { method: 'POST' });
        document.title = data.title;
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
    <div className="skeleton" style={{ width: '200px', height: '40px', borderRadius: '4px' }}></div>
    <div className="skeleton" style={{ width: '400px', height: '20px', borderRadius: '4px' }}></div>
  </div>;
  if (error) return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><h2>404 - Page not found or not published.</h2></div>;

  return (
    <div data-vibe={page.theme} style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family)'
    }} className="reveal">
      {page.sections.map((sec: any, idx: number) => (
        <SectionRenderer key={idx} type={sec.type} data={{...sec.data, slug: page.slug}} />
      ))}
    </div>
  );
}
