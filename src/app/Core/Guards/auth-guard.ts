
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../Services/auth.service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!authService.isLoggedIn()) {

    console.log('AUTH GUARD: NOT LOGGED IN');
    console.log('AUTH GUARD RETURN URL:', state.url);

    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url
      }
    });
  }

  const userType = authService.getUserType();

  console.log('AUTH GUARD USER TYPE:', userType);
  console.log('AUTH GUARD URL:', state.url);


  // ==========================================
  // SUPER ADMIN DASHBOARD
  // ==========================================

  if (state.url.startsWith('/SuperAdminDashboard')) {

    if (userType === 1) {
      return true;
    }

    if (userType === 2) {
      return router.createUrlTree(['/AdminDashboard']);
    }

    if (userType === 3) {
      return router.createUrlTree(['/CustomerDashboard']);
    }

    return router.createUrlTree(['/']);
  }


  // ==========================================
  // BRANCH ADMIN DASHBOARD
  // ==========================================

  if (state.url.startsWith('/AdminDashboard')) {

    if (userType === 2) {
      return true;
    }

    if (userType === 1) {
      return router.createUrlTree(['/SuperAdminDashboard']);
    }

    if (userType === 3) {
      return router.createUrlTree(['/CustomerDashboard']);
    }

    return router.createUrlTree(['/']);
  }


  // ==========================================
  // CUSTOMER DASHBOARD
  // ==========================================

  if (state.url.startsWith('/CustomerDashboard')) {

    if (userType === 3) {
      return true;
    }

    if (userType === 1) {
      return router.createUrlTree(['/SuperAdminDashboard']);
    }

    if (userType === 2) {
      return router.createUrlTree(['/AdminDashboard']);
    }

    return router.createUrlTree(['/']);
  }


  return true;
};

