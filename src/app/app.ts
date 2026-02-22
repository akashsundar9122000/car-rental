import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth';
import { ThemeService } from './shared/services/theme.service';
import { ToastService } from './shared/services/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  private router = inject(Router);
  mobileMenuOpen = false;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser();
    return user?.role === 'ADMIN';
  }
}
