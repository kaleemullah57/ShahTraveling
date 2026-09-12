import {
  Component,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormButton,
  FormField,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import { Button } from '../../../../Shared/components/button/button';

import { DataTable, TableColumn, TableAction } from '../../../../Shared/components/DataTables/data-table/data-table';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';

import {
  AddServiceRequest,
  EditServiceRequest,
  ServicesModel
} from '../../Super Admin Models/Services Models/services-model';

import {
  ServicesService
} from '../../Super Admin Services/Services Service/services-service';


@Component({
  selector: 'app-services',
  standalone: true,

  imports: [
    CommonModule,
    forms,
    Button,
    DataTable
  ],

  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services {

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly servicesService =
    inject(ServicesService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  // =========================================================
  // DATA
  // =========================================================

  services: ServicesModel[] = [];

  loading = false;

  saving = false;

  showAddForm = false;


  // =========================================================
  // DATATABLE
  // =========================================================

  columns: TableColumn[] = [

    {
      key: 'serviceName',
      label: 'Service Name',
      type: 'text',
      sortable: true
    },

    {
      key: 'description',
      label: 'Description',
      type: 'text'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status'
    },

    {
      key: 'createdBy',
      label: 'Created By',
      type: 'text'
    },

    {
      key: 'createdOn',
      label: 'Created On',
      type: 'date'
    }

  ];


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


  currentPage = 1;

  pageSize = 10;

  totalRecords = 0;

  search = '';


  // =========================================================
  // FORM MODEL
  // =========================================================

  serviceModel: AddServiceRequest = {

    serviceName: '',

    description: '',

    isActive: true

  };


  // =========================================================
  // FORM FIELDS
  // =========================================================

  formFields: FormField[] = [

    {
      key: 'serviceName',
      label: 'Service Name',
      type: 'text',
      placeholder: 'Enter service name',
      required: true
    },

    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter service description',
      required: false
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }

  ];


  // =========================================================
  // FORM BUTTONS
  // =========================================================

  formButtons: FormButton[] = [

    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    },

    {
      label: 'Add Service',
      type: 'submit',
      style: 'primary'
    }

  ];


  ngOnInit(): void {

    this.loadServices();

  }


  loadServices(): void {

    this.loading = true;

    this.servicesService
      .getServices(
        this.search,
        this.currentPage,
        this.pageSize
      )
      .subscribe({

        next: (response) => {
          this.loading = false;

          if (response.status === true) {

            this.services =
              response.data?.items ?? [];

            this.totalRecords =
              response.data?.totalCount ?? 0;

          }
          else {

            this.services = [];

            this.totalRecords = 0;

          }

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            '❌ GET SERVICES ERROR:',
            error
          );

          this.loading = false;

          this.services = [];

          this.totalRecords = 0;

          this.cdr.detectChanges();

          // Global errorInterceptor handles notification.

        }

      });

  }


  onSearch(search: string): void {

    this.search = search;

    this.currentPage = 1;

    this.loadServices();

  }


  onPageChange(page: number): void {

    this.currentPage = page;

    this.loadServices();

  }


  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.currentPage = 1;

    this.loadServices();

  }



  onActionClick(event: {
    action: TableAction;
    row: ServicesModel;
  }): void {

    switch (event.action.type) {

      case 'edit':

        this.editService(event.row);

        break;


      case 'delete':

        this.deleteService(event.row);

        break;

    }

  }


  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  openAddService(): void {

    this.serviceModel = {

      serviceName: '',

      description: '',

      isActive: true

    };

    this.showAddForm = true;

  }



  cancelAddService(): void {

    this.showAddForm = false;

    this.serviceModel = {

      serviceName: '',

      description: '',

      isActive: true

    };

  }


  addService(
    model: AddServiceRequest
  ): void {


    this.saving = true;

    this.servicesService
      .addService(model)
      .subscribe({

        next: (response) => {
          this.saving = false;

          if (response.status === true) {

            this.notificationService
              .success(response.message);

            this.showAddForm = false;

            this.serviceModel = {

              serviceName: '',

              description: '',

              isActive: true

            };

            // Reload global DataTable
            this.currentPage = 1;

            this.loadServices();

          }

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            '❌ ADD SERVICE ERROR:',
            error
          );

          this.saving = false;

          this.cdr.detectChanges();

          // Global errorInterceptor handles error notification.

        }

      });

  }
















  // Delete Services
  deleteService(
    service: ServicesModel
  ): void {

    if (!service.serviceId) {

      this.notificationService.error(
        'Invalid Service ID'
      );

      return;

    }

    this.servicesService
      .deleteService(service.serviceId)
      .subscribe({

        next: (response) => {

          if (response.status === true) {

            this.notificationService.success(
              response.message
            );

            this.loadServices();

          }

        },


        error: (error) => {
          // Global errorInterceptor handles notification.

        }

      });
  }































  // Edit Services
  editModel: EditServiceRequest = {
    serviceId: 0,
    serviceName: '',
    description: '',
    isActive: true
  };

  showEditForm = false;
  editService(service: ServicesModel): void {

    console.log('✏️ EDIT SERVICE:', service);

    this.editModel = {
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      description: service.description ?? '',
      isActive: service.isActive
    };

    this.showEditForm = true;

  }


  editFormFields: FormField[] = [

    {
      key: 'serviceName',
      label: 'Service Name',
      type: 'text',
      placeholder: 'Enter service name',
      required: true
    },

    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter service description',
      required: false
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }

  ];

  editFormButtons: FormButton[] = [

    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    },

    {
      label: 'Update Service',
      type: 'submit',
      style: 'primary'
    }

  ];

  updateService(model: EditServiceRequest): void {

    console.log('🔥 UPDATE SERVICE:', model);

    this.saving = true;

    this.servicesService
      .editService(model)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ UPDATE SERVICE RESPONSE:',
            response
          );

          this.saving = false;

          if (response.status === true) {

            this.notificationService.success(
              response.message
            );

            this.showEditForm = false;

            this.loadServices();

          }

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            '❌ UPDATE SERVICE ERROR:',
            error
          );

          this.saving = false;

          this.cdr.detectChanges();

        }

      });

  }

  cancelEditService(): void {

    this.showEditForm = false;

    this.editModel = {
      serviceId: 0,
      serviceName: '',
      description: '',
      isActive: true
    };

  }

}