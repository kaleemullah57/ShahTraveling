
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
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { DropdownItem, GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';
import { finalize } from 'rxjs';
import { Button } from "../../../../Shared/components/button/button";


@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe, forms,
    Button
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
  private readonly notificationService = inject(NotificationService);
  private readonly dropdownService = inject(GlobalDropdownService);


  // =====================================================
  // DATA
  // =====================================================

  destinations: Destination[] = [];
  countries: DropdownItem[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  errorMessage = '';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
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










  // Call Countries DropDown


  loadCountries(): void {

    console.log('🌍 LOAD COUNTRIES CALLED');

    if (this.countriesLoaded || this.countriesLoading) {
      return;
    }

    this.countriesLoading = true;

    this.dropdownService
      .getCountries()
      .pipe(
        finalize(() => {
          this.countriesLoading = false;
        })
      )
      .subscribe({

        next: (response) => {

          console.log('🌍 COUNTRIES API RESPONSE:', response);

          if (response?.statusCode === 200) {

            this.countries = (response.data ?? []).map(
              (country: any) => ({
                value: Number(
                  country.Value ?? country.value
                ),
                text:
                  country.Text ?? country.text
              })
            );

            console.log(
              '🌍 MAPPED COUNTRIES:',
              this.countries
            );

            this.formFields = this.formFields.map(field => {

              if (field.key === 'countryId') {
                return {
                  ...field,
                  options: this.countries.map(country => ({
                    label: country.text,
                    value: country.value
                  }))
                };
              }

              return field;
            });

            this.countriesLoaded = true;

            this.cdr.detectChanges();

          } else {

            this.countries = [];

            this.notificationService.error(
              response?.message ??
              'Unable to load countries.'
            );
          }
        },

        error: (error) => {

          console.error(
            '❌ GET COUNTRIES ERROR:',
            error
          );

          this.countries = [];

          this.notificationService.error(
            error?.error?.message ??
            'Unable to load countries.'
          );
        }
      });
  }






  // Load Provinces DropDown
  loadProvinces(countryId: number): void {

    console.log('🏙️ Loading provinces for CountryId:', countryId);

    // Clear old province selection
    this.destinationModel.provinceId = 0;

    this.dropdownService
      .getProvincesByCountryId(countryId)
      .subscribe({

        next: (response) => {

          console.log('🏙️ PROVINCES RESPONSE:', response);

          if (response?.statusCode === 200) {

            const provinces: DropdownItem[] =
              (response.data ?? []).map((province: any) => ({
                value: Number(
                  province.Value ??
                  province.value
                ),
                text:
                  province.TEXT ??
                  province.Text ??
                  province.text
              }));

            console.log('🏙️ PROVINCES:', provinces);

            this.formFields = this.formFields.map(field => {

              if (field.key === 'provinceId') {

                return {
                  ...field,

                  // IMPORTANT
                  options: provinces.map(province => ({
                    label: province.text,
                    value: province.value
                  }))
                };

              }

              return field;

            });

            console.log(
              '🔥 UPDATED FORM FIELDS:',
              this.formFields
            );

            // Force parent + child update
            this.formFields = [...this.formFields];

            this.cdr.detectChanges();

          } else {

            console.warn(
              '⚠️ Provinces API returned:',
              response?.message
            );

            this.formFields = this.formFields.map(field =>
              field.key === 'provinceId'
                ? {
                  ...field,
                  options: []
                }
                : field
            );

            this.cdr.detectChanges();
          }

        },

        error: (error) => {

          console.error(
            '❌ PROVINCES API ERROR:',
            error
          );

          this.notificationService.error(
            error?.error?.message ??
            'Unable to load provinces.'
          );

        }

      });
  }





  // Load Cities DropDown
  loadCities(provinceId: number): void {

    console.log(
      '🏘️ Loading cities for ProvinceId:',
      provinceId
    );

    this.dropdownService
      .getCitiesByProvinceId(provinceId)
      .subscribe({

        next: (response) => {

          console.log(
            '🏘️ CITIES RESPONSE:',
            response
          );

          if (response?.statusCode === 200) {

            const cities: DropdownItem[] =
              (response.data ?? []).map(
                (city: any) => ({
                  value: Number(
                    city.Value ??
                    city.value
                  ),

                  text:
                    city.TEXT ??
                    city.Text ??
                    city.text
                })
              );

            console.log(
              '🏘️ CITIES:',
              cities
            );

            this.formFields =
              this.formFields.map(field => {

                if (field.key === 'cityId') {

                  return {
                    ...field,

                    type: 'select',

                    options: cities.map(city => ({
                      label: city.text,
                      value: city.value
                    }))
                  };
                }

                return field;
              });

            this.cdr.detectChanges();
          }
        },

        error: (error) => {

          console.error(
            '❌ CITIES API ERROR:',
            error
          );

          this.notificationService.error(
            error?.error?.message ??
            'Unable to load cities.'
          );
        }
      });
  }





  countriesLoaded = false;
  countriesLoading = false;

  onFieldChange(event: { key: string; value: any }): void {

    console.log('🚨 FIELD CHANGE:', event);

    if (event.key === 'countryId') {

      const countryId = Number(event.value);

      console.log('🌍 COUNTRY ID:', countryId);

      // Reset dependent fields
      this.destinationModel.provinceId = 0;
      this.destinationModel.cityId = 0;

      // Clear old province options immediately
      this.formFields = this.formFields.map(field => {

        if (field.key === 'provinceId') {
          return {
            ...field,
            options: []
          };
        }

        return field;
      });

      if (!countryId) {
        this.cdr.detectChanges();
        return;
      }

      this.loadProvinces(countryId);
    }

    if (event.key === 'provinceId') {

      const provinceId = Number(event.value);

      console.log(
        '🏙️ SELECTED PROVINCE ID:',
        provinceId
      );

      if (!provinceId) {
        return;
      }

      console.log(
        '🚀 CALLING LOAD CITIES'
      );

      this.loadCities(provinceId);
    }
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
      label: 'Country',
      type: 'select',
      placeholder: 'Select Country',
      required: true,
      options: []
    },

    {
      key: 'provinceId',
      label: 'Province ID',
      type: 'select',
      placeholder: 'Select Province',
      required: true,
      options: []
    },

    {
      key: 'cityId',
      label: 'City ID',
      type: 'select',
      placeholder: 'Select City',
      required: true,
      options: []
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

    // 1. Open the form
    this.showDestinationForm = true;

    // 2. Wait until Angular creates the form component
    setTimeout(() => {
      this.loadCountries();
    });
  }

  closeDestinationForm(): void {
    this.showDestinationForm = false;
  }













  // Delete Destintions
  deleteDestination(destinationId: number): void {

    if (!destinationId) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this destination?'
    );

    if (!confirmed) {
      return;
    }

    this.destinationsService
      .deleteDestination(destinationId)
      .subscribe({
        next: (response) => {

          if (response?.success) {

            this.notificationService.success(
              response.message || 'Destination deleted successfully'
            );

            this.getDestinations();
            // Remove from current UI immediately
            this.destinations = this.destinations.filter(
              destination => destination.destinationId !== destinationId
            );

          } else {

            this.notificationService.error(
              response?.message || 'Unable to delete destination'
            );
          }
        },

        error: (error) => {

          console.error('Delete destination error:', error);

          this.notificationService.error(
            error?.error?.message ||
            'Unable to delete destination'
          );
        }
      });
  }
}