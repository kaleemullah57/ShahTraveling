import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FlightRouteTypeService } from '../../Super Admin Services/Flight Route Types Services/flight-route-type-service';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { FlightRouteType, FlightRouteTypeAddRequest, FlightRouteTypeGetRequest, FlightRouteTypeUpdateRequest } from '../../Super Admin Models/Flight Routes Types Models/flight-route-type-model';
import { TableAction, TableColumn, DataTable } from '../../../../Shared/components/DataTables/data-table/data-table';
import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../Shared/components/button/button';

@Component({
  selector: 'app-flight-routes-types',
  standalone: true,
  imports: [CommonModule, FormsModule, forms, DataTable, Button],
  templateUrl: './flight-routes-types.html',
  styleUrl: './flight-routes-types.scss',
})
export class FlightRoutesTypes implements OnInit {

  private readonly service = inject(FlightRouteTypeService);

  private readonly notification =
    inject(NotificationService);

  private readonly cdr =
    inject(ChangeDetectorRef);



  // =====================================================
  // DATA
  // =====================================================

  routeTypes: FlightRouteType[] = [];

  loading = false;

  search = '';

  isActive: boolean | null = true;


  // =====================================================
  // FORM
  // =====================================================

  showForm = false;

  isEditMode = false;

  selectedRouteType: FlightRouteType | null = null;


  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  columns: TableColumn[] = [

    {
      key: 'routeTypeName',
      label: 'Route Type'
    },

    {
      key: 'code',
      label: 'Code'
    },

    {
      key: 'description',
      label: 'Description'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status'
    }

  ];


  // =====================================================
  // TABLE ACTIONS
  // =====================================================

  actions: TableAction[] = [

    {
      type: 'edit',
      label: 'Edit',
      icon: 'fa fa-pencil'
    }

  ];


  // =====================================================
  // FORM FIELDS
  // =====================================================

  fields: FormField[] = [

    {
      key: 'routeTypeName',
      label: 'Route Type Name',
      type: 'text',
      required: true,
      placeholder: 'Enter route type name'
    },

    {
      key: 'code',
      label: 'Code',
      type: 'text',
      required: true,
      placeholder: 'Enter code'
    },

    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter description'
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }

  ];


  // =====================================================
  // FORM BUTTONS
  // =====================================================

  buttons: FormButton[] = [

    {
      label: 'Save',
      type: 'submit'
    },

    {
      label: 'Cancel',
      type: 'button'
    }

  ];


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.getRouteTypes();

  }


  // =====================================================
  // GET
  // =====================================================

  getRouteTypes(): void {

    this.loading = true;

    const request: FlightRouteTypeGetRequest = {

      search: this.search,

      isActive: this.isActive,

      flightRouteTypeId: null

    };


    this.service
      .getFlightRouteTypes(request)
      .subscribe({

        next: (response) => {

          this.loading = false;


          if (response?.statusCode === 200) {

            this.routeTypes =
              response.data ?? [];

          }
          else {

            this.routeTypes = [];

            if (response?.message) {

              this.notification.error(
                response.message
              );

            }

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          this.loading = false;

          this.routeTypes = [];

          this.notification.error(
            error?.error?.message ??
            'Unable to load flight route types.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // SEARCH
  // =====================================================

  onSearch(): void {

    this.getRouteTypes();

  }


  // =====================================================
  // OPEN ADD
  // =====================================================

  openAddForm(): void {

    this.isEditMode = false;

    this.selectedRouteType = null;

    this.showForm = true;


    this.fields = [

      {
        key: 'routeTypeName',
        label: 'Route Type Name',
        type: 'text',
        required: true,
        placeholder: 'Enter route type name'
      },

      {
        key: 'code',
        label: 'Code',
        type: 'text',
        required: true,
        placeholder: 'Enter code'
      },

      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Enter description'
      }

    ];


    this.cdr.detectChanges();

  }


  // =====================================================
  // TABLE ACTION
  // =====================================================

  onActionClick(event: any): void {

    if (event?.action?.type !== 'edit') {

      return;

    }


    const row: FlightRouteType =
      event.row;

    this.openEditForm(row);

  }


  // =====================================================
  // OPEN EDIT
  // =====================================================

  openEditForm(row: FlightRouteType): void {

    this.isEditMode = true;

    this.selectedRouteType = row;


    this.fields = [

      {
        key: 'routeTypeName',
        label: 'Route Type Name',
        type: 'text',
        required: true,
        placeholder: 'Enter route type name'
      },

      {
        key: 'code',
        label: 'Code',
        type: 'text',
        required: true,
        placeholder: 'Enter code'
      },

      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Enter description'
      },

      {
        key: 'isActive',
        label: 'Active',
        type: 'checkbox'
      }

    ];


    this.showForm = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // SUBMIT
  // =====================================================

  onSubmitForm(formValue: any): void {

    if (this.isEditMode) {

      const request: FlightRouteTypeUpdateRequest = {

        flightRouteTypeId:
          this.selectedRouteType!
            .flightRouteTypeId,

        routeTypeName:
          formValue.routeTypeName,

        code:
          formValue.code,

        description:
          formValue.description ?? null,

        isActive:
          formValue.isActive ?? true

      };


      this.updateRouteType(request);

    }
    else {

      const request: FlightRouteTypeAddRequest = {

        routeTypeName:
          formValue.routeTypeName,

        code:
          formValue.code,

        description:
          formValue.description ?? null

      };


      this.addRouteType(request);

    }

  }


  // =====================================================
  // ADD
  // =====================================================

  addRouteType(
    request: FlightRouteTypeAddRequest
  ): void {

    this.service
      .addFlightRouteType(request)
      .subscribe({

        next: (response) => {

          if (response?.statusCode === 200) {

            this.notification.success(
              response.message ??
              'Flight route type added successfully.'
            );

            this.closeForm();

            this.getRouteTypes();

          }
          else {

            this.notification.error(
              response?.message ??
              'Unable to add flight route type.'
            );

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          this.notification.error(
            error?.error?.message ??
            'Unable to add flight route type.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // UPDATE
  // =====================================================

  updateRouteType(
    request: FlightRouteTypeUpdateRequest
  ): void {

    this.service
      .updateFlightRouteType(request)
      .subscribe({

        next: (response) => {

          if (response?.statusCode === 200) {

            this.notification.success(
              response.message ??
              'Flight route type updated successfully.'
            );

            this.closeForm();

            this.getRouteTypes();

          }
          else {

            this.notification.error(
              response?.message ??
              'Unable to update flight route type.'
            );

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          this.notification.error(
            error?.error?.message ??
            'Unable to update flight route type.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.isEditMode = false;

    this.selectedRouteType = null;

    this.cdr.detectChanges();

  }

}


