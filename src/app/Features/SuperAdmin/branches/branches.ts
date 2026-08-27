import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  DataTable,
  TableColumn,
  TableAction
} from '../../../Shared/components/DataTables/data-table/data-table';

import { ApiService } from '../../../Core/Services/API Services/api-service';
import { finalize } from 'rxjs';
import { AddBranchModel } from '../Super Admin Models/BranchModels/branch-model';
import { FormsModule } from '@angular/forms';
import { FormButton, FormField, forms } from '../../../Shared/components/Forms/forms/forms';
import { NotificationService } from '../../../Core/Services/Notification Services/notification-service';

@Component({
  selector: 'app-branches',
  standalone: true,

  imports: [
    DataTable,
    FormsModule,
    forms

  ],
  templateUrl: './branches.html',
  styleUrl: './branches.scss'
})
export class Branches implements OnInit, OnDestroy {

  private readonly apiService = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);
  // =========================================================
  // TABLE STATE
  // =========================================================

  loading = false;

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;

  search = '';

  branches: any[] = [];


  columns: TableColumn[] = [

    {
      key: 'branchName',
      label: 'Branch Name',
      type: 'text',
      sortable: true
    },

    {
      key: 'location',
      label: 'Location',
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


  // =========================================================
  // TABLE ACTIONS
  // =========================================================

  actions: TableAction[] = [

    // {
    //   type: 'view',
    //   label: 'View',
    //   icon: 'fa fa-eye'
    // },

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
    this.loadBranches();

  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    console.log(
      '💀 BRANCHES DESTROYED',
      Date.now()
    );

  }


  // =========================================================
  // LOAD BRANCHES
  // =========================================================

  loadBranches(): void {
    this.loading = true;

    const startTime = performance.now();


    const request = {
      search: this.search,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };



    this.apiService
      .post<any>(
        'SuperAdminSetup/GetAllBranches',
        request
      )
      .pipe(

        finalize(() => {

          this.loading = false;

          // console.log('🏁 REQUEST FINISHED', {
          //   loading: this.loading,
          //   branches: this.branches.length,
          //   totalRecords: this.totalRecords
          // });

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {
          this.branches =
            response?.data ?? [];

          this.totalRecords =
            response?.recordsTotal ??
            response?.totalRecords ??
            this.branches.length;
        },


        error: (error) => {

          console.error(
            '❌ ADD BRANCH ERROR:',
            error
          );

        }
      });

  }


  onSearch(search: string): void {

    this.search = search;
    this.pageNumber = 1;
    this.loadBranches();

  }


  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadBranches();
  }


  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageNumber = 1;
    this.loadBranches();
  }


  onAction(event: {
    action: TableAction;
    row: any;
  }): void {
    switch (event.action.type) {

      case 'view':
        this.viewBranch(event.row);
        break;

      case 'edit':
        this.editBranch(event.row);
        break;

      case 'delete':
        this.deleteBranch(event.row);
        break;

    }

  }


  private viewBranch(row: any): void {

    console.log(
      '👁 View Branch:',
      row
    );

  }


  // =========================================================
  // EDIT
  // =========================================================

  private editBranch(row: any): void {

    console.log(
      '✏️ Edit Branch:',
      row
    );

  }


  // =========================================================
  // DELETE
  // =========================================================

  private deleteBranch(row: any): void {

    console.log(
      '🗑 Delete Branch:',
      row
    );

  }







showAddBranchForm = false;

openAddBranchForm(): void {
  this.showAddBranchForm = true;
}

cancelAddBranch(): void {
  this.showAddBranchForm = false;
}
  // Add Branches
  branchModel: AddBranchModel = {
    branchName: '',
    location: '',
    isActive: true
  };
  saving = false;

  // Add Branches Object
  addBranch(model: AddBranchModel): void {

    const payload: AddBranchModel = {

      branchName: model.branchName.trim(),

      location: model.location.trim(),

      isActive: model.isActive

    };

    this.saving = false;

      // Hide form
      this.showAddBranchForm = false;


    this.apiService
      .post<any>(
        'SuperAdminSetup/AddBranch',
        payload
      )
      .pipe(

        finalize(() => {

          this.saving = false;
          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          if (response?.success) {

            this.notification.success(
              response?.message ??
              'Branch added successfully.'
            );

            this.branchModel = {

              branchName: '',
              location: '',
              isActive: true

            };

            this.loadBranches();

          }

        },

        error: (error) => {

  console.error(
    '❌ ADD BRANCH ERROR:',
    error
  );

}
      });

  }

  formFields: FormField[] = [

    {
      key: 'branchName',
      label: 'Branch Name',
      type: 'text',
      placeholder: 'Enter branch name',
      required: true
    },

    {
      key: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Enter location',
      required: true
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
      label: 'Add Branch',
      type: 'submit',
      style: 'primary'
    }

  ];
}