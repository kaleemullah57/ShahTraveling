import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../Services/Notification Services/notification-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const notification = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      let message = 'Something went wrong.';

      if (error.error?.message) {
        message = error.error.message;
      }
      else if (error.message) {
        message = error.message;
      }

      switch (error.status) {

        case 400:
          notification.error(message);
          break;

        case 401:

          console.log(
            'AUTH: Token expired or unauthorized. Redirecting to home.'
          );

          // Remove expired token
          localStorage.removeItem('token');

          // Redirect directly to home
          router.navigate(['/']);

          break;

        case 403:
          notification.error(
            message || 'You do not have permission to perform this action.'
          );
          break;

        case 404:
          notification.error(
            message || 'Requested resource was not found.'
          );
          break;

        case 409:
          notification.warning(message);
          break;

        case 500:
          notification.error(
            'Internal server error. Please try again later.'
          );
          break;

        default:
          notification.error(message);
          break;
      }

      // Keep error flowing to the component
      return throwError(() => error);
    })

  );
};