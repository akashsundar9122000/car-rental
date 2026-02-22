import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CarService } from '../../shared/services/car';
import { AuthService } from '../../shared/services/auth';
import { Car, CarVariant } from '../../shared/models/car';
import { ToastService } from '../../shared/services/toast';

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
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  car: Car | undefined;
  selectedVariant = signal<CarVariant | undefined>(undefined);
  availableDealers: Car[] = [];

  rentDurationDays = signal<number>(1);

  totalPrice = computed(() => {
    const variant = this.selectedVariant();
    const days = this.rentDurationDays();
    if (!variant) return 0;
    return variant.pricePerDay * days;
  });

  get isAdmin(): boolean {
    return this.authService.currentUser()?.role === 'ADMIN';
  }

  isFavorite = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCarDetails(id);
      } else {
        this.router.navigate(['/cars']);
      }
    });
  }

  private loadCarDetails(id: string) {
    // Try from local service state first
    this.car = this.carService.getCarById(id);

    if (this.car) {
      this.initCarData(id);
    } else {
      // Fetch from API if hard refresh
      this.carService.fetchCarById(id).subscribe({
        next: (carInfo: Car) => {
          this.car = carInfo;
          this.initCarData(id);
        },
        error: () => this.router.navigate(['/cars']) // Redirect if not found on server
      });
    }
  }

  private initCarData(id: string) {
    if (!this.car) return;
    this.availableDealers = this.carService.getCars()().filter(
      (c: Car) => c.name === this.car?.name && c.brand === this.car?.brand
    );

    let defaultVariant = undefined;
    if (this.car.variants && this.car.variants.length > 0) {
      defaultVariant = this.car.variants.find((v: CarVariant) => v.id === this.car?.defaultVariantId);
      if (!defaultVariant) {
        defaultVariant = this.car.variants[0];
      }
    }
    this.selectedVariant.set(defaultVariant);
    this.isFavorite.set(this.carService.isFavorite(id));
  }

  selectDealer(carId: string) {
    this.router.navigate(['/cars', carId]);
  }

  selectVariant(variantId: string) {
    if (this.car && this.car.variants) {
      const variant = this.car.variants.find((v: CarVariant) => v.id === variantId);
      if (variant) {
        this.selectedVariant.set(variant);
      }
    }
  }

  incrementDuration() {
    this.rentDurationDays.update(d => Math.min(d + 1, 30));
  }

  decrementDuration() {
    this.rentDurationDays.update(d => Math.max(d - 1, 1));
  }

  goBack() {
    this.location.back();
  }

  toggleFavorite() {
    if (this.car) {
      this.carService.toggleFavorite(this.car.id);
      this.isFavorite.set(this.carService.isFavorite(this.car.id));

      if (this.isFavorite()) {
        this.toastService.show('Added to favorites', 'success');
      } else {
        this.toastService.show('Removed from favorites', 'info');
      }
    }
  }

  rentCar() {
    if (this.car && this.selectedVariant()) {
      this.router.navigate(['/cars', this.car.id, 'book'], {
        queryParams: { variantId: this.selectedVariant()?.id }
      });
    }
  }

  editCar() {
    if (this.car) {
      this.router.navigate(['/admin-dashboard/edit', this.car.id]);
    }
  }
}
