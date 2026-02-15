import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../shared/services/booking';
import { AuthService } from '../shared/services/auth';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './profile.html',
})
export class ProfileComponent {
    bookingService = inject(BookingService);
    authService = inject(AuthService);
    location = inject(Location);

    bookings = this.bookingService.getBookings();

    goBack() {
        this.location.back();
    }
}
