import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../Services/Notification Services/notification-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const notification = inject(NotificationService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      console.error('HTTP Error:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: error.error?.message,
        error
      });

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
          notification.error(
            message || 'Unauthorized request.'
          );
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