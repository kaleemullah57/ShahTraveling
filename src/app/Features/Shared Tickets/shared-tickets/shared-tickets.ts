import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { SharedTicketService } from '../../../Core/Services/public Services/Shared Tickets Service/shared-ticket-service';

import {
  TicketRealtimeService,
  TicketUpdatedEvent
} from '../../../Shared/components/TicketRealtimeService/ticket-realtime-service';

import {
  SharedTicketModel,
  SharedTicketsRequest
} from '../../../Core/Models/Public Tickets/shared-ticket-model';

import { DataTable } from '../../../Shared/components/DataTables/data-table/data-table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-tickets',
  standalone: true,
  imports: [DataTable,FormsModule],
  templateUrl: './shared-tickets.html',
  styleUrl: './shared-tickets.scss',
})
export class SharedTickets implements OnInit, OnDestroy {

  private sharedTicketsService = inject(SharedTicketService);
  private ticketRealtimeService = inject(TicketRealtimeService);
  private cdr = inject(ChangeDetectorRef);

  tickets: SharedTicketModel[] = [];

  loading = false;

  totalRecords = 0;

  pageNumber = 1;
  pageSize = 10;

  // Filters
  search = '';

  fromDate: string | null = null;
  toDate: string | null = null;

  fromSellingPrice: number | null = null;
  toSellingPrice: number | null = null;


  // DataTable columns
  columns = [
    { key: 'airlineName', label: 'Airline' },
    { key: 'fromAirport', label: 'From' },
    { key: 'toAirport', label: 'To' },
    { key: 'departureDateTime', label: 'Departure' },
    { key: 'arrivalDateTime', label: 'Arrival' },
    { key: 'availableQuantity', label: 'Available' },
    { key: 'sellingPrice', label: 'Selling Price' },
    { key: 'validUntil', label: 'Valid Until' }
  ];

  actions: any[] = [];


  ngOnInit(): void {

    // Initial data
    this.loadTickets();

    // Start SignalR
    this.ticketRealtimeService.startConnection();

    // Listen for ticket updates
    this.ticketRealtimeService.ticketUpdated$
      .subscribe((event) => {
        this.updateTicket(event);
      });
  }


  loadTickets(): void {

    this.loading = true;

    const request: SharedTicketsRequest = {

      search: this.search,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize,

      fromDate: this.fromDate,

      toDate: this.toDate,

      fromSellingPrice: this.fromSellingPrice,

      toSellingPrice: this.toSellingPrice
    };

    this.sharedTicketsService
      .getSharedTickets(request)
      .subscribe({

        next: (response) => {

          if (response.status === true) {

            this.tickets = response.data ?? [];

            this.totalRecords =
              response.totalCount ?? 0;
          }
          else {

            this.tickets = [];
            this.totalRecords = 0;
          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Get Shared Tickets Error:',
            error
          );

          this.tickets = [];
          this.totalRecords = 0;

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }


  // Search / filter
  applyFilters(): void {

    // Whenever filters change,
    // start from first page.
    this.pageNumber = 1;

    this.loadTickets();
  }


  // Clear filters
  clearFilters(): void {

    this.search = '';

    this.fromDate = null;
    this.toDate = null;

    this.fromSellingPrice = null;
    this.toSellingPrice = null;

    this.pageNumber = 1;

    this.loadTickets();
  }


  // Pagination
  onPageChange(event: any): void {

    this.pageNumber = event.pageNumber;

    this.pageSize = event.pageSize;

    this.loadTickets();
  }


  // Real-time price update
private updateTicket(event: TicketUpdatedEvent): void {
  const index = this.tickets.findIndex(
    x => x.purchaseInvoiceItemId === event.purchaseInvoiceItemId
  );

  if (index === -1) {
    return;
  }

  const currentTicket = this.tickets[index];

  const updatedTicket: SharedTicketModel = {
    ...currentTicket
  };

  // Price update
  if (event.sellingPrice !== undefined) {
    updatedTicket.sellingPrice = event.sellingPrice;
  }

  // Shared quantity update
  if (event.sharedQuantityIncrease !== undefined) {
    updatedTicket.availableQuantity =
      Number(currentTicket.availableQuantity ?? 0) +
      Number(event.sharedQuantityIncrease);
  }

  // Replace the object AND array
  this.tickets = this.tickets.map((ticket, i) =>
    i === index ? updatedTicket : ticket
  );

  this.cdr.detectChanges();
}


  ngOnDestroy(): void {

    this.ticketRealtimeService.stopConnection();
  }
}