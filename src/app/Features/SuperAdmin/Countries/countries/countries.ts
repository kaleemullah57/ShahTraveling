import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { AddCountryModel, GetCountriesRequest, GetCountry } from '../../Super Admin Models/CountriesModels/countries-model';
import { CountriesService } from '../../Super Admin Services/countries services/countries-service';
import { DataTable, TableAction, TableColumn } from '../../../../Shared/components/DataTables/data-table/data-table';
import { CommonModule } from '@angular/common';
import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
@Component({
  selector: 'app-countries',
  imports: [DataTable, CommonModule, forms],
  templateUrl: './countries.html',
  styleUrl: './countries.scss',
})
export class Countries {
  private readonly countriesService = inject(CountriesService);
  private readonly cdr = inject(ChangeDetectorRef);
  countries: GetCountry[] = [];

  loading = false;

  columns: TableColumn[] = [

    {
      key: 'countryName',
      label: 'Country Name',
      type: 'text'
    },

    {
      key: 'countryCode',
      label: 'Country Code',
      type: 'text'
    },

    {
      key: 'userName',
      label: 'Created By',
      type: 'text'
    },

    {
      key: 'createdOn',
      label: 'Created On',
      type: 'date'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status'
    }

  ];
  actions: TableAction[] = [
    {
      type: 'view',
      label: 'View',
      icon: 'fa fa-eye'
    },
    {
      type: 'edit',
      label: 'Edit',
      icon: 'fa fa-pencil'
    },
    {
      type: 'delete',
      label: 'Delete',
      icon: 'fa fa-trash'
    }
  ];


  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {

    this.loading = true;

    const request: GetCountriesRequest = {
      search: null,
      pageNumber: 1,
      pageSize: 20
    };

    this.countriesService
      .getCountries(request)
      .subscribe({

        next: (response) => {
          if (response.success) {

            this.countries = response.data;

          }

          this.loading = false;

          // Force Angular to update the view
          this.cdr.detectChanges();
        },

        error: (error) => {

          this.saving = false;

          this.cdr.detectChanges();
        }

      });
  }












  // Add Countries
  // =========================
  // FORM STATE
  // =========================

  showAddForm = false;

  saving = false;


  // =========================
  // COUNTRY MODEL
  // =========================

  countryModel: AddCountryModel = {
    countryName: '',
    countryCode: '',
    isActive: true
  };


  // =========================
  // FORM FIELDS
  // =========================

  formFields: FormField[] = [

    {
      key: 'countryName',
      label: 'Country Name',
      type: 'text'
    },

    {
      key: 'countryCode',
      label: 'Country Code',
      type: 'text'
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }

  ];


  // =========================
  // FORM BUTTONS
  // =========================

  formButtons: FormButton[] = [

    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    },

    {
      label: 'Add Country',
      type: 'submit',
      style: 'primary'
    }

  ];

  // =========================
  // OPEN ADD FORM
  // =========================

  openAddCountry(): void {

    this.countryModel = {
      countryName: '',
      countryCode: '',
      isActive: true
    };

    this.showAddForm = true;
  }


  // =========================
  // CANCEL
  // =========================

  cancelAddCountry(): void {

    this.showAddForm = false;

    this.countryModel = {
      countryName: '',
      countryCode: '',
      isActive: true
    };
  }


  // =========================
  // ADD COUNTRY
  // =========================

  addCountry(model: AddCountryModel): void {

    this.saving = true;

    this.countriesService
      .addCountry(model)
      .subscribe({

        next: (response) => {
          this.saving = false;

          if (response.success) {

            this.countryModel = {
              countryName: '',
              countryCode: '',
              isActive: true
            };

            this.showAddForm = false;

            this.loadCountries();

            this.cdr.detectChanges();
          }
        },

        error: (error) => {
          this.saving = false;

          this.cdr.detectChanges();
        }

      });
  }
}