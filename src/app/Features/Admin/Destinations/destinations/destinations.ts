
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
  private readonly destinationsService = inject(
    DestinationsService
  );

  private readonly cdr = inject(
    ChangeDetectorRef
  );
  private readonly notificationService = inject(NotificationService);
  private readonly dropdownService = inject(GlobalDropdownService);


  destinations: Destination[] = [];
  countries: DropdownItem[] = [];

  loading = false;

  errorMessage = '';
  
  ngOnInit(): void {
    this.getDestinations();

  }

  getDestinations(): void {

    this.loading = true;

    this.errorMessage = '';

    this.cdr.detectChanges();


    this.destinationsService
      .getDestinations()
      .subscribe({
        next: (response) => {
          if (response.status === true) {

            this.destinations =
              response.data || [];
          }
          else {

            this.destinations = [];

            this.errorMessage =
              response.message ||
              'Unable to load destinations.';

          }
          this.loading = false;
          this.cdr.detectChanges();

        },
        error: (error) => {
          this.destinations = [];
          this.errorMessage =
            error?.error?.message ||
            'Something went wrong while loading destinations.';
          this.loading = false;
          this.cdr.detectChanges();

        }

      });

  }










  // Call Countries DropDown


  loadCountries(): void {
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
    this.destinationModel.provinceId = 0;

    this.dropdownService
      .getProvincesByCountryId(countryId)
      .subscribe({

        next: (response) => {
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
            this.formFields = [...this.formFields];

            this.cdr.detectChanges();

          } else {
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
          this.notificationService.error(
            error?.error?.message ??
            'Unable to load provinces.'
          );

        }

      });
  }





  // Load Cities DropDown
  loadCities(provinceId: number): void {
    this.dropdownService
      .getCitiesByProvinceId(provinceId)
      .subscribe({

        next: (response) => {
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
    if (event.key === 'countryId') {

      const countryId = Number(event.value);
      this.destinationModel.provinceId = 0;
      this.destinationModel.cityId = 0;

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
      if (!provinceId) {
        return;
      }
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

    this.saving = true;
    this.errorMessage = '';

    this.destinationsService
      .addDestination(model)
      .subscribe({

        next: (response) => {
          // Stop button loading
          this.saving = false;

          if (response.status === true) {
            this.notificationService.success(
              response.message ||
              'Destination added successfully.'
            );
            this.showDestinationForm = false;

            this.getDestinations();

          } else {
            this.notificationService.error(
              response.message ||
              'Unable to add destination.'
            );

          }

          this.cdr.detectChanges();
        },
        error: (error) => {
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