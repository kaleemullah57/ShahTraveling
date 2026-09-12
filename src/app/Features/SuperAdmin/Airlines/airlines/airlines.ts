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

import {
  FormButton,
  FormField,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';

import {
  AddAirlineModel,
  Airline,
  EditAirlineRequest
} from '../../Super Admin Models/Airlines Models/airlines-model';

import { AirlinesService } from '../../Super Admin Services/Airlines Services/airlines-service';

import { Button } from '../../../../Shared/components/button/button';

import {
  DropdownItem,
  GlobalDropdownService
} from '../../../../Core/Services/Dropdown Services/global-dropdown-service';


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
  // TABLE ACTION CLICK
  // =========================================================

  onActionClick(event: {
    action: TableAction;
    row: Airline;
  }): void {

    switch (event.action.type) {

      case 'edit':

        this.editAirline(event.row);

        break;

      case 'delete':

        this.deleteAirline(event.row);

        break;

    }

  }


  // =========================================================
  // ADD AIRLINE
  // =========================================================

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

  countriesLoaded = false;

  countriesLoading = false;


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

    if (
      !this.countriesLoaded &&
      !this.countriesLoading
    ) {

      this.loadCountries();

    }

  }


  cancelAddAirline(): void {

    this.showAddAirlineForm = false;

    this.resetAddModel();

  }


  resetAddModel(): void {

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

      airlineName:
        model.airlineName?.trim() ?? '',

      airlineCode:
        model.airlineCode?.trim() ?? '',

      iataCode:
        model.iataCode?.trim() ?? '',

      icaoCode:
        model.icaoCode?.trim() ?? '',

      countryId:
        model.countryId !== null
          ? Number(model.countryId)
          : null,

      logoPath:
        model.logoPath?.trim() ?? '',

      isActive:
        Boolean(model.isActive)

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

          if (
            response?.statusCode === 200 ||
            response?.status === true
          ) {

            this.notification.success(

              response?.message ??
              'Airline added successfully.'

            );


            // Close form

            this.showAddAirlineForm = false;


            // Reset model

            this.resetAddModel();


            // Refresh table

            this.loadAirlines();

          }

          else {

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


  loadCountries(): void {

    if (this.countriesLoaded || this.countriesLoading) {
      return;
    }

    this.countriesLoading = true;

    this.GlobalDropDownService.getCountries()
      .pipe(
        finalize(() => {
          this.countriesLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response?.statusCode !== 200) {
            this.countries = [];
            this.notification.error(
              response?.message ?? 'Unable to load countries.'
            );
            return;
          }

          // Convert API response
          this.countries = (response.data ?? []).map((country: any) => ({
            value: Number(country.Value),
            text: country.Text
          }));

          // Create dropdown options ONLY ONCE
          const countryOptions = this.countries.map(country => ({
            label: country.text,
            value: country.value
          }));

          // IMPORTANT:
          // Replace the complete field object instead of
          // modifying field.options directly.

          this.formFields = this.formFields.map(field =>
            field.key === 'countryId'
              ? {
                ...field,
                options: [...countryOptions]
              }
              : field
          );

          this.editFormFields = this.editFormFields.map(field =>
            field.key === 'countryId'
              ? {
                ...field,
                options: [...countryOptions]
              }
              : field
          );

          this.countriesLoaded = true;

          // Default country ONLY for Add form
          if (
            this.countries.length > 0 &&
            (this.airlineModel.countryId === null ||
              this.airlineModel.countryId === undefined)
          ) {
            this.airlineModel = {
              ...this.airlineModel,
              countryId: this.countries[0].value
            };
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('❌ GET COUNTRIES ERROR:', error);

          this.countries = [];

          this.notification.error(
            error?.error?.message ?? 'Unable to load countries.'
          );
        }
      });
  }




















  // =========================================================
  // EDIT AIRLINE
  // =========================================================

  showEditForm = false;


  editModel: EditAirlineRequest = {

    airlineId: 0,

    airlineName: '',
    airlineCode: '',
    iataCode: '',
    icaoCode: '',

    countryId: 0,

    isActive: true

  };



  editFormFields: FormField[] = [

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
      key: 'isActive',
      label: 'Status',
      type: 'checkbox',
      placeholder: 'Active'
    }

  ];

  editFormButtons: FormButton[] = [

    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    },

    {
      label: 'Update Airline',
      type: 'submit',
      style: 'primary'
    }

  ];


  editAirline(airline: Airline): void {
    this.editModel = {
      airlineId: Number(airline.airlineId),
      airlineName: airline.airlineName ?? '',
      airlineCode: airline.airlineCode ?? '',
      iataCode: airline.iataCode ?? '',
      icaoCode: airline.icaoCode ?? '',
      countryId: Number(airline.countryId),
      isActive: Boolean(airline.isActive)
    };


    if (this.countriesLoaded) {

      this.showEditForm = true;

      this.cdr.detectChanges();

      return;
    }

    // Countries not loaded yet
    this.loadCountries();

    this.showEditForm = true;

    this.cdr.detectChanges();
  }



  updateAirline(
    model: EditAirlineRequest
  ): void {

    const request: EditAirlineRequest = {

      airlineId:
        Number(model.airlineId),

      airlineName:
        model.airlineName?.trim() ?? '',

      airlineCode:
        model.airlineCode?.trim() ?? '',

      iataCode:
        model.iataCode?.trim() ?? '',

      icaoCode:
        model.icaoCode?.trim() ?? '',

      countryId:
        Number(model.countryId),

      isActive:
        Boolean(model.isActive)

    };

    this.saving = true;


    this.airlineService
      .editAirline(request)
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response: any) => {


          if (
            response?.status === true ||
            response?.statusCode === 200
          ) {

            this.notification.success(

              response?.message ??
              'Airline updated successfully.'

            );


            // Close edit form

            this.showEditForm = false;


            // Reset edit model

            this.resetEditModel();


            // Refresh table

            this.loadAirlines();

          }

          else {

            this.notification.error(

              response?.message ??
              'Unable to update airline.'

            );

          }

        },


        error: (error: any) => {

          console.error(
            '❌ UPDATE AIRLINE ERROR:',
            error
          );


          this.notification.error(

            error?.error?.message ??
            'Unable to update airline.'

          );

        }

      });

  }


  // =========================================================
  // RESET EDIT MODEL
  // =========================================================

  resetEditModel(): void {

    this.editModel = {

      airlineId: 0,

      airlineName: '',

      airlineCode: '',

      iataCode: '',

      icaoCode: '',

      countryId: 0,

      isActive: true

    };

  }


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  cancelEditAirline(): void {

    this.showEditForm = false;

    this.resetEditModel();

  }


  // =========================================================
  // GLOBAL FORM FIELD CHANGE
  // =========================================================


  onFieldChange(event: {
    key: string;
    value: any;
  }): void {

    if (this.showAddAirlineForm) {

      this.airlineModel = {
        ...this.airlineModel,
        [event.key]:
          event.key === 'countryId'
            ? Number(event.value)
            : event.value
      };

      return;
    }

    if (this.showEditForm) {

      this.editModel = {
        ...this.editModel,
        [event.key]:
          event.key === 'countryId'
            ? Number(event.value)
            : event.value
      };
    }
  }




  deleteAirline(airline: Airline): void {

    const airlineId = Number(airline.airlineId);

    if (!airlineId) {
      this.notification.error('Invalid airline ID.');
      return;
    }

    this.airlineService.deleteAirline(airlineId).subscribe({
      next: (response) => {

        if (response?.success) {

          this.notification.success(
            response.message || 'Airline deleted successfully.'
          );

          this.loadAirlines();

        } else {

          this.notification.error(
            response?.message || 'Airline could not be deleted.'
          );
        }
      },

      error: (error) => {

        this.notification.error(
          error?.error?.message ||
          'Unable to delete airline.'
        );
      }
    });
  }



  onTableAction(event: any): void {

  if (event.action === 'edit') {
    this.editAirline(event.row);
  }

  if (event.action === 'delete') {
    this.deleteAirline(event.row);
  }
}
}