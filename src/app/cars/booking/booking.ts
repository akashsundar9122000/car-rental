import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CarService } from '../../shared/services/car';
import { BookingService } from '../../shared/services/booking';
import { Car, CarVariant } from '../../shared/models/car';

@Component({
    selector: 'app-booking',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './booking.html',
})
export class BookingComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private carService = inject(CarService);
    private bookingService = inject(BookingService);
    private fb = inject(FormBuilder);
    private location = inject(Location);
    private sanitizer = inject(DomSanitizer);

    car: Car | undefined;
    selectedVariant: CarVariant | undefined;
    bookingForm: FormGroup;
    mapUrl: SafeResourceUrl | undefined;
    totalPrice: number = 0;
    carCost: number = 0;
    driverCost: number = 0;
    diffDays: number = 0;
    isBooked: boolean = false;

    constructor() {
        this.bookingForm = this.fb.group({
            source: ['', Validators.required],
            destination: ['', Validators.required],
            startDate: ['', [Validators.required, this.futureDateValidator()]],
            endDate: ['', Validators.required],
            isDriverNeeded: [false]
        }, { validators: this.dateRangeValidator });

        // Update map when source or destination changes
        this.bookingForm.valueChanges.subscribe(val => {
            this.updateMapUrl(val.source, val.destination);
            this.calculateTotalPrice(val.startDate, val.endDate, val.isDriverNeeded);
        });
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const variantId = this.route.snapshot.queryParamMap.get('variantId');

        if (id) {
            this.car = this.carService.getCarById(id);
            if (this.car) {
                // Get variant from query param or use default
                if (variantId) {
                    this.selectedVariant = this.carService.getVariantById(id, variantId);
                }
                if (!this.selectedVariant) {
                    this.selectedVariant = this.carService.getDefaultVariant(id);
                }
            }
        }

        if (!this.car || !this.selectedVariant) {
            this.router.navigate(['/cars']);
        }
    }

    goBack() {
        this.location.back();
    }

    updateMapUrl(source: string, destination: string) {
        if (source && destination) {
            const cleanSource = encodeURIComponent(source);
            const cleanDest = encodeURIComponent(destination);
            // Using embed for directions
            const url = `https://www.google.com/maps?saddr=${cleanSource}&daddr=${cleanDest}&output=embed`;
            this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
    }

    calculateTotalPrice(start: string, end: string, isDriverNeeded: boolean = false) {
        if (start && end && this.selectedVariant) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (endDate > startDate) {
                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                // Calculate difference in days, rounding up for any partial day
                this.diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

                this.carCost = this.diffDays * this.selectedVariant.pricePerDay;
                this.driverCost = isDriverNeeded ? (this.diffDays * 500) : 0;
                this.totalPrice = this.carCost + this.driverCost;
            } else {
                this.totalPrice = 0;
                this.carCost = 0;
                this.driverCost = 0;
                this.diffDays = 0;
            }
        }
    }

    futureDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputDate = new Date(control.value);
            return inputDate < today ? { pastDate: true } : null;
        };
    }

    dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        const start = group.get('startDate')?.value;
        const end = group.get('endDate')?.value;
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            return endDate <= startDate ? { invalidRange: true } : null;
        }
        return null;
    };

    onSubmit() {
        if (this.bookingForm.valid && this.car) {
            console.log('Booking Data:', {
                carId: this.car?.id,
                ...this.bookingForm.value
            });

            this.bookingService.addBooking({
                car: this.car,
                startDate: this.bookingForm.value.startDate,
                endDate: this.bookingForm.value.endDate,
                source: this.bookingForm.value.source,
                destination: this.bookingForm.value.destination,
                totalPrice: this.totalPrice,
                isDriverNeeded: this.bookingForm.value.isDriverNeeded
            });

            this.isBooked = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.bookingForm.markAllAsTouched();
        }
    }
}
