import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../Services/auth.service/auth.service';

export const authGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!authService.isLoggedIn()) {

    console.log('AUTH GUARD: NOT LOGGED IN');

    return router.createUrlTree(['/login']);
  }

  // ==========================================
  // GET USER INFORMATION
  // ==========================================

  const userType = authService.getUserType();
  const branchId = authService.getBranchId();

  console.log('AUTH GUARD USER TYPE:', userType);
  console.log('AUTH GUARD BRANCH ID:', branchId);

  // ==========================================
  // REQUESTED ROUTE
  // ==========================================

  const requestedRoute = route.routeConfig?.path;

  console.log(
    'AUTH GUARD REQUESTED ROUTE:',
    requestedRoute
  );

  // ==========================================
  // SUPER ADMIN DASHBOARD
  // ==========================================

  if (requestedRoute === 'SuperAdminDashboard') {

    /*
     * Branch Admin has BranchId > 0
     * Therefore Branch Admin cannot enter
     * Super Admin Dashboard.
     */

    if (branchId > 0) {

      console.log(
        'AUTH GUARD: Branch Admin blocked from Super Admin Dashboard'
      );

      return router.createUrlTree([
        '/AdminDashboard'
      ]);
    }

    // Super Admin
    return true;
  }

  // ==========================================
  // BRANCH ADMIN DASHBOARD
  // ==========================================

  if (requestedRoute === 'AdminDashboard') {

    /*
     * Branch Admin must have BranchId > 0
     */

    if (branchId > 0) {

      return true;
    }

    /*
     * Super Admin has BranchId = 0
     */

    console.log(
      'AUTH GUARD: Super Admin redirected to SuperAdminDashboard'
    );

    return router.createUrlTree([
      '/SuperAdminDashboard'
    ]);
  }

  // ==========================================
  // OTHER AUTHENTICATED ROUTES
  // ==========================================

  return true;
};