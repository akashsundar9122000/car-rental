import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarService } from '../../shared/services/car';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList {
  private carService = inject(CarService);
  private toastService = inject(ToastService);
  cars = this.carService.getCars();
  searchTerm = signal('');
  activeCategory = signal('All');
  categories = ['All', 'SUV', 'Sedan', 'EV', 'Hatchback'];

  filteredCars = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const category = this.activeCategory();

    let cars = this.cars();

    // 1. Filter by category
    if (category !== 'All') {
      // In a real app we'd have a category field on the Car model. 
      // For now we'll do some basic inference from the description or assume some based on names if we don't have it.
      // E.g. Nexon EV is EV, Venue is SUV, Carens is SUV.
      cars = cars.filter(c => {
        const name = c.name.toLowerCase();
        if (category === 'EV') return name.includes('ev') || (this.getDefaultVariant(c.id)?.fuelType || '').toLowerCase() === 'electric';
        if (category === 'SUV') return name.includes('venue') || name.includes('carens') || name.includes('nexon') || c.description.toLowerCase().includes('suv');
        if (category === 'Sedan') return name.includes('city') || name.includes('verna') || c.description.toLowerCase().includes('sedan');
        if (category === 'Hatchback') return name.includes('i20') || name.includes('swift') || c.description.toLowerCase().includes('hatchback');
        return true;
      });
    }

    // 2. Filter by search term
    if (!term) return cars;

    return cars.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.brand.toLowerCase().includes(term) ||
      (this.getDefaultVariant(c.id)?.transmission || '').toLowerCase().includes(term)
    );
  });

  setCategory(category: string) {
    this.activeCategory.set(category);
  }

  isLoading = signal(false);

  ngOnInit() {
    // Only fetch if cars haven't been loaded yet
    if (this.cars().length === 0) {
      this.isLoading.set(true);
      this.carService.fetchCars().subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false)
      });
    }
  }

  getDefaultVariant(carId: string) {
    return this.carService.getDefaultVariant(carId);
  }

  isFavorite(carId: string): boolean {
    return this.carService.isFavorite(carId);
  }

  toggleFavorite(event: Event, carId: string): void {
    event.stopPropagation(); // prevent navigating to detail page
    this.carService.toggleFavorite(carId);

    const isFav = this.isFavorite(carId);
    if (isFav) {
      this.toastService.show('Car added to favorites', 'success');
    } else {
      this.toastService.show('Car removed from favorites', 'info');
    }
  }
}
