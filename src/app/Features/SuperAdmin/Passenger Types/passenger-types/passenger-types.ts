
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PassengerTypeService } from '../../Super Admin Services/passenger Types Services/passenger-type-serice';

import {
  PassengerType,
  AddPassengerTypeRequest,
  UpdatePassengerTypeRequest
} from '../../Super Admin Models/Passenger Types Models/passenget-type-model';

import {
  FormButton,
  FormField,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import { Button } from '../../../../Shared/components/button/button';

import {
  DataTable,
  TableAction,
  TableColumn
} from '../../../../Shared/components/DataTables/data-table/data-table';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';


@Component({
  selector: 'app-passenger-types',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    forms,
    DataTable,
    Button
  ],

  templateUrl: './passenger-types.html',
  styleUrl: './passenger-types.scss'
})
export class PassengerTypes implements OnInit {

  constructor(
    private passengerTypeService: PassengerTypeService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }


  passengerTypes: PassengerType[] = [];



  loading = false;
  saving = false;



  showForm = false;
  isEditMode = false;

  selectedPassengerType: PassengerType | null = null;


  columns: TableColumn[] = [

    {
      key: 'passengerTypeName',
      label: 'Passenger Type',
      type: 'text'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status'
    },

    {
      key: 'createdAt',
      label: 'Created At',
      type: 'date'
    }

  ];



  actions: TableAction[] = [
    {
      type: 'edit',
      label: 'Edit',
      icon: 'fa fa-edit'
    }
  ];


  formFields: FormField[] = [

    {
      key: 'passengerTypeName',
      label: 'Passenger Type Name',
      type: 'text',
      required: true,
      placeholder: 'Enter passenger type name'
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }

  ];



  formButtons: FormButton[] = [

    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    },

    {
      label: 'Save',
      type: 'submit',
      style: 'primary'
    }

  ];


  formData: any = {

    passengerTypeName: '',
    isActive: true

  };



  ngOnInit(): void {

    this.getPassengerTypes();

  }



  getPassengerTypes(): void {
    this.loading = true;

    this.passengerTypeService
      .getPassengerTypes()
      .subscribe({
        next: (response) => {

          this.passengerTypes = response?.data ?? [];

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(
            '❌ GET PASSENGER TYPES ERROR:',
            error
          );

          this.passengerTypes = [];
          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }



  openAddForm(): void {

    this.isEditMode = false;

    this.selectedPassengerType = null;


    // Reset form data

    this.formData = {

      passengerTypeName: '',
      isActive: true

    };


    // Add mode buttons

    this.formButtons = [

      {
        label: 'Cancel',
        type: 'button',
        style: 'secondary'
      },

      {
        label: 'Save',
        type: 'submit',
        style: 'primary'
      }

    ];


    this.showForm = true;

  }


  openEditForm(
    row: PassengerType
  ): void {

    this.isEditMode = true;

    this.selectedPassengerType = row;


    // Load selected record

    this.formData = {

      passengerTypeId:
        row.passengerTypeId,

      passengerTypeName:
        row.passengerTypeName,

      isActive:
        row.isActive

    };


    // Edit mode buttons

    this.formButtons = [

      {
        label: 'Cancel',
        type: 'button',
        style: 'secondary'
      },

      {
        label: 'Update',
        type: 'submit',
        style: 'primary'
      }

    ];


    this.showForm = true;

  }

  submitForm(data: any): void {

    if (!data?.passengerTypeName?.trim()) {
      return;
    }

    this.saving = true;

    if (this.isEditMode) {

      const request: UpdatePassengerTypeRequest = {
        passengerTypeId: this.selectedPassengerType!.passengerTypeId,
        passengerTypeName: data.passengerTypeName.trim(),
        isActive: data.isActive
      };

      this.passengerTypeService
        .updatePassengerType(request)
        .subscribe({

          next: (response) => {
            this.saving = false;

            if (response?.success === true) {

              this.notificationService.success(
                response.message
              );

              this.closeForm();
              this.getPassengerTypes();
            }

            this.cdr.detectChanges();
          },

          error: (error) => {

            console.error(
              '❌ UPDATE PASSENGER TYPE ERROR:',
              error
            );

            this.saving = false;

            this.cdr.detectChanges();
          }

        });

      return;
    }



    const request: AddPassengerTypeRequest = {
      passengerTypeName: data.passengerTypeName.trim(),
      isActive: data.isActive ?? true
    };

    this.passengerTypeService
      .addPassengerType(request)
      .subscribe({

        next: (response) => {
          this.saving = false;

          if (response?.success === true) {

            this.notificationService.success(
              response.message
            );

            this.closeForm();
            this.getPassengerTypes();
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            '❌ ADD PASSENGER TYPE ERROR:',
            error
          );

          // IMPORTANT: unlock form on 409
          this.saving = false;

          this.cdr.detectChanges();

        }

      });
  }


  closeForm(): void {

    this.showForm = false;

    this.selectedPassengerType = null;


    this.formData = {

      passengerTypeName: '',
      isActive: true

    };


    this.formButtons = [

      {
        label: 'Cancel',
        type: 'button',
        style: 'secondary'
      },

      {
        label: 'Save',
        type: 'submit',
        style: 'primary'
      }

    ];

  }



  actionClick(event: any): void {

    if (
      event?.action?.type === 'edit'
    ) {

      this.openEditForm(
        event.row
      );

    }

  }

}
