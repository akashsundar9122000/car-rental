import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { LandingComponent } from './landing/landing';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'admin-login', loadComponent: () => import('./auth/admin-login/admin-login').then(m => m.AdminLoginComponent) },
    { path: 'admin-signup', loadComponent: () => import('./auth/admin-signup/admin-signup').then(m => m.AdminSignupComponent) },
    { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent), canActivate: [authGuard] },
    { path: 'admin-dashboard/edit/:id', loadComponent: () => import('./admin-dashboard/car-edit/car-edit').then(m => m.CarEdit), canActivate: [authGuard] },
    { path: 'cars', loadComponent: () => import('./cars/car-list/car-list').then(m => m.CarList), canActivate: [authGuard] },
    { path: 'cars/:id', loadComponent: () => import('./cars/car-detail/car-detail').then(m => m.CarDetail), canActivate: [authGuard] },
    { path: 'cars/:id/book', loadComponent: () => import('./cars/booking/booking').then(m => m.BookingComponent), canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent), canActivate: [authGuard] },
    { path: 'payment/:id', loadComponent: () => import('./payment/payment').then(m => m.PaymentComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
