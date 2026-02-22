import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CarService } from '../../shared/services/car';
import { Car, CarVariant } from '../../shared/models/car';

@Component({
    selector: 'app-car-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './car-edit.html',
    styleUrl: './car-edit.css'
})
export class CarEdit implements OnInit {
    private fb = inject(FormBuilder);
    private carService = inject(CarService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    carForm!: FormGroup;
    carId!: string;
    isLoading = true;
    errorMsg = '';
    successMsg = '';

    ngOnInit() {
        this.carId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.carId) {
            this.router.navigate(['/admin-dashboard']);
            return;
        }

        this.initForm();
        this.loadCarData();
    }

    initForm() {
        this.carForm = this.fb.group({
            brand: ['', Validators.required],
            name: ['', Validators.required],
            imageUrl: ['', Validators.required],
            description: ['', Validators.required],
            variants: this.fb.array([])
        });
    }

    get variants() {
        return this.carForm.get('variants') as FormArray;
    }

    addVariant() {
        this.variants.push(this.fb.group({
            name: ['', Validators.required],
            transmission: ['Automatic', Validators.required],
            fuelType: ['Petrol', Validators.required],
            seats: [5, [Validators.required, Validators.min(2)]],
            pricePerDay: [1000, [Validators.required, Validators.min(0)]],
            mileage: [''],
            features: [''],
            engineCapacity: ['']
        }));
    }

    removeVariant(index: number) {
        this.variants.removeAt(index);
    }

    loadCarData() {
        // Always fetch fresh from the API to ensure we have accurate data
        this.carService.fetchCarById(this.carId).subscribe({
            next: (car) => {
                this.populateForm(car);
                try { this.cdr.detectChanges(); } catch (e) { }
            },
            error: (err) => {
                console.error('Failed to load car details', err);
                this.errorMsg = 'Failed to load vehicle. Redirecting...';
                this.isLoading = false;
                try { this.cdr.detectChanges(); } catch (e) { }
                setTimeout(() => this.router.navigate(['/admin-dashboard']), 1500);
            }
        });
    }

    private populateForm(car: Car) {
        this.isLoading = false;

        // Patch basic values
        this.carForm.patchValue({
            brand: car.brand,
            name: car.name,
            imageUrl: car.imageUrl,
            description: car.description
        });

        // Clear default empty variant that was pushed by `addVariant` if any (or just init from scratch)
        this.variants.clear();

        // Add form array groups for variants
        if (car.variants && car.variants.length > 0) {
            car.variants.forEach((v: any) => {
                // Determine features string
                let featuresStr = '';
                if (v.features) {
                    featuresStr = Array.isArray(v.features) ? v.features.join(', ') : v.features;
                }

                this.variants.push(this.fb.group({
                    id: [v.id],
                    name: [v.name || '', Validators.required],
                    transmission: [v.transmission || 'Automatic', Validators.required],
                    fuelType: [v.fuelType || 'Petrol', Validators.required],
                    seats: [v.seats || 5, [Validators.required, Validators.min(2)]],
                    pricePerDay: [v.pricePerDay || 1000, [Validators.required, Validators.min(0)]],
                    mileage: [v.mileage || ''],
                    features: [featuresStr],
                    engineCapacity: [v.engineCapacity || '']
                }));
            });
        } else {
            // Fallback if no variants exist for some reason
            this.addVariant();
        }
    }

    isSaving = false;

    onSubmit() {
        if (this.carForm.valid) {
            this.isSaving = true;
            const formValue = this.carForm.value;

            // Process features string to array
            const processedVariants = formValue.variants.map((v: any) => ({
                ...v,
                features: v.features ? v.features.split(',').map((f: string) => f.trim()).filter((f: string) => f !== '') : []
            }));

            const payload: Partial<Car> = {
                name: formValue.name,
                brand: formValue.brand,
                imageUrl: formValue.imageUrl,
                description: formValue.description,
                variants: processedVariants
            };

            this.carService.updateCar(this.carId, payload).subscribe({
                next: () => {
                    this.isSaving = false;
                    this.successMsg = 'Vehicle updated successfully!';
                    setTimeout(() => this.router.navigate(['/admin-dashboard']), 1500);
                },
                error: (err) => {
                    this.isSaving = false;
                    this.errorMsg = 'Failed to update vehicle. Please try again.';
                    console.error(err);
                }
            });
        }
    }
}
