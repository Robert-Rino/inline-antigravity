export default function PartySelector({ partySize, setPartySize }) {
    const sizes = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <div className="card">
            <h3>Select Party Size</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                {sizes.map(size => (
                    <button
                        key={size}
                        onClick={() => setPartySize(size)}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            backgroundColor: partySize === size ? 'var(--primary-color)' : '#3a3a3a',
                            color: partySize === size ? '#000' : '#fff',
                            flex: '1 0 40px',
                        }}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
}
