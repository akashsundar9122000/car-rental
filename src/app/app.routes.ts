import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { AdminLoginComponent } from './auth/admin-login/admin-login';
import { AdminSignupComponent } from './auth/admin-signup/admin-signup';
import { CarList } from './cars/car-list/car-list';
import { CarDetail } from './cars/car-detail/car-detail';
import { LandingComponent } from './landing/landing';
import { authGuard } from './auth/auth-guard';

import { BookingComponent } from './cars/booking/booking';
import { ProfileComponent } from './profile/profile';
import { PaymentComponent } from './payment/payment';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { CarEdit } from './admin-dashboard/car-edit/car-edit';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'admin-login', component: AdminLoginComponent },
    { path: 'admin-signup', component: AdminSignupComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: 'admin-dashboard/edit/:id', component: CarEdit, canActivate: [authGuard] },
    { path: 'cars', component: CarList, canActivate: [authGuard] },
    { path: 'cars/:id', component: CarDetail, canActivate: [authGuard] },
    { path: 'cars/:id/book', component: BookingComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'payment/:id', component: PaymentComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
