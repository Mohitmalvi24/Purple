import { useState } from 'react';

export const HeroSection = ({ title, subtitle, buttonText, buttonHref }: any) => (
  <section style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <h1 style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1.2 }}>{title}</h1>
    <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px' }}>{subtitle}</p>
    {buttonText && <a href={buttonHref} className="v-btn" style={{ textDecoration: 'none' }}>{buttonText}</a>}
  </section>
);

export const FeaturesSection = ({ items }: any) => (
  <section style={{ padding: '64px 24px', background: 'var(--surface-color)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
      {items.map((item: any, idx: number) => (
        <div key={idx} className="v-surface" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', border: 'none', background: 'var(--bg-color)', borderRadius: 'var(--radius-main)', boxShadow: 'var(--box-shadow)' }}>
          <h3 style={{ fontSize: '24px', margin: 0 }}>{item.title}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export const GallerySection = ({ images }: any) => (
  <section style={{ padding: '64px 24px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
      {images.map((img: string, idx: number) => (
        <div key={idx} style={{ aspectRatio: '1', borderRadius: 'var(--radius-main)', overflow: 'hidden', boxShadow: 'var(--box-shadow)' }}>
          <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>
      ))}
    </div>
  </section>
);

export const ContactSection = ({ title, slug }: any) => {
  const [status, setStatus] = useState<'' | 'loading' | 'success' | 'error'>('');
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    const formUrl = slug ? `/api/public/pages/${slug}/contact` : null;
    if (!formUrl) {
      // Preview mode from editor
      setTimeout(() => setStatus('success'), 1000);
      return;
    }

    try {
      const res = await fetch(formUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value
        })
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section style={{ padding: '64px 24px', background: 'var(--surface-color)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '32px' }}>{title || 'Contact Us'}</h2>
        {status === 'success' ? (
          <div style={{ padding: '24px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-main)' }}>
            <h3 style={{ margin: 0, color: '#4caf50' }}>Message sent!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>We will get back to you soon.</p>
          </div>
        ) : (
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
            <input name="name" className="v-input" type="text" placeholder="Your Name" required />
            <input name="email" className="v-input" type="email" placeholder="Your Email" required />
            <textarea name="message" className="v-input" placeholder="Your Message" rows={5} required style={{ resize: 'vertical' }}></textarea>
            <button type="submit" className="v-btn" disabled={status==='loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'error' && <p style={{ color: 'red', fontSize: '14px' }}>Failed to send message. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
};

export const SectionRenderer = ({ type, data }: any) => {
  switch (type) {
    case 'hero': return <HeroSection {...data} />;
    case 'features': return <FeaturesSection {...data} />;
    case 'gallery': return <GallerySection {...data} />;
    case 'contact': return <ContactSection {...data} />;
    default: return null;
  }
};
