import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
   OnChanges,
   SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status';
  sortable?: boolean;
}

export interface TableAction {
  type: 'view' | 'edit' | 'delete'| 'download';
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
export class DataTable implements OnChanges  {
  
  constructor() {
  }
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

get hasActions(): boolean {
  return this.showActions && this.actions?.length > 0;
}
ngOnChanges(changes: SimpleChanges): void {
}

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

  onAction(
    action: TableAction,
    row: any
  ): void {
    this.actionClick.emit({
      action,
      row
    });
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }
    this.pageChange.emit(page);
  }


  changePageSize(event: Event): void {
    const value = Number(
      (event.target as HTMLSelectElement).value
    );
    this.pageSizeChange.emit(value);
  }


 get totalPages(): number {
  const total = this.totalRecords;
  const size = this.pageSize;
  if (!total || !size) {
    return 1;
  }
  return Math.ceil(total / size);
}

get pages(): number[] {
  return Array.from(
    {
      length: this.totalPages
    },
    (_, index) => index + 1
  );
}


getSerialNumber(index: number): number {
  return (
    (this.pageNumber - 1) *
    this.pageSize
  ) + index + 1;
}


  getValue(
    row: any,
    key: string
  ): any {
    return row?.[key];
  }


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