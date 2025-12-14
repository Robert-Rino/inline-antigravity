export default function Header() {
  return (
    <header style={{ textAlign: 'center', marginBottom: '32px' }}>
      <img 
        src="https://placehold.co/100x100/d1b06b/black?text=Logo" 
        alt="Restaurant Logo" 
        style={{ borderRadius: '50%', marginBottom: '16px', border: '2px solid var(--primary-color)' }}
      />
      <h2>Le Gourmet Premium</h2>
      <p style={{ color: 'var(--text-muted)' }}>Fine Dining Experience</p>
    </header>
  );
}
