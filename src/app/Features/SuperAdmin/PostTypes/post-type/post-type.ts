import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import {
  AddPostTypeModel,
  GetPostTypeRequest,
  PostTypeModel
} from '../../Super Admin Models/PostTypeModels/post-type-model';

import { PostTypeService } from '../../Super Admin Services/PostType Services/post-type-service';

import {
  DataTable,
  TableColumn
} from '../../../../Shared/components/DataTables/data-table/data-table';

import { CommonModule } from '@angular/common';
import { FormButton, FormField, forms } from '../../../../Shared/components/Forms/forms/forms';

@Component({
  selector: 'app-post-type',
  standalone: true,
  imports: [
    DataTable,
    CommonModule,
    forms
  ],
  templateUrl: './post-type.html',
  styleUrl: './post-type.scss',
})
export class PostType implements OnInit {

  private readonly postTypeService = inject(PostTypeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationService);

  // ============================================
  // DATA
  // ============================================

  travelTypes: PostTypeModel[] = [];

  loading = false;

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;


  // ============================================
  // COLUMNS
  // ============================================

  columns: TableColumn[] = [

    {
      key: 'postTypeName',
      label: 'Post Type',
      type: 'text'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'status'
    },

    {
      key: 'userName',
      label: 'Created By',
      type: 'text'
    },

    {
      key: 'createdOn',
      label: 'Created On',
      type: 'date'
    }

  ];


  // ============================================
  // INIT
  // ============================================

  ngOnInit(): void {

    this.getTravelTypes();

  }


  // ============================================
  // GET TRAVEL TYPES
  // ============================================

  getTravelTypes(): void {

    this.loading = true;

    const request: GetPostTypeRequest = {

      search: this.search?.trim() || null,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize

    };


    this.postTypeService
      .getTravelTypes(request)
      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          if (response.status === true) {

            this.travelTypes = response.data ?? [];

            this.totalRecords = response.totalCount ?? 0;
          }
          else {

            this.travelTypes = [];

            this.totalRecords = 0;

          }

        },

        error: (error) => {

          console.error(
            'Get Travel Types Error:',
            error
          );

          this.travelTypes = [];

          this.totalRecords = 0;

        }

      });

  }


  // ============================================
  // SEARCH
  // ============================================

  onSearch(searchValue: string): void {

    this.search = searchValue;

    this.pageNumber = 1;

    this.getTravelTypes();

  }


  // ============================================
  // PAGE CHANGE
  // ============================================

  onPageChange(page: number): void {

    this.pageNumber = page;

    this.getTravelTypes();

  }


  // ============================================
  // PAGE SIZE CHANGE
  // ============================================

  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.getTravelTypes();

  }




















  // Add Post Types

  showAddForm = false;
  saving = false;


  postTypeModel: AddPostTypeModel = {
    postTypeName: '',
    isActive: true
  };


  formFields: FormField[] = [

    {
      key: 'postTypeName',
      label: 'Post Type',
      type: 'text'
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
      type: 'reset',
      style: 'secondary'
    },

    {
      label: 'Add Post Type',
      type: 'submit',
      style: 'primary'
    }

  ];


  openAddPostType(): void {

    this.postTypeModel = {

      postTypeName: '',

      isActive: true

    };

    this.showAddForm = true;

  }

  cancelAddPostType(): void {

    this.showAddForm = false;

    this.postTypeModel = {

      postTypeName: '',

      isActive: true

    };

  }


  addPostType(model: AddPostTypeModel): void {

  this.saving = true;

  this.postTypeService
    .addPostType(model)
    .subscribe({

      next: (response) => {

        this.saving = false;

        if (response.status === true) {

          this.notificationService.success(
            response.message
          );

          this.postTypeModel = {
            postTypeName: '',
            isActive: true
          };

          this.showAddForm = false;

          this.getTravelTypes();

          this.cdr.detectChanges();
        }

      },

      error: () => {

        this.saving = false;

        this.cdr.detectChanges();

        // Don't show error here.
        // Global errorInterceptor handles it.
      }

    });

}

}