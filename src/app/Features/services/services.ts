import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Flightschedule } from '../../Shared/components/Services/FlightScheduleService/flightschedule';
import { TimetableFlight } from '../../Shared/components/modal/FlightSchedules/flightschedule';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services {

  // =====================================================
  // SEARCH
  // =====================================================

  iataCode: string = 'ISB';

  type: 'arrival' | 'departure' = 'departure';


  // =====================================================
  // FLIGHTS
  // =====================================================

  // All flights received from API
  allFlights: TimetableFlight[] = [];

  // Flights currently displayed in HTML
  flights: TimetableFlight[] = [];

  pageSize: number = 4;

  // Current number of displayed flights
  displayedCount: number = 0;

  loading: boolean = false;

  error: string = '';


  constructor(
    private timetableService: Flightschedule
  ) {}


  
  search(): void {

    const airport = this.iataCode.trim().toUpperCase();

    // Validate airport
    if (!airport || airport.length !== 3) {
      this.error = 'Please enter a valid 3-letter airport IATA code.';
      this.flights = [];
      return;
    }

    this.loading = true;
    this.error = '';
    this.flights = [];

    console.log('Searching:', {
      airport,
      type: this.type
    });

    this.timetableService
      .getTimetable(airport, this.type)
      .pipe(
        finalize(() => {
          console.log('Request finished');
          this.loading = false;
        })
      )
      .subscribe({

        next: (response) => {

          console.log('Timetable API Response:', response);

          this.flights = response?.data ?? [];

          if (this.flights.length === 0) {
            this.error = `No ${this.type} flights found for ${airport}.`;
          }
        },

        error: (error) => {

          console.error('Timetable API Error:', error);

          this.flights = [];

          this.error =
            error?.error?.error?.message ||
            'Unable to load flight timetable.';
        }

      });
  }

  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
}