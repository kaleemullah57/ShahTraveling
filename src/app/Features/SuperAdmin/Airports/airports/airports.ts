import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AirportsServices } from '../../Super Admin Services/Airports Services/airports-services';
import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';
import { AddAirportRequest } from '../../Super Admin Models/Airports Models/airport-model';
import { Button } from '../../../../Shared/components/button/button';
import { CountriesService } from '../../Super Admin Services/countries services/countries-service';
import { ProvincesService } from '../../Super Admin Services/provinces services/provinces-service';
import { Countries } from '../../Countries/countries/countries';
import { GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { TableColumn, DataTable } from '../../../../Shared/components/DataTables/data-table/data-table';
@Component({
  selector: 'app-airports',
  imports: [forms, Button, DataTable],
  templateUrl: './airports.html',
  styleUrl: './airports.scss',
})
export class Airports implements OnInit {

  ngOnInit(): void {
    this.loadAirports();
  }
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly notification =
    inject(NotificationService);
  constructor(
    private airportService: AirportsServices,
    private globalDropDownSerice: GlobalDropdownService
  ) { }


  showForm = false;

  formTitle = 'Add Airport';
  buttons: FormButton[] = [
    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    },
    {
      label: 'Submit',
      type: 'submit',
      style: 'primary'
    }
  ];

  formFields: FormField[] = [

    {
      key: 'airportName',
      label: 'Airport Name',
      type: 'text',
      placeholder: 'Enter airport name',
      required: true
    },

    {
      key: 'iataCode',
      label: 'IATA Code',
      type: 'text',
      placeholder: 'e.g. ISB',
      required: true
    },

    {
      key: 'icaoCode',
      label: 'ICAO Code',
      type: 'text',
      placeholder: 'e.g. OPIS',
      required: true
    },

    {
      key: 'countryId',
      label: 'Country',
      type: 'select',
      placeholder: 'Select country',
      required: true,
      options: []
    },

    {
      key: 'provinceId',
      label: 'Province',
      type: 'select',
      placeholder: 'Select province',
      required: true,
      options: []
    },

    {
      key: 'cityId',
      label: 'City',
      type: 'select',
      placeholder: 'Select city',
      required: true,
      options: []
    },

    {
      key: 'isInternational',
      label: 'Airport Type',
      type: 'select',
      placeholder: 'Select airport type',
      required: true,
      options: [
        {
          label: 'Domestic',
          value: 0
        },
        {
          label: 'International',
          value: 1
        }
      ]
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox',
      required: false
    }

  ];



  openAddAirportForm(): void {

    this.formTitle = 'Add Airport';

    this.showForm = true;

    this.loadCountries();
  }

  loadCountries(): void {

    this.globalDropDownSerice
      .getCountries()
      .subscribe({

        next: (response) => {

          if (response?.status) {

            const countries = (response.data ?? [])
              .map((item: any) => ({
                label: item.Text,
                value: item.Value
              }));

            this.setFieldOptions(
              'countryId',
              countries
            );
          }

        },

        error: (error) => {

          console.error(
            'Countries API Error:',
            error
          );

        }

      });
  }


  loadProvinces(countryId: number): void {

    this.globalDropDownSerice
      .getProvincesByCountryId(countryId)
      .subscribe({

        next: (response: any) => {

          if (response?.status === 'Success') {

            const provinces = (response.data ?? [])
              .map((item: any) => ({
                label: item.TEXT,
                value: item.Value
              }));
            this.setFieldOptions(
              'provinceId',
              provinces
            );
          }

        },

        error: (error) => {

          console.error(
            'Provinces API Error:',
            error
          );

        }

      });
  }



  loadCities(provinceId: number): void {
    this.globalDropDownSerice
      .getCitiesByProvinceId(provinceId)
      .subscribe({
        next: (response: any) => {
          if (response?.status === true) {

            const cities = (response.data ?? []).map((item: any) => ({
              label: item.TEXT,
              value: item.Value
            }));
            this.setFieldOptions('cityId', cities);
          }
        },
        error: (error) => {
          console.error('Cities API Error:', error);
        }
      });
  }




  onFieldChange(event: any): void {

    const key = event?.key;
    const value = event?.value;

    if (key === 'countryId') {

      this.setFieldOptions('provinceId', []);
      this.setFieldOptions('cityId', []);

      if (!value) {
        return;
      }

      this.loadProvinces(Number(value));
    }

    if (key === 'provinceId') {

      this.setFieldOptions('cityId', []);

      if (!value) {
        return;
      }

      this.loadCities(Number(value));
    }
  }



  private setFieldOptions(
    fieldKey: string,
    options: any[]
  ): void {

    this.formFields = this.formFields.map(field => {

      if (field.key === fieldKey) {
        return {
          ...field,
          options: [...options]
        };
      }

      return field;
    });

    this.cdr.detectChanges();
  }


  onFormSubmit(formData: any): void {

    const request: AddAirportRequest = {

      airportName:
        formData.airportName?.trim(),

      iataCode:
        formData.iataCode?.trim().toUpperCase(),

      icaoCode:
        formData.icaoCode?.trim().toUpperCase(),

      countryId:
        Number(formData.countryId),

      provinceId:
        Number(formData.provinceId),

      cityId:
        Number(formData.cityId),

      isInternational:
        Number(formData.isInternational),

      isActive:
        formData.isActive === true
    };
    this.airportService
      .addAirport(request)
      .subscribe({

        next: (response: any) => {

          if (response?.success === true) {

            this.notification.success(
              response.message || 'Airport added successfully.'
            );

            this.showForm = false;

            this.loadAirports();

            this.cdr.detectChanges();
            return;
          }

          this.notification.error(
            response?.message || 'Unable to add airport.'
          );

        },

        error: (error) => {

          console.error(
            'Add Airport API Error:',
            error
          );

          this.notification.error(
            error?.error?.message ||
            'Unable to add airport.'
          );

        }

      });
  }



  onFormCancel(): void {

    this.showForm = false;

  }































  // Get Airports
  columns: TableColumn[] = [
    {
      key: 'airportName',
      label: 'Airport'
    },
    {
      key: 'iataCode',
      label: 'IATA'
    },
    {
      key: 'icaoCode',
      label: 'ICAO'
    },
    {
      key: 'countryName',
      label: 'Country'
    },
    {
      key: 'provinceName',
      label: 'Province'
    },
    {
      key: 'cityName',
      label: 'City'
    },
    {
      key: 'isInternational',
      label: 'Type'
    },
    {
      key: 'isActive',
      label: 'Status'
    }
  ];


  airports: any[] = [];

  loading = false;

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;

  loadAirports(): void {

    this.loading = true;

    const request = {
      search: this.search?.trim() || '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.airportService
      .getAirports(request)
      .subscribe({

        next: (response: any) => {

          if (response?.success === true) {

            this.airports = response.data?.data ?? [];

            this.totalRecords =
              response.data?.filterCount ??
              response.data?.totalCount ??
              this.airports.length;

          } else {

            this.airports = [];
            this.totalRecords = 0;

            this.notification.error(
              response?.message ||
              'Unable to load airports.'
            );
          }

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Get Airports API Error:',
            error
          );

          this.airports = [];
          this.totalRecords = 0;
          this.loading = false;

          this.notification.error(
            error?.error?.message ||
            'Unable to load airports.'
          );

          this.cdr.detectChanges();
        }

      });
  }


}