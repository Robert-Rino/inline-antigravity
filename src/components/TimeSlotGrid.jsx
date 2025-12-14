export default function TimeSlotGrid({ selectedTime, setSelectedTime, availableTimes }) {
    return (
        <div className="card">
            <h3>Select Time</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginTop: '16px' }}>
                {availableTimes.map(time => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: selectedTime === time ? 'var(--primary-color)' : 'transparent',
                            color: selectedTime === time ? '#000' : 'var(--primary-color)',
                            border: '1px solid var(--primary-color)'
                        }}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    );
}
