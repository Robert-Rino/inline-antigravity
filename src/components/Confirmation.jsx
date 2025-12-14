export default function Confirmation({ bookingDetails }) {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(209, 176, 107, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                color: 'var(--primary-color)',
                fontSize: '40px'
            }}>
                ✓
            </div>
            <h2 style={{ marginBottom: '16px' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                We look forward to seeing you, {bookingDetails.contact.name}.
            </p>

            <div style={{ background: '#333', borderRadius: '12px', padding: '24px', textAlign: 'left' }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Date</span>
                    <b>{bookingDetails.date.toLocaleDateString()}</b>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Time</span>
                    <b>{bookingDetails.time}</b>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Party Size</span>
                    <b>{bookingDetails.partySize} People</b>
                </p>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="btn-primary"
                style={{ marginTop: '32px' }}
            >
                Make Another Booking
            </button>
        </div>
    );
}
