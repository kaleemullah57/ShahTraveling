import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FlightTypeService } from '../../Super Admin Services/Flight Types Services/flight-type-service';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { FlightJourneyType, FlightJourneyTypeAddRequest, FlightJourneyTypeGetRequest, FlightJourneyTypeUpdateRequest } from '../../Super Admin Models/Flight Types Models/flight-types-model';
import { TableAction, TableColumn, DataTable } from '../../../../Shared/components/DataTables/data-table/data-table';
import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../Shared/components/button/button';

@Component({
  selector: 'app-flight-types',
  standalone:true,
  imports: [CommonModule, FormsModule, forms, DataTable, Button],
  templateUrl: './flight-types.html',
  styleUrl: './flight-types.scss',
})
export class FlightTypes implements OnInit {
  
  private readonly service = inject(FlightTypeService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);



  ngonint(): void {
  this.getJourneyTypes();
}

  journeyTypes: FlightJourneyType[] = [];

  loading = false;

  search = '';

  isActive: boolean | null = true;

  showForm = false;

  isEditMode = false;

  selectedJourneyType: FlightJourneyType | null = null;

  columns: TableColumn[] = [
    {
      key: 'journeyTypeName',
      label: 'Journey Type'
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

  actions: TableAction[] = [
    {
      type: 'edit',
      label: 'Edit',
      icon: 'fa fa-pencil'
    }
  ];

  fields: FormField[] = [
    {
      key: 'journeyTypeName',
      label: 'Journey Type Name',
      type: 'text',
      required: true,
      placeholder: 'Enter journey type name'
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

  // --------------------------------------------------
  // Init
  // --------------------------------------------------

  ngOnInit(): void {
    this.getJourneyTypes();
  }

  // --------------------------------------------------
  // Get
  // --------------------------------------------------

  getJourneyTypes(): void {

    this.loading = true;

    const request: FlightJourneyTypeGetRequest = {
      search: this.search,
      isActive: this.isActive,
      flightJourneyTypeId: null
    };

    this.service.getFlightJourneyTypes(request)
      .subscribe({
        next: (response) => {

          this.loading = false;

          if (response?.statusCode === 200) {

            this.journeyTypes = response.data ?? [];

          } else {

            this.journeyTypes = [];

            if (response?.message) {
              this.notification.error(response.message);
            }
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.loading = false;
          this.journeyTypes = [];

          this.notification.error(
            error?.error?.message ??
            'Unable to load flight journey types.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  onSearch(): void {
    this.getJourneyTypes();
  }

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  openAddForm(): void {

    this.isEditMode = false;
    this.selectedJourneyType = null;

    this.showForm = true;

    this.fields = [
      {
        key: 'journeyTypeName',
        label: 'Journey Type Name',
        type: 'text',
        required: true,
        placeholder: 'Enter journey type name'
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

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  onActionClick(event: any): void {

    if (event?.action?.type !== 'edit') {
      return;
    }

    const row: FlightJourneyType = event.row;

    this.openEditForm(row);
  }

  openEditForm(row: FlightJourneyType): void {

    this.isEditMode = true;

    this.selectedJourneyType = row;

    this.fields = [
      {
        key: 'journeyTypeName',
        label: 'Journey Type Name',
        type: 'text',
        required: true,
        placeholder: 'Enter journey type name'
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

  // --------------------------------------------------
  // Form Submit
  // --------------------------------------------------

  onSubmitForm(formValue: any): void {

    if (this.isEditMode) {

      const request: FlightJourneyTypeUpdateRequest = {
        flightJourneyTypeId:
          this.selectedJourneyType!.flightJourneyTypeId,

        journeyTypeName:
          formValue.journeyTypeName,

        code:
          formValue.code,

        description:
          formValue.description ?? null,

        isActive:
          formValue.isActive ?? true
      };

      this.updateJourneyType(request);

    } else {

      const request: FlightJourneyTypeAddRequest = {
        journeyTypeName:
          formValue.journeyTypeName,

        code:
          formValue.code,

        description:
          formValue.description ?? null
      };

      this.addJourneyType(request);
    }
  }

  // --------------------------------------------------
  // Add API
  // --------------------------------------------------

  addJourneyType(
    request: FlightJourneyTypeAddRequest
  ): void {

    this.service.addFlightJourneyType(request)
      .subscribe({
        next: (response) => {

          if (response?.statusCode === 200) {

            this.notification.success(
              response.message ??
              'Flight journey type added successfully.'
            );

            this.closeForm();

            this.getJourneyTypes();

          } else {

            this.notification.error(
              response?.message ??
              'Unable to add flight journey type.'
            );
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.notification.error(
            error?.error?.message ??
            'Unable to add flight journey type.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // --------------------------------------------------
  // Update API
  // --------------------------------------------------

  updateJourneyType(
    request: FlightJourneyTypeUpdateRequest
  ): void {

    this.service.updateFlightJourneyType(request)
      .subscribe({
        next: (response) => {

          if (response?.statusCode === 200) {

            this.notification.success(
              response.message ??
              'Flight journey type updated successfully.'
            );

            this.closeForm();

            this.getJourneyTypes();

          } else {

            this.notification.error(
              response?.message ??
              'Unable to update flight journey type.'
            );
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.notification.error(
            error?.error?.message ??
            'Unable to update flight journey type.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // --------------------------------------------------
  // Close Form
  // --------------------------------------------------

  closeForm(): void {

    this.showForm = false;

    this.isEditMode = false;

    this.selectedJourneyType = null;

    this.cdr.detectChanges();
  }
}
