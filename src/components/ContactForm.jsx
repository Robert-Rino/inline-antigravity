export default function ContactForm({ onSubmit, onBack }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    return (
        <div className="card">
            <h3>Contact Information</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Name</label>
                    <input
                        name="name"
                        required
                        placeholder="John Doe"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #444',
                            background: '#333',
                            color: '#fff'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Phone Number</label>
                    <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #444',
                            background: '#333',
                            color: '#fff'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Special Requests</label>
                    <textarea
                        name="requests"
                        rows="3"
                        placeholder="Allergies, high chair needed, etc."
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #444',
                            background: '#333',
                            color: '#fff',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderRadius: '50px',
                            background: '#444',
                            color: '#fff'
                        }}
                    >
                        Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                        Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    );
}
