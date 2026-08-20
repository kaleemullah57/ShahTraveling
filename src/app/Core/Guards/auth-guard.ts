import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service/auth.service';

// export const authGuard: CanActivateFn = () => {

//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isLoggedIn()) {
//     return true;
//   }

//   return router.createUrlTree(['/login']);
// };


export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  console.log('AUTH GUARD TOKEN:', token);
  console.log('IS LOGGED IN:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    console.log('AUTH GUARD: ALLOWED');
    return true;
  }

  console.log('AUTH GUARD: BLOCKED');

  return router.createUrlTree(['/login']);
};