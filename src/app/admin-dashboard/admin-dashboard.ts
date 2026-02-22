import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CarService } from '../shared/services/car';
import { AuthService } from '../shared/services/auth';
import { BookingService } from '../shared/services/booking';
import { AdminService, SalesData } from '../shared/services/admin';
import { Car, CarVariant } from '../shared/models/car';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent {
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private adminService = inject(AdminService);

  activeTab: 'sales' | 'my-fleet' | 'add-car' | 'bookings' = 'sales';
  successMsg = '';
  errorMsg = '';
  myCars: Car[] = [];
  isLoadingCars = false;

  salesData: SalesData | null = null;
  isLoadingSales = false;

  brands = ['Tata', 'Mahindra', 'Hyundai', 'Maruti Suzuki', 'Toyota', 'Kia', 'Honda'];
  modelsByBrand: { [key: string]: string[] } = {
    'Tata': ['Nexon EV', 'Nexon', 'Safari', 'Harrier', 'Punch', 'Tiago', 'Altroz'],
    'Mahindra': ['XUV700', 'Scorpio-N', 'Thar', 'XUV 3XO'],
    'Hyundai': ['Creta', 'Venue', 'i20', 'Alcazar'],
    'Maruti Suzuki': ['Swift', 'Wagon R', 'Baleno', 'Brezza', 'Fronx'],
    'Toyota': ['Innova Crysta', 'Fortuner', 'Glanza', 'Hyryder'],
    'Kia': ['Seltos', 'Sonet', 'Carens'],
    'Honda': ['City', 'Amaze', 'Elevate']
  };
  availableModels: string[] = [];

  // Reliable car image URLs from CDNs
  carImageMap: { [key: string]: string } = {
    'Tata Nexon EV': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-ev-exterior-right-front-three-quarter-5.jpeg',
    'Tata Nexon': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter.jpeg',
    'Tata Safari': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/138895/safari-exterior-right-front-three-quarter.jpeg',
    'Tata Harrier': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139139/harrier-exterior-right-front-three-quarter.jpeg',
    'Tata Punch': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/punch-exterior-right-front-three-quarter.jpeg',
    'Tata Tiago': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/36783/tiago-exterior-right-front-three-quarter-69.jpeg',
    'Tata Altroz': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/138181/altroz-exterior-right-front-three-quarter.jpeg',
    'Mahindra XUV700': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter.jpeg',
    'Mahindra Scorpio-N': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/scorpio-n-exterior-right-front-three-quarter.jpeg',
    'Mahindra Thar': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter.jpeg',
    'Hyundai Creta': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter.jpeg',
    'Hyundai Venue': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/venue-exterior-right-front-three-quarter.jpeg',
    'Hyundai i20': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/150603/i20-exterior-right-front-three-quarter.jpeg',
    'Maruti Suzuki Swift': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg',
    'Maruti Suzuki Baleno': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159101/baleno-exterior-right-front-three-quarter.jpeg',
    'Maruti Suzuki Brezza': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106829/brezza-exterior-right-front-three-quarter.jpeg',
    'Maruti Suzuki Fronx': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/143409/fronx-exterior-right-front-three-quarter.jpeg',
    'Toyota Fortuner': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg',
    'Toyota Innova Crysta': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter.jpeg',
    'Kia Seltos': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/143461/seltos-exterior-right-front-three-quarter.jpeg',
    'Kia Sonet': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115549/sonet-exterior-right-front-three-quarter-2.jpeg',
    'Honda City': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter.jpeg',
    'Honda Elevate': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144387/elevate-exterior-right-front-three-quarter.jpeg',
  };

  carForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    imageUrl: ['', Validators.required],
    description: ['', Validators.required],
    variants: this.fb.array([this.createVariantGroup()])
  });

  get variants() {
    return this.carForm.get('variants') as FormArray;
  }

  createVariantGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      transmission: ['Automatic', Validators.required],
      fuelType: ['Electric', Validators.required],
      seats: [5, [Validators.required, Validators.min(2)]],
      pricePerDay: [1000, [Validators.required, Validators.min(0)]],
      mileage: [''],
      features: [''], // Will split by comma
      engineCapacity: ['']
    });
  }

  addVariant() {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number) {
    if (this.variants.length > 1) {
      this.variants.removeAt(index);
    }
  }

  isScraping = false;
  scrapeError = '';

  fetchFromCarwale(carName: string) {
    this.isScraping = true;
    this.scrapeError = '';
    this.cdr.detectChanges();

    this.carService.scrapeCarDetails(carName).subscribe({
      next: (scrapedResult) => {
        this.isScraping = false;
        if (scrapedResult && scrapedResult.variants && scrapedResult.variants.length > 0) {

          this.carForm.patchValue({
            imageUrl: scrapedResult.imageUrl || '',
            description: scrapedResult.description || ''
          }, { emitEvent: false });

          // Clear current variants
          this.variants.clear();

          // Add scraped variants
          scrapedResult.variants.forEach(v => {
            this.variants.push(this.fb.group({
              name: [v.name || '', Validators.required],
              transmission: [v.transmission || 'Automatic', Validators.required],
              fuelType: [v.fuelType || 'Petrol', Validators.required],
              seats: [v.seats || 5, [Validators.required, Validators.min(2)]],
              pricePerDay: [v.pricePerDay || 1000, [Validators.required, Validators.min(0)]],
              mileage: [v.mileage || ''],
              features: [v.features ? v.features.join(', ') : ''],
              engineCapacity: [v.engineCapacity || '']
            }));
          });
          this.successMsg = `Successfully auto-filled details for ${carName}!`;
          this.cdr.detectChanges();
        } else {
          this.scrapeError = 'No data found for this vehicle on Carwale. Please fill manually.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isScraping = false;
        this.scrapeError = 'Failed to fetch data automatically. Please enter manually.';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  bookings: any[] = [];
  isLoadingBookings = false;

  switchTab(tab: 'sales' | 'my-fleet' | 'add-car' | 'bookings') {
    this.activeTab = tab;
    this.successMsg = '';
    this.errorMsg = '';

    if (tab === 'bookings') {
      this.loadBookings();
    } else if (tab === 'my-fleet') {
      this.loadFleet();
    } else if (tab === 'sales') {
      this.loadSalesData();
    }
  }

  ngOnInit() {
    this.loadSalesData();

    this.carForm.get('brand')?.valueChanges.subscribe(brand => {
      this.availableModels = this.modelsByBrand[brand] || [];
      const currentName = this.carForm.get('name')?.value;
      if (!this.availableModels.includes(currentName)) {
        this.carForm.get('name')?.setValue('', { emitEvent: false });
      }
    });

    this.carForm.get('name')?.valueChanges.subscribe(modelName => {
      // Auto-populate image URL from known map
      const brand = this.carForm.get('brand')?.value;
      if (brand && modelName) {
        const key = `${brand} ${modelName}`;
        const imageUrl = this.carImageMap[key];
        if (imageUrl) {
          this.carForm.get('imageUrl')?.setValue(imageUrl, { emitEvent: false });
        }
      }
      // Only trigger auto-fetch if it's a known model selected from the list
      if (modelName && this.availableModels.includes(modelName)) {
        this.fetchFromCarwale(modelName);
      }
    });
  }

  loadFleet() {
    this.isLoadingCars = true;
    try {
      this.cdr.detectChanges();
    } catch (e) { }
    this.carService.getDealerCars().subscribe({
      next: (data) => {
        this.myCars = data;
        this.isLoadingCars = false;
        try { this.cdr.detectChanges(); } catch (e) { }
      },
      error: (err) => {
        console.error('Failed to load dealer cars', err);
        this.isLoadingCars = false;
        try { this.cdr.detectChanges(); } catch (e) { }
      }
    });
  }

  loadSalesData() {
    this.isLoadingSales = true;
    try { this.cdr.detectChanges(); } catch (e) { }
    this.adminService.getSalesData().subscribe({
      next: (data) => {
        this.salesData = data;
        this.isLoadingSales = false;
        try { this.cdr.detectChanges(); } catch (e) { }
      },
      error: (err) => {
        console.error('Failed to load sales data', err);
        this.isLoadingSales = false;
        try { this.cdr.detectChanges(); } catch (e) { }
      }
    });
  }

  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);

  loadBookings() {
    this.isLoadingBookings = true;
    this.cdr.detectChanges();
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoadingBookings = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.isLoadingBookings = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateBookingStatus(bookingId: string, status: 'PENDING' | 'APPROVED' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REJECTED') {
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: (updatedBooking: any) => {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
          this.cdr.detectChanges();
        }
        this.successMsg = `Booking status updated to ${status}.`;
      },
      error: (err: any) => {
        console.error('Failed to update status', err);
        this.errorMsg = 'Failed to update booking status.';
      }
    });
  }

  exportBookingsToCSV() {
    if (!this.bookings || this.bookings.length === 0) return;

    const headers = ['Ref ID', 'Customer Name', 'Customer Email', 'Vehicle Brand', 'Vehicle Model', 'Trim', 'Source', 'Destination', 'Start Date', 'End Date', 'Days', 'Total Price', 'Status'];
    const rows = this.bookings.map(b => [
      (b.id || '').substring(0, 8),
      b.user?.fullName || 'N/A',
      b.user?.email || 'N/A',
      b.variant?.car?.brand || 'N/A',
      b.variant?.car?.name || 'N/A',
      b.variant?.name || 'N/A',
      b.source || 'N/A',
      b.destination || 'N/A',
      b.startDate?.split('T')[0] || 'N/A',
      b.endDate?.split('T')[0] || 'N/A',
      this.calculateDays(b.startDate, b.endDate),
      b.totalPrice || 0,
      b.status || 'UNKNOWN'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')) // Quote cells to handle commas
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onAddCarSubmit() {
    if (this.carForm.valid) {
      const formValue = this.carForm.value;
      const newCar: any = {
        name: formValue.name,
        brand: formValue.brand,
        imageUrl: formValue.imageUrl,
        description: formValue.description,
        variants: formValue.variants.map((v: any) => ({
          ...v,
          features: v.features.split(',').map((f: string) => f.trim()).filter((f: string) => f)
        }))
      };

      this.carService.addCar(newCar).subscribe({
        next: (car: any) => {
          this.successMsg = 'Car added successfully!';
          this.carForm.reset();
          this.variants.clear();
          this.variants.push(this.createVariantGroup());
        },
        error: (err: any) => {
          this.errorMsg = 'Failed to add car.';
        }
      });
    } else {
      this.carForm.markAllAsTouched();
    }
  }

  // --- Delete Vehicle Modal ---
  showDeleteModal = false;
  carToDelete: Car | null = null;
  deletePassword = '';
  isDeleting = false;
  deleteError = '';

  openDeleteModal(car: Car) {
    this.carToDelete = car;
    this.deletePassword = '';
    this.deleteError = '';
    this.isDeleting = false;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.carToDelete = null;
    this.deletePassword = '';
    this.deleteError = '';
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (!this.carToDelete || !this.deletePassword) {
      this.deleteError = 'Please enter your password.';
      this.cdr.detectChanges();
      return;
    }
    this.isDeleting = true;
    this.deleteError = '';
    this.cdr.detectChanges();

    this.carService.deleteCar(this.carToDelete.id, this.deletePassword).subscribe({
      next: () => {
        this.myCars = this.myCars.filter(c => c.id !== this.carToDelete?.id);
        this.showDeleteModal = false;
        this.carToDelete = null;
        this.deletePassword = '';
        this.isDeleting = false;
        this.successMsg = 'Vehicle deleted successfully.';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isDeleting = false;
        const msg = err?.error;
        if (typeof msg === 'string') {
          this.deleteError = msg;
        } else {
          this.deleteError = 'Failed to delete vehicle. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // --- Booking helpers ---
  calculateDays(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  }

  // --- Delete Admin Account Modal ---
  showDeleteAccountModal2 = false;
  deleteAccountPassword2 = '';
  isDeletingAccount2 = false;
  deleteAccountError2 = '';

  openDeleteAccountModal2() {
    this.deleteAccountPassword2 = '';
    this.deleteAccountError2 = '';
    this.isDeletingAccount2 = false;
    this.showDeleteAccountModal2 = true;
    this.cdr.detectChanges();
  }

  cancelDeleteAccount2() {
    this.showDeleteAccountModal2 = false;
    this.deleteAccountPassword2 = '';
    this.deleteAccountError2 = '';
    this.cdr.detectChanges();
  }

  confirmDeleteAccount2() {
    if (!this.deleteAccountPassword2) {
      this.deleteAccountError2 = 'Please enter your password.';
      this.cdr.detectChanges();
      return;
    }
    this.isDeletingAccount2 = true;
    this.deleteAccountError2 = '';
    this.cdr.detectChanges();

    this.authService.deleteAdminAccount(this.deleteAccountPassword2).subscribe({
      next: () => {
        this.showDeleteAccountModal2 = false;
        this.router.navigate(['/admin-login']);
      },
      error: (err: any) => {
        this.isDeletingAccount2 = false;
        const msg = err?.error;
        this.deleteAccountError2 = typeof msg === 'string' ? msg : 'Failed to delete account. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
