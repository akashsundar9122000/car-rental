import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  mobileNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'car_rental_user';
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() { }

  login(email: string, password: string): boolean {
    // In a real app, we would verify password here. 
    // For now, we simulate a successful login if email is provided.
    // We'll create a mock user if one doesn't exist in local storage for this email, 
    // or just retrieve the last signed up user if emails match (simple mock logic).

    let user = this.getUserFromStorage();

    // Simple mock: if no user stored, or stored user has different email, create a temp one
    if (!user || user.email !== email) {
      user = {
        id: 'mock-id-' + Math.floor(Math.random() * 1000),
        username: email.split('@')[0],
        email: email,
        fullName: 'Driver ' + email.split('@')[0],
        mobileNumber: '0000000000'
      };
    }

    this.saveUserToStorage(user);
    return true;
  }

  signup(user: User): boolean {
    this.saveUserToStorage(user);
    return true;
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
}
