
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import {
  AddCountryModel,
  GetCountriesRequest,
  GetCountry,
  UpdateCountryModel
} from '../../Super Admin Models/CountriesModels/countries-model';

import { CountriesService } from '../../Super Admin Services/countries services/countries-service';
import {
  DataTable,
  TableAction,
  TableColumn
} from '../../../../Shared/components/DataTables/data-table/data-table';

import { CommonModule } from '@angular/common';
import {
  FormButton,
  FormField,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { Button } from '../../../../Shared/components/button/button';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [DataTable, CommonModule, forms, Button],
  templateUrl: './countries.html',
  styleUrl: './countries.scss'
})
export class Countries implements OnInit {

  private readonly countriesService = inject(CountriesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  countries: GetCountry[] = [];

  loading = false;
  saving = false;

  showAddForm = false;
  isEditMode = false;
  selectedCountryId: number | null = null;

  // =========================
  // TABLE COLUMNS
  // =========================

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
      type: 'edit',
      label: 'Edit',
      icon: 'fa fa-pencil'
    }
  ];

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
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadCountries();
  }

  // =========================
  // GET COUNTRIES
  // =========================

  loadCountries(): void {

    this.loading = true;

    const request: GetCountriesRequest = {
      search: null,
      pageNumber: 1,
      pageSize: 20
    };

    this.countriesService.getCountries(request).subscribe({

      next: (response) => {

        if (response.success) {
          this.countries = response.data ?? [];
        }

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        this.loading = false;

        console.error('GET COUNTRIES ERROR:', error);

        this.notification.error(
          error?.error?.message ?? 'Unable to load countries.'
        );

        this.cdr.detectChanges();
      }

    });
  }

  // =========================
  // OPEN ADD FORM
  // =========================

  openAddCountry(): void {

    this.isEditMode = false;
    this.selectedCountryId = null;

    this.countryModel = {
      countryName: '',
      countryCode: '',
      isActive: true
    };

    this.formButtons = [
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

    this.showAddForm = true;
  }

  // =========================
  // OPEN EDIT FORM
  // =========================

  editCountry(country: GetCountry): void {

    this.isEditMode = true;
    this.selectedCountryId = country.countryId;

    this.countryModel = {
      countryName: country.countryName,
      countryCode: country.countryCode,
      isActive: country.isActive
    };

    this.formButtons = [
      {
        label: 'Cancel',
        type: 'reset',
        style: 'secondary'
      },
      {
        label: 'Update Country',
        type: 'submit',
        style: 'primary'
      }
    ];

    this.showAddForm = true;
  }

  // =========================
  // CANCEL FORM
  // =========================

  cancelAddCountry(): void {

    this.showAddForm = false;
    this.isEditMode = false;
    this.selectedCountryId = null;

    this.countryModel = {
      countryName: '',
      countryCode: '',
      isActive: true
    };
  }

  // =========================
  // SAVE COUNTRY
  // ADD / UPDATE
  // =========================

  saveCountry(model: AddCountryModel): void {

    this.saving = true;

    if (this.isEditMode && this.selectedCountryId !== null) {

      const payload: UpdateCountryModel = {
        countryId: this.selectedCountryId,
        countryName: model.countryName,
        countryCode: model.countryCode,
        isActive: model.isActive
      };

      this.countriesService.updateCountry(payload).subscribe({

        next: (response) => {

          this.saving = false;

          if (response.success) {

            this.notification.success(
              response.message || 'Country updated successfully.'
            );

            this.cancelAddCountry();
            this.loadCountries();

          }
          else {

            this.notification.error(
              response.message || 'Unable to update country.'
            );

          }

          this.cdr.detectChanges();
        },

        error: error => {
          this.saving = false;
          console.error('UPDATE COUNTRY ERROR:', error);
          this.cdr.detectChanges();
        }

      });

    } else {

      this.countriesService.addCountry(model).subscribe({

        next: (response) => {

          this.saving = false;

          if (response.success) {

            this.notification.success(
              response.message || 'Country added successfully.'
            );

            this.cancelAddCountry();
            this.loadCountries();

          } else {

            this.notification.error(
              response.message || 'Unable to add country.'
            );

          }

          this.cdr.detectChanges();
        },

        error: error => {
          this.saving = false;
          console.error('ADD COUNTRY ERROR:', error);
          this.cdr.detectChanges();
        }

      });

    }
  }
}