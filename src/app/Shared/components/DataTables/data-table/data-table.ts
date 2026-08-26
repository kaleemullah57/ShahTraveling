import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'status' | 'number' | 'date';
  sortable?: boolean;
}

export interface TableAction {
  type: 'view' | 'edit' | 'delete';
  label?: string;
  icon?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable {

  constructor() {
  }
  // =========================================================
  // INPUTS
  // =========================================================
@Input()
columns: TableColumn[] = [];

@Input()
data: any[] = [];

@Input()
loading = false;

@Input()
pageNumber = 1;

@Input()
pageSize = 10;

@Input()
totalRecords = 0;

@Input()
showSearch = true;

@Input()
searchPlaceholder = 'Search...';

@Input()
showActions = true;

@Input()
actions: TableAction[] = [
  {
    type: 'view',
    label: 'View',
    icon: 'fa fa-eye'
  },
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
  // OUTPUTS
  // =========================================================

  @Output()
  searchChange = new EventEmitter<string>();

  @Output()
  pageChange = new EventEmitter<number>();

  @Output()
  pageSizeChange = new EventEmitter<number>();

  @Output()
  actionClick = new EventEmitter<{
    action: TableAction;
    row: any;
  }>();


  // =========================================================
  // SEARCH
  // =========================================================

  searchValue = '';


  onSearch(): void {

    this.searchChange.emit(
      this.searchValue.trim()
    );

  }


  clearSearch(): void {

    this.searchValue = '';

    this.searchChange.emit('');

  }


  // =========================================================
  // ACTION
  // =========================================================

  onAction(
    action: TableAction,
    row: any
  ): void {

    this.actionClick.emit({
      action,
      row
    });

  }


  // =========================================================
  // PAGE
  // =========================================================

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.pageChange.emit(page);

  }


  // =========================================================
  // PAGE SIZE
  // =========================================================

  changePageSize(event: Event): void {

    const value = Number(
      (event.target as HTMLSelectElement).value
    );

    this.pageSizeChange.emit(value);

  }


  // =========================================================
  // TOTAL PAGES
  // =========================================================

 get totalPages(): number {

  const total = this.totalRecords;

  const size = this.pageSize;

  if (!total || !size) {
    return 1;
  }

  return Math.ceil(total / size);

}

// =========================================================
// PAGE NUMBERS
// =========================================================

get pages(): number[] {

  return Array.from(
    {
      length: this.totalPages
    },
    (_, index) => index + 1
  );

}


  // =========================================================
// SERIAL NUMBER
// =========================================================

getSerialNumber(index: number): number {

  return (
    (this.pageNumber - 1) *
    this.pageSize
  ) + index + 1;

}


  // =========================================================
  // VALUE
  // =========================================================

  getValue(
    row: any,
    key: string
  ): any {

    return row?.[key];

  }


  // =========================================================
  // STATUS CLASS
  // =========================================================

  getStatusClass(value: any): string {

    if (
      value === true ||
      value === 1 ||
      value === 'Active' ||
      value === 'active'
    ) {

      return 'status-active';

    }

    return 'status-inactive';

  }


  // =========================================================
  // STATUS TEXT
  // =========================================================

  getStatusText(value: any): string {

    if (
      value === true ||
      value === 1 ||
      value === 'Active' ||
      value === 'active'
    ) {

      return 'Active';

    }

    return 'Inactive';

  }

}