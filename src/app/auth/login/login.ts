import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMsg = '';
  isLoading = false;
  showPassword = false;

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (email && password) {
        this.isLoading = true;
        this.errorMsg = '';

        this.authService.login(email, password).subscribe({
          next: (user) => {
            this.toastService.show(`Welcome back, ${user.fullName}!`, 'success');
            if (user.role === 'ADMIN') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/cars']);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMsg = 'Login failed. Please check credentials.';
            this.cdr.detectChanges();
          }
        });
      }
    }
  }
}
