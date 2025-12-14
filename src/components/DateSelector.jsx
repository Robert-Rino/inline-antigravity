export default function DateSelector({ selectedDate, setSelectedDate }) {
    // Simple mock of next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="card">
            <h3>Select Date</h3>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', marginTop: '16px', paddingBottom: '8px' }}>
                {dates.map(date => {
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(date)}
                            style={{
                                minWidth: '80px',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: isSelected ? 'var(--primary-color)' : '#3a3a3a',
                                color: isSelected ? '#000' : '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
