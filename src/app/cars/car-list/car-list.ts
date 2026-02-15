import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarService } from '../../shared/services/car';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList {
  private carService = inject(CarService);
  cars = this.carService.getCars()();

  getDefaultVariant(carId: string) {
    return this.carService.getDefaultVariant(carId);
  }
}
