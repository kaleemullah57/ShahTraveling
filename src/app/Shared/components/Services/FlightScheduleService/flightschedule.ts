import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { TimetableResponse } from '../../modal/FlightSchedules/flightschedule';

@Injectable({
  providedIn: 'root'
})
export class Flightschedule {

  // =====================================================
  // API URL
  // =====================================================

  private readonly apiUrl =
    'https://api.aviationstack.com/v1/timetable';

  // =====================================================
  // API KEY
  // =====================================================

  private readonly apiKey =
    '24c360a79ad32cb503a0d85deb06e70e';

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}

  // =====================================================
  // GET FLIGHT TIMETABLE
  // =====================================================

  getTimetable(
    iataCode: string,
    type: 'arrival' | 'departure'
  ): Observable<TimetableResponse> {

    const params = new HttpParams()
      .set('access_key', this.apiKey)
      .set('iataCode', iataCode)
      .set('type', type)
      .set('limit', '100');

    console.log('Flight API Request:', {
      iataCode,
      type,
      params: params.toString()
    });

    return this.http
      .get<TimetableResponse>(
        this.apiUrl,
        { params }
      )
      .pipe(

        // Stop waiting if API does not respond
        timeout(15000),

        // Handle API/network errors
        catchError((error) => {

          console.error(
            'Aviationstack API Error:',
            error
          );

          return throwError(() => error);
        })

      );
  }
}