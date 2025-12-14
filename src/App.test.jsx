import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Reservation App E2E Flow', () => {
    it('completes the full booking flow successfully', () => {
        render(<App />);

        // 1. Initial State: Check Header
        expect(screen.getByText('Le Gourmet Premium')).toBeInTheDocument();

        // 2. Select Party Size (e.g., 4)
        const partySizeButton = screen.getByText('4');
        fireEvent.click(partySizeButton);
        // Verify selection visual state (custom check usually, but clicking is enough for functional flow)

        // 3. Select Date (we'll pick the first one available which is usually "today")
        // The dates are rendered as buttons. Let's pick the second one to be safe (tomorrow).
        const dateButtons = screen.getAllByRole('button');
        // Filter specifically for date buttons if needed, but the layout is distinct.
        // Our DateSelector buttons contain the day number.
        // Let's just click the 2nd button in the DateSelector container (assuming logic works)
        // For specific selection, we can just find a button with a number.
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = tomorrow.getDate().toString();

        // Find button with tomorrow's day number. It might match other things, so be careful.
        // The DateSelector renders day numbers in bold.
        const tomorrowButton = screen.getByText(tomorrowDay, { selector: 'span' }).closest('button');
        fireEvent.click(tomorrowButton);

        // 4. Select Time (e.g., 19:00)
        const timeButton = screen.getByText('19:00');
        fireEvent.click(timeButton);

        // 5. Proceed to Contact Form
        const contactButton = screen.getByText('My Contact Info');
        expect(contactButton).toBeEnabled();
        fireEvent.click(contactButton);

        // 6. Fill Contact Form
        expect(screen.getByText('Contact Information')).toBeInTheDocument();

        const nameInput = screen.getByPlaceholderText('John Doe');
        fireEvent.change(nameInput, { target: { value: 'Test User' } });

        const phoneInput = screen.getByPlaceholderText('+1 (555) 000-0000');
        fireEvent.change(phoneInput, { target: { value: '555-0199' } });

        const requestsInput = screen.getByPlaceholderText('Allergies, high chair needed, etc.');
        fireEvent.change(requestsInput, { target: { value: 'Vegetarian' } });

        // 7. Submit Booking
        const confirmButton = screen.getByText('Confirm Booking');
        fireEvent.click(confirmButton);

        // 8. Verify Confirmation
        expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
        expect(screen.getByText(/Test User/)).toBeInTheDocument();
        expect(screen.getByText('19:00')).toBeInTheDocument();
        expect(screen.getByText('4 People')).toBeInTheDocument();
    });
});
