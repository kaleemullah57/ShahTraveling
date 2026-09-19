import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GetUsersListRequest, RegisterUserRequest } from '../../Super Admin Models/Register Users/register-user-request';
import { FormField } from '../../../../Shared/components/Forms/forms/forms';
import { FormButton, forms } from '../../../../Shared/components/Forms/forms/forms';
import { RegisterUserService } from '../../Super Admin Services/Register Users Service/register-user-service';
import { GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { finalize } from 'rxjs';
import { Button } from '../../../../Shared/components/button/button';
import { TableColumn, DataTable } from '../../../../Shared/components/DataTables/data-table/data-table';

@Component({
  selector: 'app-register-users',
  imports: [forms, Button, DataTable],
  templateUrl: './register-users.html',
  styleUrl: './register-users.scss',
})
export class RegisterUsers implements OnInit {


  ngOnInit(): void {
    this.loadUsers();
  }

  saving = false;

  showUserForm = false;

  userModel: RegisterUserRequest = {
    userName: '',
    email: '',
    password: '',
    branchId: null,
    userTypeId: 0
  };


  branchOptions: {
    label: string;
    value: number;
  }[] = [];

  userTypeOptions: {
    label: string;
    value: number;
  }[] = [];


  formFields: FormField[] = [

    {
      key: 'userName',
      label: 'User Name',
      type: 'text',
      placeholder: 'Enter user name',
      required: true
    },

    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true
    },

    {
      key: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true
    },

    {
      key: 'branchId',
      label: 'Branch',
      type: 'select',
      placeholder: 'Select Branch',
      required: true,
      options: this.branchOptions
    },

    {
      key: 'userTypeId',
      label: 'User Type',
      type: 'select',
      placeholder: 'Select User Type',
      required: true,
      options: this.userTypeOptions
    }

  ];



  formButtons: FormButton[] = [

    {
      label: 'Create User',
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

    private userService: RegisterUserService,

    private globalDropdownService: GlobalDropdownService,

    private notificationService: NotificationService,

    private cdr: ChangeDetectorRef

  ) { }


  openUserForm(): void {

    this.userModel = {
      userName: '',
      email: '',
      password: '',
      branchId: null,
      userTypeId: 0
    };

    // Clear old dropdown data
    this.branchOptions = [];
    this.userTypeOptions = [];

    // Update form immediately
    this.updateBranchDropdown();
    this.updateUserTypeDropdown();

    // Show form
    this.showUserForm = true;

    // Load dropdowns
    this.loadBranches();
    this.loadUserTypes();

  }


  loadBranches(): void {

    this.globalDropdownService
      .getBranchesDropDown()
      .subscribe({

        next: (response) => {

          if (
            response?.statusCode !== 200 ||
            response?.status !== true
          ) {

            this.branchOptions = [];

            this.updateBranchDropdown();

            this.notificationService.error(
              response?.message ||
              'Unable to load branches.'
            );

            return;
          }

          this.branchOptions =
            (response.data ?? []).map((item: any) => ({

              label: item.Text,

              value: Number(item.Value)

            }));

          this.updateBranchDropdown();

        },

        error: (error) => {

          console.log(
            'LOAD BRANCHES ERROR:',
            error
          );

          this.branchOptions = [];

          this.updateBranchDropdown();

          this.notificationService.error(
            'Unable to load branches.'
          );

        }

      });

  }







  loadUserTypes(): void {

    this.globalDropdownService
      .getUserTypesDropDown()
      .subscribe({

        next: (response) => {

          if (
            response?.statusCode !== 200 ||
            response?.status !== true
          ) {

            this.userTypeOptions = [];

            this.updateUserTypeDropdown();

            this.notificationService.error(
              response?.message ||
              'Unable to load user types.'
            );

            return;
          }

          this.userTypeOptions =
            (response.data ?? [])

              // Only allow Branch Admin and Customer
              .filter((item: any) => {

                const userTypeId = Number(item.Value);

                return (
                  userTypeId === 2 ||
                  userTypeId === 3
                );

              })

              .map((item: any) => ({

                label: item.Text,

                value: Number(item.Value)

              }));

          this.updateUserTypeDropdown();

        },

        error: (error) => {

          console.log(
            'LOAD USER TYPES ERROR:',
            error
          );

          this.userTypeOptions = [];

          this.updateUserTypeDropdown();

          this.notificationService.error(
            'Unable to load user types.'
          );

        }

      });

  }
  private updateUserTypeDropdown(): void {

    this.formFields =
      this.formFields.map(field => {

        if (field.key === 'userTypeId') {

          return {
            ...field,
            options: [
              ...this.userTypeOptions
            ]
          };

        }

        return field;

      });

    this.cdr.detectChanges();

  }


  private updateBranchDropdown(): void {

    this.formFields =
      this.formFields.map(field => {

        if (field.key === 'branchId') {

          return {
            ...field,
            options: [
              ...this.branchOptions
            ]
          };

        }

        return field;

      });

    this.cdr.detectChanges();

  }


  cancelUserForm(): void {

    if (this.saving) {
      return;
    }

    this.showUserForm = false;

    this.userModel = {
      userName: '',
      email: '',
      password: '',
      branchId: 0,
      userTypeId: 0
    };

  }


  registerUser(model: any): void {

    const request: RegisterUserRequest = {

      userName:
        model.userName?.trim() ?? '',

      email:
        model.email?.trim() ?? '',

      password:
        model.password ?? '',

      branchId:
        Number(model.branchId),

      userTypeId:
        Number(model.userTypeId)

    };


    if (!request.userName) {

      this.notificationService.error(
        'User Name is required.'
      );

      return;
    }


    if (!request.email) {

      this.notificationService.error(
        'Email is required.'
      );

      return;
    }


    if (!request.password) {

      this.notificationService.error(
        'Password is required.'
      );

      return;
    }

if (request.userTypeId === 2 && (!request.branchId || request.branchId <= 0)) {
  this.notificationService.error(
    'Please select a branch.'
  );

  return;
}

    if (
      request.userTypeId !== 2 &&
      request.userTypeId !== 3
    ) {

      this.notificationService.error(
        'Please select a valid user type.'
      );

      return;
    }


    this.saving = true;

    this.userService
      .registerUser(request)
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          if (response?.success === true) {

            this.notificationService.success(
              response.message ||
              'User Registered Successfully'
            );

            // Close form
            this.showUserForm = false;

            // Reset form model
            this.userModel = {
              userName: '',
              email: '',
              password: '',
              branchId: null,
              userTypeId: 0
            };

            // Reload users table
            this.loadUsers();

            this.cdr.detectChanges();

            return;
          }

          this.notificationService.error(
            response?.message ||
            'Unable to create user.'
          );

        },

        error: (error) => {

          console.log(
            'REGISTER USER ERROR:',
            error
          );

          this.notificationService.error(
            error?.error?.message ||
            'Unable to create user.'
          );

        }

      });
  }






































  // Get Users List
  users: any[] = [];

  loading = false;

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;




  userColumns: TableColumn[] = [
    {
      key: 'userName',
      label: 'User Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'userType',
      label: 'User Type'
    },
    {
      key: 'branchName',
      label: 'Branch'
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'status'

    },
    {
      key: 'createdOn',
      label: 'Created On'
    }
  ];



  // =========================================================
  // LOAD USERS
  // =========================================================

  loadUsers(): void {

    this.loading = true;

    const request: GetUsersListRequest = {

      pageNumber: this.pageNumber,

      pageSize: this.pageSize,

      search: this.search?.trim() ?? ''

    };

    this.userService
      .getUsersList(request)
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          if (
            response?.success === true ||
            response?.status === true
          ) {

            this.users = (response.data ?? []).map((user: any) => ({
              ...user,
              isActive: user.isActive ? 'Active' : 'Inactive'
            }));

            this.totalRecords =
              Number(
                response.totalCount ??
                response.filterCount ??
                0
              );

            return;
          }

          this.users = [];

          this.totalRecords = 0;

          this.notificationService.error(
            response?.message ||
            'Unable to load users.'
          );

        },

        error: (error) => {

          console.log(
            'GET USERS ERROR:',
            error
          );

          this.users = [];

          this.totalRecords = 0;

          this.notificationService.error(
            error?.error?.message ||
            'Unable to load users.'
          );

        }

      });

  }



  onSearch(searchText: string): void {

    this.search = searchText;

    this.pageNumber = 1;

    this.loadUsers();

  }
  onPageChange(page: number): void {

    this.pageNumber = page;

    this.loadUsers();

  }

  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.loadUsers();

  }
}
