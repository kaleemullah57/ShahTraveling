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
    private readonly airlineService: AirlinesService
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
      type: 'number',
      placeholder: 'Enter country ID',
      required: true
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
  }

  

  cancelAddAirline(): void {
  this.showAddAirlineForm = false;

  this.airlineModel = {
    airlineName: '',
    airlineCode: '',
    iataCode: '',
    icaoCode: '',
    countryId: null,
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


}