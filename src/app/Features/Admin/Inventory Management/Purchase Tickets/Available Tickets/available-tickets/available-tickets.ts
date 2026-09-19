
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { DataTable, TableAction } from '../../../../../../Shared/components/DataTables/data-table/data-table';
import { AvailableTicketModel,AvailableTicketsRequest } from '../../../../Admin Models/Ticket Inventory Models/available-tickets';

import { InventoryServices } from '../../../../Admin Services/Inventory Services/inventory-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../../../Shared/components/button/button';

@Component({
  selector: 'app-available-tickets',
  standalone: true,
  imports: [
    CommonModule,
    DataTable,
    FormsModule,
    Button
],
  templateUrl: './available-tickets.html',
  styleUrl: './available-tickets.scss'
})
export class AvailableTickets implements OnInit {

  private InventoryServices = inject(InventoryServices);
  private cdr = inject(ChangeDetectorRef);

  tickets: AvailableTicketModel[] = [];

  loading = false;

  totalRecords = 0;

  pageNumber = 1;
  pageSize = 10;

  search = '';

  fromDate: string | null = null;
  toDate: string | null = null;

  fromSellingPrice: number | null = null;
  toSellingPrice: number | null = null;


 columns = [
  { key: 'airlineName', label: 'Airline' },
  { key: 'fromAirport', label: 'From' },
  { key: 'toAirport', label: 'To' },
  { key: 'departureDateTime', label: 'Departure' },
  { key: 'arrivalDateTime', label: 'Arrival' },
  { key: 'quantity', label: 'Available' },
  { key: 'sellingPrice', label: 'Selling Price' },
  { key: 'validUntil', label: 'Valid Until' }
];

actions: TableAction[] = [
  {
    type: 'view',
    label: 'View',
    icon: 'fa fa-eye'
  }
];


  ngOnInit(): void {
    this.loadAvailableTickets();
  }


  loadAvailableTickets(): void {

    this.loading = true;

    const request: AvailableTicketsRequest = {
    search: this.search?.trim() || undefined,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize,

      fromDate: this.fromDate,

      toDate: this.toDate,

      fromSellingPrice: this.fromSellingPrice,

      toSellingPrice: this.toSellingPrice

    };


    this.InventoryServices
      .getAvailableTickets(request)
      .subscribe({

        next: (response) => {

          console.log(
            'Available Tickets Response:',
            response
          );

          if (response.status && response.data) {

            this.tickets = response.data;

            this.totalRecords = response.data.length;

          } else {

            this.tickets = [];

            this.totalRecords = 0;

          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Available Tickets Error:',
            error
          );

          this.tickets = [];

          this.totalRecords = 0;

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  onPageChange(event: any): void {

    this.pageNumber = event.pageNumber;

    this.pageSize = event.pageSize;

    this.loadAvailableTickets();
  }


  applyFilters(): void {

    this.pageNumber = 1;

    this.loadAvailableTickets();
  }


  clearFilters(): void {

    this.search = '';

    this.fromDate = null;

    this.toDate = null;

    this.fromSellingPrice = null;

    this.toSellingPrice = null;

    this.pageNumber = 1;

    this.loadAvailableTickets();
  }















  selectedTicket: AvailableTicketModel | null = null;
showViewModal = false;
onActionClick(event: { action: TableAction; row: AvailableTicketModel }): void {
  console.log('ACTION EVENT:', event);

  if (event.action.type === 'view') {
    this.selectedTicket = event.row;
    this.showViewModal = true;

    console.log('Selected Ticket:', this.selectedTicket);
    console.log('Show Modal:', this.showViewModal);

    this.cdr.detectChanges();
  }
}
closeViewModal(): void {

  this.showViewModal = false;
  this.selectedTicket = null;

}

}
