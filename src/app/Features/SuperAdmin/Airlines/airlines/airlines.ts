import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  DataTable,
  TableAction,
  TableColumn
} from '../../../../Shared/components/DataTables/data-table/data-table';

import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';

import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';

import { AddAirlineModel, Airline } from '../../Super Admin Models/Airlines Models/airlines-model';
import { AirlinesService } from '../../Super Admin Services/Airlines Services/airlines-service';
import { Button } from "../../../../Shared/components/button/button";
import { DropdownItem, GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';


@Component({
  selector: 'app-airlines',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DataTable,
    forms,
    Button
  ],

  templateUrl: './airlines.html',
  styleUrl: './airlines.scss'
})
export class Airlines implements OnInit, OnDestroy {

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly notification =
    inject(NotificationService);


  constructor(
    private readonly airlineService: AirlinesService,
    private readonly GlobalDropDownService: GlobalDropdownService
  ) { }


  // =========================================================
  // TABLE STATE
  // =========================================================

  loading = false;

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;

  search = '';

  airlines: Airline[] = [];


  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  columns: TableColumn[] = [

    {
      key: 'airlineName',
      label: 'Airline Name',
      type: 'text',
      sortable: true
    },

    {
      key: 'airlineCode',
      label: 'Airline Code',
      type: 'text',
      sortable: true
    },

    {
      key: 'iataCode',
      label: 'IATA',
      type: 'text',
      sortable: true
    },

    {
      key: 'icaoCode',
      label: 'ICAO',
      type: 'text',
      sortable: true
    },

    {
      key: 'countryName',
      label: 'Country',
      type: 'text',
      sortable: true
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status',
      sortable: true
    },

    {
      key: 'createdBy',
      label: 'Created By',
      type: 'text',
      sortable: true
    },

    {
      key: 'createdOn',
      label: 'Created On',
      type: 'text',
      sortable: true
    }

  ];


  // =========================================================
  // TABLE ACTIONS
  // =========================================================

  actions: TableAction[] = [

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


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadAirlines();
  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    console.log(
      '💀 AIRLINES DESTROYED',
      Date.now()
    );

  }


  // =========================================================
  // GET AIRLINES
  // =========================================================

  loadAirlines(): void {

    this.loading = true;


    this.airlineService
      .getAirlines(
        this.search,
        this.pageNumber,
        this.pageSize
      )
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Airlines API Response:',
            response
          );


          if (response?.statusCode === 200) {

            this.airlines =
              response?.data ?? [];


            this.totalRecords =
              response?.totalCount ??
              this.airlines.length;

          }

          else {

            this.airlines = [];

            this.totalRecords = 0;

            this.notification.error(
              response?.message ??
              'Unable to fetch airlines.'
            );

          }

        },


        error: (error: any) => {

          console.error(
            '❌ GET AIRLINES ERROR:',
            error
          );


          this.airlines = [];

          this.totalRecords = 0;


          this.notification.error(
            error?.error?.message ??
            'Unable to fetch airlines.'
          );

        }

      });

  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(search: string): void {

    this.search = search;

    this.pageNumber = 1;

    this.loadAirlines();

  }


  // =========================================================
  // PAGE CHANGE
  // =========================================================

  onPageChange(page: number): void {

    this.pageNumber = page;

    this.loadAirlines();

  }


  // =========================================================
  // PAGE SIZE CHANGE
  // =========================================================

  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.loadAirlines();

  }


  // =========================================================
  // TABLE ACTION
  // =========================================================
  onAction(event: any): void {

    console.log('Airline Action:', event);

  }




















  // Add Airlines
  showAddAirlineForm = false;

  saving = false;

  airlineModel: AddAirlineModel = {
    airlineName: '',
    airlineCode: '',
    iataCode: '',
    icaoCode: '',
    countryId: null,
    logoPath: '',
    isActive: true
  };
  countries: DropdownItem[] = [];

  formFields: FormField[] = [
    {
      key: 'airlineName',
      label: 'Airline Name',
      type: 'text',
      placeholder: 'Enter airline name',
      required: true
    },
    {
      key: 'airlineCode',
      label: 'Airline Code',
      type: 'text',
      placeholder: 'Enter airline code',
      required: true
    },
    {
      key: 'iataCode',
      label: 'IATA Code',
      type: 'text',
      placeholder: 'Enter IATA code',
      required: true
    },
    {
      key: 'icaoCode',
      label: 'ICAO Code',
      type: 'text',
      placeholder: 'Enter ICAO code',
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
      key: 'logoPath',
      label: 'Logo Path',
      type: 'text',
      placeholder: 'Enter logo path'
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'checkbox',
      placeholder: 'Active'
    }
  ];

  formButtons: FormButton[] = [
    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    },
    {
      label: 'Add Airline',
      type: 'submit',
      style: 'primary'
    }
  ];
  openAddAirlineForm(): void {
    this.showAddAirlineForm = true;

    if (!this.countriesLoaded && !this.countriesLoading) {
      this.loadCountries();
    }
  }



  cancelAddAirline(): void {

  this.showAddAirlineForm = false;

  this.airlineModel = {
    airlineName: '',
    airlineCode: '',
    iataCode: '',
    icaoCode: '',
    countryId:
      this.countries.length > 0
        ? this.countries[0].value
        : null,
    logoPath: '',
    isActive: true
  };

}

  addAirline(model: AddAirlineModel): void {

    const payload: AddAirlineModel = {
      airlineName: model.airlineName.trim(),
      airlineCode: model.airlineCode.trim(),
      iataCode: model.iataCode.trim(),
      icaoCode: model.icaoCode.trim(),
      countryId: model.countryId,
      logoPath: model.logoPath?.trim() ?? '',
      isActive: model.isActive
    };

    this.saving = true;

    this.airlineService
      .addAirline(payload)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response: any) => {
          if (response?.statusCode === 200) {

            // 1. Show success notification
            this.notification.success(
              response?.message ??
              'Airline added successfully.'
            );

            // 2. Close form
            this.showAddAirlineForm = false;

            // 3. Reset form model
            this.airlineModel = {
              airlineName: '',
              airlineCode: '',
              iataCode: '',
              icaoCode: '',
              countryId: null,
              logoPath: '',
              isActive: true
            };

            // 4. Automatically call GET API
            this.loadAirlines();

          } else {

            this.notification.error(
              response?.message ??
              'Unable to add airline.'
            );

          }

        },

        error: (error: any) => {

          console.error(
            '❌ ADD AIRLINE ERROR:',
            error
          );

          this.notification.error(
            error?.error?.message ??
            'Unable to add airline.'
          );

        }

      });
  }




  // =========================================================
  // LOAD COUNTRIES DROPDOWN
  // =========================================================

 loadCountries(): void {
  console.log('🌍 LOAD COUNTRIES CALLED');

  if (this.countriesLoaded || this.countriesLoading) {
    return;
  }

  this.countriesLoading = true;

  this.GlobalDropDownService
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

          // API returns Value / Text
          this.countries = (response.data ?? []).map((country: any) => ({
            value: Number(country.Value),
            text: country.Text
          }));

          console.log('🌍 MAPPED COUNTRIES:', this.countries);

          const countryField = this.formFields.find(
            field => field.key === 'countryId'
          );

          if (countryField) {

            countryField.options = this.countries.map(country => ({
              label: country.text,
              value: country.value
            }));

            console.log(
              '🔽 COUNTRY OPTIONS:',
              countryField.options
            );
          }

          this.countriesLoaded = true;

          // Default country
          if (
            this.countries.length > 0 &&
            (
              this.airlineModel.countryId === null ||
              this.airlineModel.countryId === undefined
            )
          ) {
            this.airlineModel = {
              ...this.airlineModel,
              countryId: this.countries[0].value
            };
          }

          // 🔥 VERY IMPORTANT
          this.cdr.detectChanges();

        } else {

          this.countries = [];

          this.notification.error(
            response?.message ?? 'Unable to load countries.'
          );
        }
      },

      error: (error) => {

        console.error('❌ GET COUNTRIES ERROR:', error);

        this.countries = [];

        this.notification.error(
          error?.error?.message ??
          'Unable to load countries.'
        );
      }
    });
}
  countriesLoaded = false;
  countriesLoading = false;

  onFieldChange(event: {
    key: string;
    value: any;
  }): void {

    console.log(
      '📌 PARENT FIELD CHANGE:',
      event
    );

    this.airlineModel = {
      ...this.airlineModel,
      [event.key]: event.value
    };

    console.log(
      '📦 AIRLINE MODEL:',
      this.airlineModel
    );

  }
}