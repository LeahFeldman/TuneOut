import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ContactUs from './Contact';

describe('ContactUs Component', () => {
  it('renders all form fields correctly', () => {
    render(<ContactUs />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('submits the form and resets fields', () => {
    // Mock alert
    window.alert = vi.fn();

    render(<ContactUs />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'This is a test message.' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(window.alert).toHaveBeenCalledWith("Thanks for reaching out! We’ll get back to you soon.");
    expect(screen.getByLabelText(/name/i).value).toBe('');
    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/subject/i).value).toBe('');
    expect(screen.getByLabelText(/message/i).value).toBe('');
  });
});
