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
  AddDestinationRequest,
  Destination
} from '../../Admin Models/Destinations/destination-model';
import { FormButton, FormField, forms } from "../../../../Shared/components/Forms/forms/forms";
import { Button } from '../../../../Shared/components/button/button';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';


@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe, forms
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
  private readonly notificationService =
  inject(NotificationService);


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

  console.log('🔥 DESTINATIONS COMPONENT CREATED');
  console.log('🔥 CURRENT URL:', window.location.href);

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

















  // Add Destinations


  formFields: FormField[] = [
    {
      key: 'destinationName',
      label: 'Destination Name',
      type: 'text',
      placeholder: 'Enter destination name',
      required: true
    },

    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter destination description',
      required: true
    },

    {
      key: 'countryId',
      label: 'Country ID',
      type: 'number',
      placeholder: 'Enter country ID',
      required: true
    },

    {
      key: 'provinceId',
      label: 'Province ID',
      type: 'number',
      placeholder: 'Enter province ID',
      required: true
    },

    {
      key: 'cityId',
      label: 'City ID',
      type: 'number',
      placeholder: 'Enter city ID',
      required: true
    },

    {
      key: 'picturePath',
      label: 'Destination Images',
      type: 'file',
      required: false
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }
  ];

  formButtons: FormButton[] = [
    {
      label: 'Add Destination',
      type: 'submit'
    },
    {
      label: 'Cancel',
      type: 'reset'
    }
  ];
  destinationModel: AddDestinationRequest = {
    destinationName: '',
    description: '',
    picturePath: [],
    countryId: 0,
    provinceId: 0,
    cityId: 0,
    isActive: true
  };

  saving = false;


  addDestination(model: AddDestinationRequest): void {

    console.log('🔥 ADD DESTINATION METHOD CALLED');
    console.log('MODEL:', model);

    this.saving = true;
    this.errorMessage = '';

    this.destinationsService
      .addDestination(model)
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (response) => {

          console.log('🔥 API RESPONSE:', response);

          // Stop button loading
          this.saving = false;

          if (response.status === true) {

            // =============================================
            // SHOW SUCCESS NOTIFICATION
            // =============================================

            this.notificationService.success(
              response.message ||
              'Destination added successfully.'
            );

            // =============================================
            // CLOSE FORM
            // =============================================

            this.showDestinationForm = false;

            // =============================================
            // REFRESH DESTINATIONS
            // =============================================

            this.getDestinations();

            console.log(
              '✅',
              response.message
            );

          } else {

            // =============================================
            // API RETURNED FAILURE
            // =============================================

            this.notificationService.error(
              response.message ||
              'Unable to add destination.'
            );

          }

          this.cdr.detectChanges();
        },

        // =================================================
        // ERROR
        // =================================================

        error: (error) => {

          console.error(
            '🔥 API ERROR:',
            error
          );

          // Stop loading even when API fails
          this.saving = false;

          this.notificationService.error(
            error?.error?.message ||
            'Something went wrong while adding destination.'
          );

          this.cdr.detectChanges();
        }

      });
  }





  showDestinationForm = false;

  openDestinationForm(): void {
    this.showDestinationForm = true;
  }

  closeDestinationForm(): void {
    this.showDestinationForm = false;
  }

}