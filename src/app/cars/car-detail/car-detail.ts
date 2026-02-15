import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CarService } from '../../shared/services/car';
import { Car, CarVariant } from '../../shared/models/car';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.css',
})
export class CarDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carService = inject(CarService);
  private location = inject(Location);

  car: Car | undefined;
  selectedVariant = signal<CarVariant | undefined>(undefined);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.car = this.carService.getCarById(id);
      if (this.car) {
        // Set default variant
        const defaultVariant = this.carService.getDefaultVariant(id);
        this.selectedVariant.set(defaultVariant);
      }
    }

    if (!this.car) {
      // Redirect if car not found
      this.router.navigate(['/cars']);
    }
  }

  selectVariant(variantId: string) {
    if (this.car) {
      const variant = this.carService.getVariantById(this.car.id, variantId);
      this.selectedVariant.set(variant);
    }
  }

  goBack() {
    this.location.back();
  }

  rentCar() {
    if (this.car && this.selectedVariant()) {
      this.router.navigate(['/cars', this.car.id, 'book'], {
        queryParams: { variantId: this.selectedVariant()?.id }
      });
    }
  }
}
