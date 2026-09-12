
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AddBranchServiceRequest,
  BranchService,
  GetBranchServicesRequest
} from '../../Admin Models/Branch Services Models/branch-services-model';

import {
  FormField,
  FormButton,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import {
  BranchServicesService
} from '../../Admin Services/Branch Services Service/branch-services-service';

import {
  NotificationService
} from '../../../../Core/Services/Notification Services/notification-service';

import {
  GlobalDropdownService
} from '../../../../Core/Services/Dropdown Services/global-dropdown-service';

import {
  Button
} from '../../../../Shared/components/button/button';
import { finalize } from 'rxjs';
import { TableAction, TableColumn, DataTable } from '../../../../Shared/components/DataTables/data-table/data-table';


@Component({
  selector: 'app-branch-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    forms,
    Button,
    DataTable
  ],
  templateUrl: './branch-services.html',
  styleUrl: './branch-services.scss',
})
export class BranchServices implements OnInit {

  saving = false;

  showAddBranchServiceForm = false;

  branchServiceModel: AddBranchServiceRequest = {

    serviceId: 0,

    branchServiceName: '',

    isActive: true

  };

  serviceOptions: {
    label: string;
    value: number;
  }[] = [];

  formFields: FormField[] = [

    {
      key: 'serviceId',

      label: 'Service',

      type: 'select',

      placeholder: 'Select Service',

      required: true,

      options: this.serviceOptions
    },


    {
      key: 'branchServiceName',

      label: 'Branch Service Name',

      type: 'text',

      placeholder: 'Enter branch service name',

      required: true
    },


    {
      key: 'isActive',

      label: 'Active',

      type: 'checkbox',

      required: false
    }

  ];

  formButtons: FormButton[] = [

    {
      label: 'Add Service',

      type: 'submit',

      style: 'primary'
    },


    {
      label: 'Cancel',

      type: 'button',

      style: 'secondary'
    }

  ];

  constructor(

    private branchServicesService: BranchServicesService,

    private globalDropdownService: GlobalDropdownService,

    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef

  ) { }


  ngOnInit(): void {
    this.loadBranchServices();
  }

  loadServices(): void {

    this.servicesLoading = true;

    this.globalDropdownService
      .getServicesDropDown()
      .subscribe({

        next: (response) => {

          this.servicesLoading = false;

          if (response?.statusCode !== 200) {

            this.serviceOptions = [];

            this.updateServiceDropdown();

            this.notificationService.error(
              response?.message ||
              'Unable to load services.'
            );

            return;
          }

          this.serviceOptions =
            (response.data ?? []).map(
              (item: any) => ({
                label: item.Text,
                value: Number(item.Value)
              })
            );

          this.updateServiceDropdown();
        },

        error: (error) => {

          this.servicesLoading = false;

          this.serviceOptions = [];

          this.updateServiceDropdown();

          this.notificationService.error(
            error?.error?.message ||
            'Unable to load services.'
          );
        }
      });
  }


  private updateServiceDropdown(): void {

    this.formFields = this.formFields.map(field => {

      if (field.key === 'serviceId') {

        return {
          ...field,
          options: [...this.serviceOptions]
        };

      }

      return field;

    });

    // Force the global form to refresh immediately
    this.cdr.detectChanges();
  }

  servicesLoading = false;
  openAddBranchServiceForm(): void {

    this.branchServiceModel = {
      serviceId: 0,
      branchServiceName: '',
      isActive: true
    };

    this.serviceOptions = [];

    // First show the form
    this.showAddBranchServiceForm = true;

    // Reset dropdown
    this.updateServiceDropdown();

    // Wait until <app-global-form> is rendered
    setTimeout(() => {
      this.loadServices();
    });
  }


  cancelAddBranchService(): void {

    this.branchServiceModel = {
      serviceId: 0,
      branchServiceName: '',
      isActive: true
    };

    this.showAddBranchServiceForm = false;
  }

  addBranchService(model: any): void {

    const request: AddBranchServiceRequest = {
      serviceId: Number(model.serviceId),
      branchServiceName: model.branchServiceName?.trim() ?? '',
      isActive: Boolean(model.isActive)
    };

    // Validation
    if (!request.serviceId) {
      this.notificationService.error(
        'Please select a service.'
      );
      return;
    }

    if (!request.branchServiceName) {
      this.notificationService.error(
        'Branch Service Name is required.'
      );
      return;
    }

    this.saving = true;

    this.branchServicesService
      .addBranchService(request)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (
            response?.status === true &&
            response?.statusCode === 200 &&
            response?.success === true
          ) {

            this.notificationService.success(
              response.message ||
              'Branch Service Added Successfully'
            );

            this.loadBranchServices();
            this.branchServiceModel = {
              serviceId: 0,
              branchServiceName: '',
              isActive: true
            };

            this.showAddBranchServiceForm = false;

            this.cdr.detectChanges();

          } else {

            this.notificationService.error(
              response?.message ||
              'Branch Service could not be added.'
            );

          }
        },
        error: (error) => {
          console.log(
            'ADD BRANCH SERVICE ERROR:',
            error
          );
        }

      });
  }































  onActionClick(event: {
    action: TableAction;
    row: any;
  }): void {

    if (event.action?.type === 'edit') {

      const branchService = event.row as BranchService;

      // Edit implementation later
      return;
    }

    if (event.action?.type === 'delete') {

      const branchService = event.row as BranchService;

      if (!branchService?.branchServiceId) {
        return;
      }

      // Don't delete immediately
      this.selectedBranchServiceId =
        branchService.branchServiceId;

      this.selectedBranchServiceName =
        branchService.branchServiceName || 'this branch service';

      this.showDeleteConfirmation = true;
    }
  }


  // Get Branch Services
  branchServices: BranchService[] = [];

  columns: TableColumn[] = [
    {
      key: 'branchServiceName',
      label: 'Branch Service'
    },
    {
      key: 'serviceName',
      label: 'Service'
    },
    {
      key: 'branchName',
      label: 'Branch'
    },
    {
      key: 'userName',
      label: 'Created By'
    },
    {
      key: 'createdOn',
      label: 'Created On'
    },
    {
      key: 'isActive',
      label: 'Status',
      type:'status'
    }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'fa fa-edit',
      type: 'edit'
    },
    {
      label: 'Delete',
      icon: 'fa fa-trash',
      type: 'delete'
    }
  ];
  loading = false;

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;

  search = '';






  loadBranchServices(): void {

    this.loading = true;

    const request: GetBranchServicesRequest = {
      search: this.search?.trim() || '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.branchServicesService
      .getBranchServices(request)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

       next: (response) => {

  if (
    response?.status === true &&
    response?.statusCode === 200 &&
    response?.success === true
  ) {

    this.branchServices = (response.data ?? []).map(service => ({
      ...service,
      isActive: service.isActive
        ? 'Active'
        : 'Inactive'
    })) as any;

    this.totalRecords = response.totalCount ?? 0;

    return;
  }

  this.branchServices = [];
  this.totalRecords = 0;

  if (response?.statusCode !== 404) {
    this.notificationService.error(
      response?.message ||
      'Unable to load branch services.'
    );
  }
},
        error: (error) => {

          console.log(
            'GET BRANCH SERVICES ERROR:',
            error
          );

          this.branchServices = [];
          this.totalRecords = 0;

          // Don't show notification here.
          // Global errorInterceptor handles HTTP errors.
        }

      });
  }



  onPageChange(event: any): void {

    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;

    this.loadBranchServices();
  }

  // onPageChange(pageNumber: number, pageSize: number): void {

  //   this.pageNumber = pageNumber;
  //   this.pageSize = pageSize;

  //   this.loadBranchServices();
  // }

  onSearch(searchText: string): void {

    this.search = searchText;

    this.pageNumber = 1;

    this.loadBranchServices();
  }



















  // Delete Services
  showDeleteConfirmation = false;
  deleting = false;
  selectedBranchServiceId: number | null = null;
  selectedBranchServiceName = '';
  cancelDelete(): void {

    if (this.deleting) {
      return;
    }

    this.showDeleteConfirmation = false;
    this.selectedBranchServiceId = null;
    this.selectedBranchServiceName = '';
  }

  confirmDelete(): void {
  if (
    !this.selectedBranchServiceId ||
    this.deleting
  ) {
    return;
  }

  this.deleting = true;

  this.branchServicesService
    .deleteBranchService(this.selectedBranchServiceId)
    .subscribe({
      next: (response) => {

        this.deleting = false;

        if (
          response?.status === true &&
          response?.statusCode === 200 &&
          response?.success === true
        ) {

          this.notificationService.success(
            response.message ||
            'Branch Service Deleted Successfully'
          );

          // Hide popup
          this.showDeleteConfirmation = false;

          // Clear selected item
          this.selectedBranchServiceId = null;
          this.selectedBranchServiceName = '';

          // Reload table
          this.loadBranchServices();

          this.cdr.detectChanges();

          return;
        }

        this.notificationService.error(
          response?.message ||
          'Branch Service could not be deleted.'
        );
      },

      error: (error) => {

        this.deleting = false;

        console.log(
          'DELETE BRANCH SERVICE ERROR:',
          error
        );
      }
    });
}
}