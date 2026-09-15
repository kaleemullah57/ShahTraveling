import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { AirportsServices } from '../../Super Admin Services/Airports Services/airports-services';

import {
  FormButton,
  FormField,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import {
  AddAirportRequest,
  UpdateAirportRequest
} from '../../Super Admin Models/Airports Models/airport-model';

import { Button } from '../../../../Shared/components/button/button';

import { GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';

import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';

import {
  TableColumn,
  DataTable,
  TableAction
} from '../../../../Shared/components/DataTables/data-table/data-table';
import { DeleteConfirmation } from '../../../../Shared/components/Delete Confirmation/delete-confirmation/delete-confirmation';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-airports',
  standalone: true,
  imports: [
    forms,
    Button,
    DataTable,
    DeleteConfirmation,
    CommonModule
  ],
  templateUrl: './airports.html',
  styleUrl: './airports.scss'
})
export class Airports implements OnInit {



  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly notification =
    inject(NotificationService);

  constructor(
    private airportService: AirportsServices,
    private globalDropDownSerice: GlobalDropdownService
  ) { }



  showForm = false;

  formTitle = 'Add Airport';

  isEditMode = false;

  selectedAirportId = 0;



  formValues: any = {};



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
      label: 'International',
      type: 'status'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status'
    }

  ];



  airports: any[] = [];

  loading = false;

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;
  showDeleteConfirmation = false;

  deleting = false;

  selectedDeleteAirportId: number | null = null;

  selectedAirportName = '';



  ngOnInit(): void {

    this.loadAirports();

  }


  // =========================================================
  // ADD AIRPORT FORM
  // =========================================================

  openAddAirportForm(): void {

    this.formTitle = 'Add Airport';

    this.isEditMode = false;

    this.selectedAirportId = 0;

    this.formValues = {};


    // Clear dependent dropdowns
    this.setFieldOptions(
      'provinceId',
      []
    );

    this.setFieldOptions(
      'cityId',
      []
    );


    // Open form
    this.showForm = true;


    // Load countries
    this.loadCountries();

  }



  editAirport(airport: any): void {

    this.isEditMode = true;

    this.formTitle = 'Update Airport';

    this.selectedAirportId = Number(airport.airportId);

    this.formValues = {

      airportName: airport.airportName ?? '',

      iataCode: airport.iataCode ?? '',

      icaoCode: airport.icaoCode ?? '',

      countryId: Number(airport.countryId),

      provinceId: Number(airport.provinceId),

      cityId: Number(airport.cityId),

      isInternational: airport.isInternational === true || Number(airport.isInternational) === 1 ? 1 : 0,

      isActive: airport.isActive === true || Number(airport.isActive) === 1
    };


    this.setFieldOptions(
      'provinceId',
      []
    );

    this.setFieldOptions(
      'cityId',
      []
    );

    this.showForm = true;

    this.loadCountriesForEdit();

  }


  loadCountries(): void {

    this.globalDropDownSerice
      .getCountries()
      .subscribe({

        next: (response: any) => {

          if (!response?.status) {
            return;
          }


          const countries =
            (response.data ?? [])
              .map((item: any) => ({

                label:
                  item.Text,

                value:
                  Number(item.Value)

              }));


          this.setFieldOptions(
            'countryId',
            countries
          );

        },

        error: (error) => {

          console.error(
            'Countries API Error:',
            error
          );

        }

      });

  }

  private loadCountriesForEdit(): void {

    this.globalDropDownSerice
      .getCountries()
      .subscribe({

        next: (response: any) => {

          if (!response?.status) {
            return;
          }


          const countries =
            (response.data ?? [])
              .map((item: any) => ({

                label:
                  item.Text,

                value:
                  Number(item.Value)

              }));


          this.setFieldOptions(
            'countryId',
            countries
          );

          const countryId =
            Number(
              this.formValues.countryId
            );


          if (countryId > 0) {

            this.loadProvincesForEdit(
              countryId
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


  loadProvinces(
    countryId: number
  ): void {

    this.globalDropDownSerice
      .getProvincesByCountryId(countryId)
      .subscribe({

        next: (response: any) => {

          if (
            response?.status !== true &&
            response?.status !== 'Success'
          ) {
            return;
          }


          const provinces =
            (response.data ?? [])
              .map((item: any) => ({

                label:
                  item.TEXT ??
                  item.Text,

                value:
                  Number(item.Value)

              }));


          this.setFieldOptions(
            'provinceId',
            provinces
          );

        },

        error: (error) => {

          console.error(
            'Provinces API Error:',
            error
          );

        }

      });

  }


  private loadProvincesForEdit(
    countryId: number
  ): void {



    this.globalDropDownSerice
      .getProvincesByCountryId(countryId)
      .subscribe({

        next: (response: any) => {

          if (
            response?.status !== true &&
            response?.status !== 'Success'
          ) {
            return;
          }


          const provinces =
            (response.data ?? [])
              .map((item: any) => ({

                label:
                  item.TEXT ??
                  item.Text,

                value:
                  Number(item.Value)

              }));


          this.setFieldOptions(
            'provinceId',
            provinces
          );

          const provinceId =
            Number(
              this.formValues.provinceId
            );


          if (provinceId > 0) {

            this.loadCitiesForEdit(
              provinceId
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



  loadCities(
    provinceId: number
  ): void {

    this.globalDropDownSerice
      .getCitiesByProvinceId(provinceId)
      .subscribe({

        next: (response: any) => {

          if (
            response?.status !== true &&
            response?.status !== 'Success'
          ) {
            return;
          }


          const cities =
            (response.data ?? [])
              .map((item: any) => ({

                label:
                  item.TEXT ??
                  item.Text,

                value:
                  Number(item.Value)

              }));


          this.setFieldOptions(
            'cityId',
            cities
          );

        },

        error: (error) => {

          console.error(
            'Cities API Error:',
            error
          );

        }

      });

  }

  private loadCitiesForEdit(
    provinceId: number
  ): void {


    this.globalDropDownSerice
      .getCitiesByProvinceId(provinceId)
      .subscribe({

        next: (response: any) => {

          if (
            response?.status !== true &&
            response?.status !== 'Success'
          ) {
            return;
          }


          const cities =
            (response.data ?? [])
              .map((item: any) => ({

                label:
                  item.TEXT ??
                  item.Text,

                value:
                  Number(item.Value)

              }));


          this.setFieldOptions(
            'cityId',
            cities
          );

          this.formValues = {

            ...this.formValues,

            countryId:
              Number(
                this.formValues.countryId
              ),

            provinceId:
              Number(
                this.formValues.provinceId
              ),

            cityId:
              Number(
                this.formValues.cityId
              )

          };


          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Cities API Error:',
            error
          );

        }

      });

  }



  onFieldChange(event: any): void {

    const key = event?.key;

    const value = event?.value;

    if (key === 'countryId') {

      this.formValues = {

        ...this.formValues,

        countryId:
          Number(value),

        provinceId:
          null,

        cityId:
          null

      };

      this.setFieldOptions(
        'provinceId',
        []
      );

      this.setFieldOptions(
        'cityId',
        []
      );


      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {

        return;

      }


      this.loadProvinces(
        Number(value)
      );

      return;

    }

    if (key === 'provinceId') {

      this.formValues = {

        ...this.formValues,

        provinceId: Number(value),

        cityId: null

      };


      this.setFieldOptions(
        'cityId',
        []
      );


      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {

        return;

      }


      this.loadCities(
        Number(value)
      );

    }

  }


  private setFieldOptions(
    fieldKey: string,
    options: any[]
  ): void {

    this.formFields =
      this.formFields.map(field => {

        if (field.key === fieldKey) {

          return {

            ...field,

            options: [
              ...options
            ]

          };

        }

        return field;

      });


    this.cdr.detectChanges();

  }



  onFormSubmit(
    formData: any
  ): void {



    if (this.isEditMode) {

      this.updateAirport(
        formData
      );

      return;

    }


    this.addAirport(
      formData
    );

  }



  private addAirport(
    formData: any
  ): void {

    const request: AddAirportRequest = {

      airportName: formData.airportName?.trim(),

      iataCode: formData.iataCode?.trim().toUpperCase(),

      icaoCode: formData.icaoCode?.trim().toUpperCase(),

      countryId: Number(formData.countryId),

      provinceId: Number(formData.provinceId),

      cityId: Number(formData.cityId),

      isInternational: Number(formData.isInternational),

      isActive: formData.isActive === true

    };


    this.airportService
      .addAirport(request)
      .subscribe({

        next: (response: any) => {

          if (
            response?.success === true
          ) {

            this.notification.success(
              response.message ||
              'Airport added successfully.'
            );


            this.closeForm();

            this.loadAirports();

            return;

          }


          this.notification.error(
            response?.message ||
            'Unable to add airport.'
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




  private updateAirport(
    formData: any
  ): void {

    const request: UpdateAirportRequest = {

      airportId: this.selectedAirportId,

      airportName: formData.airportName?.trim(),

      iataCode: formData.iataCode?.trim().toUpperCase(),

      icaoCode: formData.icaoCode?.trim().toUpperCase(),

      countryId: Number(formData.countryId),

      provinceId: Number(formData.provinceId),

      cityId: Number(formData.cityId),

      isInternational: Number(formData.isInternational) === 1,

      isActive: formData.isActive === true

    };




    this.airportService
      .updateAirport(request)
      .subscribe({

        next: (response: any) => {

          if (
            response?.success === true
          ) {

            this.notification.success(
              response.message ||
              'Airport updated successfully.'
            );


            this.closeForm();

            this.loadAirports();

            return;

          }


          this.notification.error(
            response?.message ||
            'Unable to update airport.'
          );

        },

        error: (error) => {

          console.error(
            'Update Airport API Error:',
            error
          );


          this.notification.error(
            error?.error?.message ||
            'Unable to update airport.'
          );

        }

      });

  }


  private closeForm(): void {

    this.showForm = false;

    this.isEditMode = false;

    this.selectedAirportId = 0;

    this.formValues = {};


    this.setFieldOptions(
      'provinceId',
      []
    );

    this.setFieldOptions(
      'cityId',
      []
    );


    this.cdr.detectChanges();

  }


  onFormCancel(): void {

    this.closeForm();

  }











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

          if (
            response?.success === true
          ) {

            this.airports = response.data?.data ?? [];


            this.totalRecords =
              response.data?.filterCount ??
              response.data?.totalCount ??
              this.airports.length;

          }

          else {

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


actions: TableAction[] = [
  {
    type: 'edit',
    label: 'Edit',
    icon: 'fa fa-edit'
  },
  {
    type: 'delete',
    label: 'Delete',
    icon: 'fa fa-trash'
  }
];

onActionClick(event: any): void {

  console.log('AIRPORT ACTION:', event);

  const actionType = event?.action?.type;
  const airport = event?.row;

  if (!airport) {
    return;
  }

  if (actionType === 'delete') {
    this.deleteAirport(airport);
    return;
  }

  if (actionType === 'edit') {
    this.editAirport(airport);
    return;
  }
}


















  // Delete Airports

// deleteAirport(airport: any): void {

//   const airportId = Number(
//     airport?.airportId
//   );

//   if (!airportId) {

//     this.notification.error(
//       'Airport ID is missing.'
//     );

//     return;
//   }

//   this.selectedDeleteAirportId =
//     airportId;

//   this.selectedAirportName =
//     airport?.airportName ||
//     'this airport';

//   this.showDeleteConfirmation = true;

// }


cancelDeleteAirport(): void {

  if (this.deleting) {
    return;
  }

  this.showDeleteConfirmation = false;

  this.selectedDeleteAirportId = null;

  this.selectedAirportName = '';

}



deleteAirport(airport: any): void {

  console.log('deleteAirport() called:', airport);

  const airportId = Number(
    airport?.airportId
  );

  console.log('Airport ID:', airportId);

  if (!airportId) {

    this.notification.error(
      'Airport ID is missing.'
    );

    return;
  }

  this.selectedDeleteAirportId = airportId;

  this.selectedAirportName =
    airport?.airportName || 'this airport';

  this.showDeleteConfirmation = true;

  console.log(
    'Popup should open:',
    this.showDeleteConfirmation
  );

  this.cdr.detectChanges();
}


confirmDeleteAirport(): void {

  console.log(
    'CONFIRM DELETE CALLED:',
    this.selectedDeleteAirportId
  );

  if (
    !this.selectedDeleteAirportId ||
    this.deleting
  ) {
    console.log(
      'DELETE STOPPED:',
      this.selectedDeleteAirportId,
      this.deleting
    );

    return;
  }

  this.deleting = true;

  console.log(
    'CALLING DELETE API:',
    this.selectedDeleteAirportId
  );

  this.airportService
    .deleteAirport(
      this.selectedDeleteAirportId
    )
    .subscribe({

      next: (response: any) => {

        console.log(
          'DELETE API RESPONSE:',
          response
        );

        this.deleting = false;

        if (
          response?.success === true &&
          response?.statusCode === 200
        ) {

          this.notification.success(
            response?.message ||
            'Airport deleted successfully.'
          );

          this.showDeleteConfirmation = false;

          this.selectedDeleteAirportId = null;

          this.selectedAirportName = '';

          this.loadAirports();

          this.cdr.detectChanges();

          return;
        }

        this.notification.error(
          response?.message ||
          'Unable to delete airport.'
        );

      },

      error: (error) => {

        console.error(
          'DELETE AIRPORT ERROR:',
          error
        );

        this.deleting = false;

        this.notification.error(
          error?.error?.message ||
          'Failed to delete airport.'
        );

        this.cdr.detectChanges();
      }

    });
}
}