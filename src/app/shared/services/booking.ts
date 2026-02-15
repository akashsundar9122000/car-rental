import { Injectable, signal } from '@angular/core';
import { Car } from '../models/car';

export interface Booking {
    id: string;
    car: Car;
    startDate: string;
    endDate: string;
    source: string;
    destination: string;
    totalPrice: number;
    isDriverNeeded: boolean;
    status: 'Payment Pending' | 'Paid' | 'Completed';
    bookingDate: Date;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    // using a signal to hold the list of bookings
    private bookings = signal<Booking[]>([]);

    constructor() {
        // Load from local storage if available (optional for now, but good for persistence)
        const saved = localStorage.getItem('bookings');
        if (saved) {
            this.bookings.set(JSON.parse(saved));
        }
    }

    getBookings() {
        return this.bookings.asReadonly();
    }

    addBooking(booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>) {
        const newBooking: Booking = {
            ...booking,
            id: Math.random().toString(36).substring(2, 9).toUpperCase(),
            bookingDate: new Date(),
            status: 'Payment Pending'
        };

        this.bookings.update(current => [newBooking, ...current]);
        this.saveToStorage();
    }

    updateBookingStatus(id: string, status: 'Payment Pending' | 'Paid' | 'Completed') {
        this.bookings.update(current => current.map(b =>
            b.id === id ? { ...b, status } : b
        ));
        this.saveToStorage();
    }

    private saveToStorage() {
        localStorage.setItem('bookings', JSON.stringify(this.bookings()));
    }
}
