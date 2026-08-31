import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject
} from '@angular/core';

import { finalize } from 'rxjs';

import {
  AddPostCategoryModel,
  GetPostCategoryRequest,
  GetPostCategoryModel
} from '../../Super Admin Models/Post Categories Models/post-category-model'

import {
  PostCategoryService
} from '../../Super Admin Services/Post Category Services/post-category-service';

import {
  DataTable,
  TableColumn
} from '../../../../Shared/components/DataTables/data-table/data-table';

import {
  FormButton,
  FormField,
  forms
} from '../../../../Shared/components/Forms/forms/forms';

import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';

@Component({
  selector: 'app-post-category',
  standalone: true,

  imports: [
    DataTable,
    CommonModule,
    forms
  ],

  templateUrl: './post-category.html',
  styleUrl: './post-category.scss'
})
export class PostCategory implements OnInit {

  // ============================================
  // SERVICES
  // ============================================

  private readonly postCategoryService = inject(PostCategoryService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly notificationService = inject(NotificationService);


  // ============================================
  // DATA
  // ============================================

  postCategories: GetPostCategoryModel[] = [];

  loading = false;

  search = '';

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;


  // ============================================
  // ADD FORM
  // ============================================

  showAddForm = false;

  saving = false;


  // ============================================
  // ADD POST CATEGORY MODEL
  // ============================================

  postCategoryModel: AddPostCategoryModel = {

    categoryName: '',

    description: '',

    isActive: true

  };


  // ============================================
  // TABLE COLUMNS
  // ============================================

  columns: TableColumn[] = [

    {
      key: 'categoryName',
      label: 'Category Name',
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
  // FORM FIELDS
  // ============================================

  formFields: FormField[] = [

    {
      key: 'categoryName',
      label: 'Category Name',
      type: 'text'
    },

    {
      key: 'description',
      label: 'Description',
      type: 'text'
    },

    {
      key: 'isActive',
      label: 'Active',
      type: 'checkbox'
    }

  ];


  // ============================================
  // FORM BUTTONS
  // ============================================

  formButtons: FormButton[] = [

    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    },

    {
      label: 'Add Category',
      type: 'submit',
      style: 'primary'
    }

  ];


  // ============================================
  // INIT
  // ============================================

  ngOnInit(): void {

    this.getPostCategories();

  }


  // ============================================
  // GET POST CATEGORIES
  // ============================================

  getPostCategories(): void {

    this.loading = true;

    const request: GetPostCategoryRequest = {

      search: this.search?.trim() || null,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize

    };


    this.postCategoryService

      .getPostCategories(request)

      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (response) => {

          if (response.status === true) {

            this.postCategories =
              response.data ?? [];

            this.totalRecords =
              response.totalCount ?? 0;

          }

          else {

            this.postCategories = [];

            this.totalRecords = 0;

          }

        },

        error: (error) => {

          console.error(
            'Get Post Categories Error:',
            error
          );

          this.postCategories = [];

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

    this.getPostCategories();

  }


  // ============================================
  // PAGE CHANGE
  // ============================================

  onPageChange(page: number): void {

    this.pageNumber = page;

    this.getPostCategories();

  }


  // ============================================
  // PAGE SIZE CHANGE
  // ============================================

  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.getPostCategories();

  }


  // ============================================
  // OPEN ADD FORM
  // ============================================

  openAddPostCategory(): void {

    this.postCategoryModel = {

      categoryName: '',

      description: '',

      isActive: true

    };

    this.showAddForm = true;

  }


  // ============================================
  // CANCEL ADD FORM
  // ============================================

  cancelAddPostCategory(): void {

    this.showAddForm = false;

    this.postCategoryModel = {

      categoryName: '',

      description: '',

      isActive: true

    };

  }


  // ============================================
  // ADD POST CATEGORY
  // ============================================

  addPostCategory(
    model: AddPostCategoryModel
  ): void {

    this.saving = true;

    this.postCategoryService

      .addPostCategory(model)

      .subscribe({

        next: (response) => {

          this.saving = false;

          if (response.status === true) {

            // Show success notification
            this.notificationService.success(
              response.message
            );

            this.postCategoryModel = {

              categoryName: '',

              description: '',

              isActive: true

            };

            this.showAddForm = false;

            // Refresh table
            this.getPostCategories();

            this.cdr.detectChanges();

          }

        },

        error: () => {

          this.saving = false;

          this.cdr.detectChanges();

          // Don't show error here.
          // Global errorInterceptor handles API errors.

        }

      });

  }
}