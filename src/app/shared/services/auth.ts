import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  fullName: string;
  mobileNumber?: string;
  role?: string;
  token?: string; // Basic Auth token (base64 email:password)
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly USER_KEY = 'car_rental_user';

  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() { }

  login(email: string, password: string) {
    return this.http.post<User>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(user => {
        const token = btoa(`${email}:${password}`);
        const userWithToken = { ...user, token };
        this.saveUserToStorage(userWithToken);
      })
    );
  }

  adminLogin(email: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}/admin/auth/login`, { email, password }).pipe(
      tap(user => {
        const token = btoa(`${email}:${password}`);
        // Ensure role is explicitly ADMIN in storage
        const userWithToken = { ...user, token, role: 'ADMIN' };
        this.saveUserToStorage(userWithToken);
      })
    );
  }

  signup(user: any) {
    return this.http.post<User>(`${this.API_URL}/signup`, {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber
    }).pipe(
      tap(savedUser => {
        if (user.password) {
          const token = btoa(`${user.email}:${user.password}`);
          const userWithToken = { ...savedUser, token };
          this.saveUserToStorage(userWithToken);
        } else {
          this.saveUserToStorage(savedUser);
        }
      })
    );
  }

  adminSignup(user: any) {
    return this.http.post<User>(`${environment.apiUrl}/admin/auth/signup`, {
      email: user.email,
      password: user.password,
      fullName: user.fullName
    }).pipe(
      tap(savedUser => {
        if (user.password) {
          const token = btoa(`${user.email}:${user.password}`);
          const userWithToken = { ...savedUser, token, role: 'ADMIN' };
          this.saveUserToStorage(userWithToken);
        } else {
          this.saveUserToStorage({ ...savedUser, role: 'ADMIN' });
        }
      })
    );
  }

  getAuthHeaders() {
    const user = this.currentUser();
    if (user && user.token) {
      return { Authorization: `Basic ${user.token}` };
    }
    return {};
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  deleteAccount(password: string): Observable<void> {
    return this.http.request<void>('DELETE', `${this.API_URL}/account`, {
      body: { password }
    }).pipe(
      tap(() => this.logout())
    );
  }

  deleteAdminAccount(password: string): Observable<void> {
    return this.http.request<void>('DELETE', `${environment.apiUrl}/admin/auth/account`, {
      body: { password }
    }).pipe(
      tap(() => this.logout())
    );
  }
}
