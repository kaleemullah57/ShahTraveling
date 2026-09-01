import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import { DestinationsService } from '../../Admin Services/Destination Services/destinations-service';

import {
  Destination
} from '../../Admin Models/Destinations/destination-model';


@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './destinations.html',
  styleUrl: './destinations.scss'
})
export class DestinationsComponent implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private readonly destinationsService = inject(
    DestinationsService
  );

  private readonly cdr = inject(
    ChangeDetectorRef
  );


  // =====================================================
  // DATA
  // =====================================================

  destinations: Destination[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  errorMessage = '';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    console.log(
      'Destinations Component Initialized'
    );

    this.getDestinations();

  }


  // =====================================================
  // GET DESTINATIONS
  // =====================================================

  getDestinations(): void {

    this.loading = true;

    this.errorMessage = '';

    // Make loading state visible immediately
    this.cdr.detectChanges();


    this.destinationsService
      .getDestinations()
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (response) => {

          console.log(
            'FULL RESPONSE:',
            response
          );


          if (response.status === true) {

            this.destinations =
              response.data || [];


            console.log(
              'DESTINATIONS:',
              this.destinations
            );


            console.log(
              'DESTINATIONS LENGTH:',
              this.destinations.length
            );

          }
          else {

            this.destinations = [];

            this.errorMessage =
              response.message ||
              'Unable to load destinations.';

          }


          // ===============================================
          // IMPORTANT
          // ===============================================

          this.loading = false;


          console.log(
            'LOADING:',
            this.loading
          );


          // Force Angular to update UI
          this.cdr.detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error) => {

          console.error(
            'Destinations API Error:',
            error
          );


          this.destinations = [];


          this.errorMessage =
            error?.error?.message ||
            'Something went wrong while loading destinations.';


          this.loading = false;


          // Force Angular to update UI
          this.cdr.detectChanges();

        }

      });

  }

}