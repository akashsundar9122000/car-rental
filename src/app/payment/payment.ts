import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../shared/services/booking';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './payment.html',
})
export class PaymentComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private bookingService = inject(BookingService);
    private fb = inject(FormBuilder);

    bookingId: string | null = null;
    selectedMethod: string = '';
    processing: boolean = false;
    success: boolean = false;
    showForm: boolean = true;

    cardForm: FormGroup;
    upiForm: FormGroup;
    netBankingForm: FormGroup;

    constructor() {
        this.cardForm = this.fb.group({
            cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
            cardName: ['', Validators.required],
            expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$')]],
            cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
        });

        this.upiForm = this.fb.group({
            upiId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$')]]
        });

        this.netBankingForm = this.fb.group({
            bankName: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.bookingId = this.route.snapshot.paramMap.get('id');

        if (!this.bookingId) {
            this.router.navigate(['/profile']);
        }
    }

    goBack() {
        this.location.back();
    }

    selectMethod(method: string) {
        this.selectedMethod = method;
    }

    processPayment() {
        let isValid = false;

        if (this.selectedMethod === 'card') {
            isValid = this.cardForm.valid;
        } else if (this.selectedMethod === 'upi') {
            isValid = this.upiForm.valid;
        } else if (this.selectedMethod === 'netbanking') {
            isValid = this.netBankingForm.valid;
        } else if (this.selectedMethod === 'googlepay' || this.selectedMethod === 'phonepe') {
            isValid = true;
        }

        if (isValid && this.bookingId) {
            this.showForm = false;
            this.processing = true;

            setTimeout(() => {
                this.completePayment();
            }, 3000);
        } else {
            if (this.selectedMethod === 'card') {
                this.cardForm.markAllAsTouched();
            } else if (this.selectedMethod === 'upi') {
                this.upiForm.markAllAsTouched();
            } else if (this.selectedMethod === 'netbanking') {
                this.netBankingForm.markAllAsTouched();
            }
        }
    }

    completePayment() {
        if (this.bookingId) {
            this.processing = false;
            this.success = true;
            this.bookingService.updateBookingStatus(this.bookingId, 'PAID').subscribe({
                next: () => {
                    setTimeout(() => {
                        this.router.navigate(['/profile']);
                    }, 3000);
                },
                error: (err) => {
                    console.error('Failed to update payment status', err);
                    // Navigate anyway or show error
                    setTimeout(() => {
                        this.router.navigate(['/profile']);
                    }, 3000);
                }
            });
        }
    }
}
