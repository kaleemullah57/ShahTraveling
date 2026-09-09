import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';
import { AddProvinceResponse, Province, ProvinceResponse } from '../../Super Admin Models/Provinces Models/provinces-model';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { ProvincesService } from '../../Super Admin Services/provinces services/provinces-service';
import { FormsModule } from "@angular/forms";
import { Button } from "../../../../Shared/components/button/button";
import { DataTable, TableColumn } from "../../../../Shared/components/DataTables/data-table/data-table";
import { DropdownItem, GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';
@Component({
  selector: 'app-provinces',
  imports: [FormsModule, forms, Button, DataTable],
  templateUrl: './provinces.html',
  styleUrl: './provinces.scss',
})
export class Provinces implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private readonly provincesService = inject(
    ProvincesService
  );

  private readonly cdr = inject(
    ChangeDetectorRef
  );
  private readonly GlobalDropDownService =
  inject(GlobalDropdownService);

  private readonly notificationService = inject(
    NotificationService
  );


  // =====================================================
  // DATA
  // =====================================================

  provinces: Province[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  saving = false;

  errorMessage = '';

  showProvinceForm = false;


  // =====================================================
  // PAGINATION
  // =====================================================

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalCount = 0;


onPageChange(page: number): void {

  this.pageNumber = page;

  this.getProvinces();
}


onPageSizeChange(size: number): void {

  this.pageSize = size;

  this.pageNumber = 1;

  this.getProvinces();
}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.getProvinces();
  }

  countries: DropdownItem[] = [];

countriesLoaded = false;

countriesLoading = false;

 loadCountries(): void {

  console.log('🌍 LOAD COUNTRIES CALLED');

  if (this.countriesLoaded || this.countriesLoading) {
    return;
  }

  this.countriesLoading = true;

  this.GlobalDropDownService
    .getCountries()
    .subscribe({

      next: (response: any) => {

        console.log(
          '🌍 COUNTRIES API RESPONSE:',
          response
        );

        if (response?.statusCode === 200) {

          this.countries =
            (response.data ?? []).map((country: any) => ({
              value: Number(country.Value),
              text: country.Text
            }));

          console.log(
            '🌍 MAPPED COUNTRIES:',
            this.countries
          );

          const countryOptions = this.countries.map(country => ({
  label: country.text,
  value: country.value
}));

this.formFields = this.formFields.map(field =>
  field.key === 'countryId'
    ? {
        ...field,
        options: countryOptions
      }
    : field
);

console.log(
  '🔽 COUNTRY OPTIONS:',
  countryOptions
);

          this.countriesLoaded = true;

          this.cdr.detectChanges();

        } else {

          this.countries = [];

          this.notificationService.error(
            response?.message ??
            'Unable to load countries.'
          );
        }

        this.countriesLoading = false;
      },

      error: (error: any) => {

        console.error(
          '❌ GET COUNTRIES ERROR:',
          error
        );

        this.countries = [];

        this.countriesLoading = false;

        this.notificationService.error(
          error?.error?.message ??
          'Unable to load countries.'
        );

        this.cdr.detectChanges();
      }
    });
}
  // =====================================================
  // GET PROVINCES
  // =====================================================

  getProvinces(): void {
    this.loading = true;
    this.errorMessage = '';

    this.provincesService
      .getProvinces(this.search, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response: ProvinceResponse) => {

          console.log('🔥 PROVINCES API RESPONSE:', response);

          if (response.success === true) {

            this.provinces = response.data ?? [];
            this.totalCount = response.totalCount ?? 0;

            // Data not found
            if (this.provinces.length === 0) {
              this.errorMessage =
                response.message || 'No provinces found.';
            }

          } else {

            this.provinces = [];
            this.totalCount = 0;

            this.errorMessage =
              response.message || 'No provinces found.';
          }

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('❌ PROVINCES API ERROR:', error);

          this.provinces = [];
          this.totalCount = 0;

          this.errorMessage =
            error?.error?.message ||
            'Something went wrong while loading provinces.';

          this.loading = false;

          this.notificationService.error(this.errorMessage);

          this.cdr.detectChanges();
        }
      });
  }


  // =====================================================
  // SEARCH
  // =====================================================

  onSearch(searchValue: string): void {

    this.search = searchValue;

    this.pageNumber = 1;

    this.getProvinces();

  }


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearch(): void {

    this.search = '';

    this.pageNumber = 1;

    this.getProvinces();

  }




  // =====================================================
  // ADD PROVINCE FORM
  // =====================================================

formFields: FormField[] = [
  {
    key: 'provinceName',
    label: 'Province Name',
    type: 'text',
    placeholder: 'Enter province name',
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
    key: 'isActive',
    label: 'Status',
    type: 'checkbox',
    placeholder: 'Active'
  }
];

  // =====================================================
  // FORM BUTTONS
  // =====================================================

 formButtons: FormButton[] = [
  {
    label: 'Cancel',
    type: 'reset',
      style: 'secondary'
  },
  {
    label: 'Add Province',
    type: 'submit',
    style: 'primary'
  }
];

  columns: TableColumn[] = [
    {
      key: 'provinceName',
      label: 'Province Name',
      type: 'text',
      sortable: true
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'status',
      sortable: true
    }
  ];


  // =====================================================
  // PROVINCE MODEL
  // =====================================================

  provinceModel = {

    provinceName: '',
    countryId: 0,
    isActive: true

  };


  // =====================================================
  // OPEN FORM
  // =====================================================

openProvinceForm(): void {

  this.provinceModel = {
    provinceName: '',
    countryId: 0,
    isActive: true
  };

  // First open the form
  this.showProvinceForm = true;

  // Then load countries
  this.loadCountries();

  this.cdr.detectChanges();
}
  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeProvinceForm(): void {

    this.showProvinceForm = false;

    this.cdr.detectChanges();

  }


  // =====================================================
  // ADD PROVINCE
  // =====================================================

  addProvince(model: any): void {

    console.log('🔥 ADD PROVINCE MODEL:', model);

    const request = {
      provinceName: model.provinceName?.trim(),
      countryId: Number(model.countryId),
      isActive: model.isActive ?? true
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    if (!request.provinceName) {
      this.notificationService.error(
        'Province name is required.'
      );
      return;
    }

    if (!request.countryId || request.countryId <= 0) {
      this.notificationService.error(
        'Please select a country.'
      );
      return;
    }

    // =========================================================
    // START SAVING
    // =========================================================

    this.saving = true;

    this.provincesService
      .addProvince(request)
      .subscribe({

        // =====================================================
        // SUCCESS
        // =====================================================

        next: (response: AddProvinceResponse) => {

          console.log(
            '🔥 ADD PROVINCE RESPONSE:',
            response
          );

          if (response.success === true) {

            this.notificationService.success(
              response.message ||
              'Province added successfully.'
            );

            // Close form
            this.showProvinceForm = false;

            // Reset form
            this.provinceModel = {
              provinceName: '',
              countryId: 0,
              isActive: true
            };

            // Refresh table
            this.getProvinces();

          } else {

            this.notificationService.error(
              response.message ||
              'Unable to add province.'
            );
          }

          this.saving = false;

          this.cdr.detectChanges();
        },

        // =====================================================
        // ERROR
        // =====================================================

        error: (error) => {

          console.error(
            '❌ ADD PROVINCE API ERROR:',
            error
          );

          const message =
            error?.error?.message ||
            'Something went wrong while adding province.';

          this.notificationService.error(message);

          this.saving = false;

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // FORM FIELD CHANGE
  // =====================================================

 onFieldChange(event: {
  key: string;
  value: any;
}): void {

  console.log(
    '📌 PROVINCE FIELD CHANGE:',
    event
  );

  this.provinceModel = {
    ...this.provinceModel,
    [event.key]: event.value
  };

  console.log(
    '📦 PROVINCE MODEL:',
    this.provinceModel
  );
}

}
