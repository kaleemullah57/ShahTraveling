import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../Core/Services/auth.service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', [
      Validators.required
    ]]
  });

  login(): void {

  console.log('🔥 LOGIN METHOD CALLED');

  if (this.loading) {
    console.log('Already loading - ignoring second call');
    return;
  }

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const request = {
    email: this.loginForm.value.email!,
    password: this.loginForm.value.password!
  };

  console.log('📤 LOGIN API REQUEST:', request);

  this.authService.login(request).subscribe({

    next: (response) => {

      console.log('📥 LOGIN API RESPONSE:', response);

      this.loading = false;

      if (response.statusCode === 200) {

        this.authService.saveLogin(response.data);

        this.redirectUser(response.data.userTypeId);
      }
    },

    error: (error) => {

      console.error('❌ LOGIN API ERROR:', error);

      this.loading = false;

      this.errorMessage =
        error?.error?.message ||
        'Invalid email or password.';
    }
  });
}

  private redirectUser(userTypeId: number): void {

    switch (userTypeId) {

      // Super Admin
      case 1:
        this.router.navigateByUrl('/SuperAdminDashboard');
        break;

      // Admin
      case 2:
        this.router.navigateByUrl('/AdminDashboard');
        break;

      // Normal User
      case 3:
        this.router.navigateByUrl('/UserDashboard');
        break;

      default:

        this.errorMessage = 'Invalid user type.';

        this.authService.logout();

        this.router.navigateByUrl('/login');

        break;
    }

  }
}