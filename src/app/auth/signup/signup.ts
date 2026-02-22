import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../shared/services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signupForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
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
      const user = {
        fullName: formValue.fullName!,
        email: formValue.email!,
        mobileNumber: formValue.mobileNumber!,
        password: formValue.password!
      };

      this.authService.signup(user).subscribe({
        next: () => {
          // Immediately redirect to login, or log them in automatically
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 409) {
            this.errorMsg = 'Email already in use.';
          } else {
            this.errorMsg = 'Signup failed. Please try again.';
          }
        }
      });
    }
  }
}
