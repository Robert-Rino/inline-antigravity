import { useState } from 'react';
import PartySelector from './PartySelector';
import DateSelector from './DateSelector';
import TimeSlotGrid from './TimeSlotGrid';
import ContactForm from './ContactForm';
import Confirmation from './Confirmation';

const MOCK_TIMES = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

export default function BookingForm() {
    const [step, setStep] = useState(1);
    const [partySize, setPartySize] = useState(2);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
    };

    const handleNext = () => {
        if (step === 1 && selectedTime) {
            setStep(2);
        }
    };

    const handleContactSubmit = (contactData) => {
        setBookingDetails({
            partySize,
            date: selectedDate,
            time: selectedTime,
            contact: contactData
        });
        setStep(3);
    };

    if (step === 3 && bookingDetails) {
        return <Confirmation bookingDetails={bookingDetails} />;
    }

    if (step === 2) {
        return <ContactForm onSubmit={handleContactSubmit} onBack={() => setStep(1)} />;
    }

    return (
        <>
            <PartySelector partySize={partySize} setPartySize={setPartySize} />
            <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <TimeSlotGrid
                selectedTime={selectedTime}
                setSelectedTime={handleTimeSelection}
                availableTimes={MOCK_TIMES}
            />

            <div style={{ marginTop: '24px' }}>
                <button
                    className="btn-primary"
                    disabled={!selectedTime}
                    onClick={handleNext}
                    style={{ opacity: selectedTime ? 1 : 0.5, cursor: selectedTime ? 'pointer' : 'not-allowed' }}
                >
                    My Contact Info
                </button>
            </div>
        </>
    );
}
