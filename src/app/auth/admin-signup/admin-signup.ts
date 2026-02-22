import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../shared/services/auth';

@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-signup.html',
  styleUrl: './admin-signup.css'
})
export class AdminSignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signupForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    adminPasscode: ['', Validators.required] // A fake secret code just for aesthetics
  }, { validators: this.passwordMatchValidator });

  errorMsg = '';
  showPassword = false;
  showConfirmPassword = false;

  passwordMatchValidator(g: any) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;

      // Fake security check for aesthetics - only allow if code is 'ADMIN123'
      if (formValue.adminPasscode !== 'ADMIN123') {
        this.errorMsg = 'INVALID SECURITY CLEARANCE CODE';
        return;
      }

      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formValue.email!,
        fullName: formValue.fullName!,
        email: formValue.email!,
        password: formValue.password!
      };

      this.authService.adminSignup(user).subscribe({
        next: () => {
          this.router.navigate(['/admin-login']);
        },
        error: (err) => {
          if (err.status === 409) {
            this.errorMsg = 'Admin Email already registered.';
          } else {
            this.errorMsg = 'System Registration failed.';
          }
        }
      });
    }
  }
}
