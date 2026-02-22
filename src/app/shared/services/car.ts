import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Car, CarVariant, CarScrapeResult } from '../models/car';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/cars`;

  private cars = signal<Car[]>([]);
  private carsLoaded = false;
  private favoriteCarIds = signal<Set<string>>(new Set(this.getFavoritesFromStorage()));

  constructor() {
    this.loadCars();
  }

  // --- Favorites Feature ---
  private readonly FAVORITES_KEY = 'car_rental_favorites';

  private getFavoritesFromStorage(): string[] {
    const stored = localStorage.getItem(this.FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getFavorites() {
    return this.favoriteCarIds.asReadonly();
  }

  isFavorite(carId: string): boolean {
    return this.favoriteCarIds().has(carId);
  }

  toggleFavorite(carId: string): void {
    this.favoriteCarIds.update(favorites => {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  }
  // -------------------------

  private loadCars() {
    this.fetchCars().subscribe();
  }

  fetchCars(forceRefresh = false) {
    if (this.carsLoaded && !forceRefresh) {
      return of(this.cars());
    }
    return this.http.get<Car[]>(this.API_URL).pipe(
      tap(data => {
        this.cars.set(data);
        this.carsLoaded = true;
      }),
      tap({ error: (err) => console.error('Failed to load cars', err) })
    );
  }

  getDealerCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.API_URL}/dealer`);
  }

  getCars() {
    return this.cars.asReadonly();
  }

  getCarById(id: string): Car | undefined {
    return this.cars().find(c => c.id === id);
  }

  fetchCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.API_URL}/${id}`);
  }

  getVariantById(carId: string, variantId: string): CarVariant | undefined {
    const car = this.getCarById(carId);
    return car?.variants.find(v => v.id === variantId);
  }

  getDefaultVariant(carId: string): CarVariant | undefined {
    const car = this.getCarById(carId);
    if (!car || !car.variants || car.variants.length === 0) return undefined;

    // Try to find the exact default variant
    const defaultVar = car.variants.find(v => v.id === car.defaultVariantId);

    // Fall back to the first available variant
    return defaultVar || car.variants[0];
  }

  addCar(car: Partial<Car>) {
    return this.http.post<Car>(this.API_URL, car).pipe(
      tap(newCar => {
        this.cars.update(currentCars => [newCar, ...currentCars]);
      })
    );
  }

  updateCar(id: string, car: Partial<Car>) {
    return this.http.put<Car>(`${this.API_URL}/${id}`, car).pipe(
      tap(updatedCar => {
        this.cars.update(currentCars => currentCars.map(c => c.id === id ? updatedCar : c));
      })
    );
  }

  scrapeCarDetails(carName: string): Observable<CarScrapeResult> {
    return this.http.post<CarScrapeResult>(`${this.API_URL}/scrape`, { carName });
  }

  deleteCar(id: string, password: string): Observable<void> {
    return this.http.request<void>('DELETE', `${this.API_URL}/${id}`, {
      body: { password }
    }).pipe(
      tap(() => {
        this.cars.update(currentCars => currentCars.filter(c => c.id !== id));
      })
    );
  }
}
