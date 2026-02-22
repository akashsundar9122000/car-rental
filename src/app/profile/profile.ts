import { Component, inject, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../shared/services/booking';
import { AuthService } from '../shared/services/auth';
import { AdminService, SalesData } from '../shared/services/admin';
import { signal } from '@angular/core';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './profile.html',
})
export class ProfileComponent {
    bookingService = inject(BookingService);
    authService = inject(AuthService);
    adminService = inject(AdminService);
    location = inject(Location);
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);

    bookings = this.bookingService.getBookings();
    salesData = signal<SalesData | null>(null);
    isLoadingAdminData = false;
    errorMessage = signal<string | null>(null);


    // Dashboard Metrics
    totalMissions = computed(() => this.bookings().length);
    activeMissions = computed(() => this.bookings().filter(b => b.status === 'PENDING' || b.status === 'PAID').length);
    totalSpent = computed(() => this.bookings()
        .filter(b => b.status === 'COMPLETED' || b.status === 'PAID')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    );

    ngOnInit() {
        const user = this.authService.currentUser();
        console.log('ProfileComponent: Current User:', user);

        if (!user) {
            this.errorMessage.set('User session not found. Please log in again.');
            return;
        }

        if (user?.role === 'ADMIN') {
            this.isLoadingAdminData = true;
            this.errorMessage.set(null);
            this.adminService.getSalesData().subscribe({
                next: (data) => {
                    console.log('ProfileComponent: Sales Data loaded:', data);
                    this.salesData.set(data);
                    this.isLoadingAdminData = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Failed to fetch admin stats:', err);
                    this.errorMessage.set('Failed to load dealership data. Please check your connection.');
                    this.isLoadingAdminData = false;
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.errorMessage.set(null);
            this.bookingService.fetchUserBookings().subscribe({
                next: (data) => console.log('ProfileComponent: Bookings loaded:', data),
                error: (err) => {
                    console.error('Failed to fetch bookings:', err);
                    this.errorMessage.set('Failed to load booking history. Please try again.');
                }
            });
        }
    }


    goBack() {
        this.location.back();
    }

    // --- Delete Account Modal ---
    showDeleteAccountModal = false;
    deleteAccountPassword = '';
    isDeletingAccount = false;
    deleteAccountError = '';

    openDeleteAccountModal() {
        this.deleteAccountPassword = '';
        this.deleteAccountError = '';
        this.isDeletingAccount = false;
        this.showDeleteAccountModal = true;
        this.cdr.detectChanges();
    }

    cancelDeleteAccount() {
        this.showDeleteAccountModal = false;
        this.deleteAccountPassword = '';
        this.deleteAccountError = '';
        this.cdr.detectChanges();
    }

    confirmDeleteAccount() {
        if (!this.deleteAccountPassword) {
            this.deleteAccountError = 'Please enter your password.';
            this.cdr.detectChanges();
            return;
        }
        this.isDeletingAccount = true;
        this.deleteAccountError = '';
        this.cdr.detectChanges();

        const user = this.authService.currentUser();
        const deleteObservable = user?.role === 'ADMIN'
            ? this.authService.deleteAdminAccount(this.deleteAccountPassword)
            : this.authService.deleteAccount(this.deleteAccountPassword);

        deleteObservable.subscribe({
            next: () => {
                this.showDeleteAccountModal = false;
                this.router.navigate(['/login']);
            },
            error: (err: any) => {
                this.isDeletingAccount = false;
                const msg = err?.error;
                this.deleteAccountError = typeof msg === 'string' ? msg : 'Failed to delete account. Please try again.';
                this.cdr.detectChanges();
            }
        });
    }
}
