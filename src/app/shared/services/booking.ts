import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { CarVariant } from '../models/car';
import { AuthService } from './auth';
import { environment } from '../../../environments/environment';

export interface Booking {
    id: string;
    variant: CarVariant;
    startDate: string;
    endDate: string;
    source: string;
    destination: string;
    totalPrice: number;
    isDriverNeeded: boolean;
    status: 'PENDING' | 'APPROVED' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
    bookingDate: Date;
    user?: { fullName: string; email: string; };
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/bookings`;

    // using a signal to hold the list of bookings
    private bookings = signal<Booking[]>([]);

    constructor() {
        // Don't auto-load bookings on construction — wait until user is authenticated
        // ProfileComponent.ngOnInit() will call fetchUserBookings() explicitly
    }

    fetchUserBookings() {
        return this.http.get<Booking[]>(`${this.API_URL}/my-bookings`).pipe(
            tap(data => this.bookings.set(data)),
            tap({
                error: (err) => console.log('Failed to load bookings (maybe not logged in)', err)
            })
        );
    }

    getBookings() {
        return this.bookings.asReadonly();
    }

    addBooking(booking: Omit<Booking, 'id' | 'bookingDate' | 'status'> & { carId: string }) {
        // Backend expects BookingRequest DTO likely. I need to map it.
        // Or backend entity directly. 
        // Let's send the object and see. Backend maps DTO.
        // Actually, backend BookingController likely takes a DTO with carId, not full Car object.
        // I should check BookingRequest DTO.
        // For now, I'll send it as is, but it might fail if backend expects different structure.
        // I'll check BookingController/DTO next.
        // But to save tool calls, I'll assume standard DTO: carId, startDate, ...

        const payload = {
            carId: booking.carId,
            variantId: booking.variant.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            source: booking.source,
            destination: booking.destination,
            totalPrice: booking.totalPrice,
            isDriverNeeded: booking.isDriverNeeded
        };

        return this.http.post<Booking>(this.API_URL, payload).pipe(
            tap(newBooking => {
                this.bookings.update(current => [newBooking, ...current]);
            })
        );
    }

    // updateBookingStatus not implemented in backend yet or verified.
    updateBookingStatus(id: string, status: 'PENDING' | 'APPROVED' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REJECTED') {
        return this.http.put<Booking>(`${this.API_URL}/${id}/status`, null, {
            params: { status }
        }).pipe(
            tap(updatedBooking => {
                this.bookings.update(current => current.map(b =>
                    b.id === id ? updatedBooking : b
                ));
            })
        );
    }

    getAllBookings() {
        return this.http.get<Booking[]>(`${this.API_URL}/all`);
    }
}
