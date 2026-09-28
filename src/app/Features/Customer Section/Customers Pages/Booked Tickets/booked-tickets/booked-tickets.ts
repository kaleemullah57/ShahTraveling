import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BookedTicketsService } from '../../../Customers services/Booked Tickets Services/booked-tickets-service';

import { TicketRealtimeService } from '../../../../../Shared/components/TicketRealtimeService/ticket-realtime-service';

import {
  CustomerBooking,
  CustomerBookingSearchRequest
} from '../../../Customers Models/Booked Tickets Models/booked-tickets-model';

import {
  TableAction,
  TableColumn,
  DataTable
} from '../../../../../Shared/components/DataTables/data-table/data-table';

@Component({
  selector: 'app-booked-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTable
  ],
  templateUrl: './booked-tickets.html',
  styleUrl: './booked-tickets.scss',
})
export class BookedTickets implements OnInit {

  private readonly bookedTicketsService =
    inject(BookedTicketsService);

  private readonly realtimeService =
    inject(TicketRealtimeService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  // =========================================================
  // TABLE
  // =========================================================

  bookings: CustomerBooking[] = [];

  isLoading = false;

  totalCount = 0;

  pageNumber = 1;

  pageSize = 10;

  search = '';


  // =========================================================
  // SELECTED BOOKING
  // =========================================================

  selectedBooking: CustomerBooking | null = null;

  showDetails = false;


  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  columns: TableColumn[] = [
    {
      key: 'bookingReference',
      label: 'Booking Reference',
      type: 'text'
    },
    {
      key: 'createdBy',
      label: 'Customer',
      type: 'text'
    },
    {
      key: 'bookedTickets',
      label: 'Tickets',
      type: 'number'
    },
    {
      key: 'bookingStatus',
      label: 'status',
      type: 'text',
      sortable: true
    },
    {
      key: 'createdDate',
      label: 'Booking Date',
      type: 'date'
    }
  ];


  // =========================================================
  // TABLE ACTIONS
  // =========================================================

  actions: TableAction[] = [
    {
      type: 'view',
      label: 'View',
      icon: 'fa fa-eye'
    }
  ];


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadBookings();

    this.realtimeService.startConnection();

    this.realtimeService.ticketInventoryUpdated$
      .subscribe(() => {
        this.loadBookings();
      });
  }


  // =========================================================
  // LOAD BOOKINGS
  // =========================================================

  loadBookings(): void {

    this.isLoading = true;

    const request: CustomerBookingSearchRequest = {
      search: this.search,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.bookedTicketsService
      .getCustomerBookings(request)
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          if (response?.status && response?.data) {

            this.bookings = response.data;

            this.totalCount =
              response.data.length;

          } else {

            this.bookings = [];

            this.totalCount = 0;
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.isLoading = false;

          this.bookings = [];

          this.totalCount = 0;

          console.error(
            'Error loading customer bookings:',
            error
          );

          this.cdr.detectChanges();
        }

      });
  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(search: string): void {

    this.search = search;

    this.pageNumber = 1;

    this.loadBookings();
  }


  // =========================================================
  // PAGE CHANGE
  // =========================================================

  onPageChange(page: number): void {

    this.pageNumber = page;

    this.loadBookings();
  }


  // =========================================================
  // TABLE ACTION
  // =========================================================

onTableAction(event: {
  action: TableAction;
  row: CustomerBooking;
}): void {

  console.log('TABLE ACTION EVENT:', event);

  if (event.action.type === 'view') {

    console.log('BOOKING:', event.row);

    this.viewBooking(event.row);
  }
}


  // =========================================================
  // VIEW BOOKING
  // =========================================================

  viewBooking(booking: CustomerBooking): void {

    this.selectedBooking = booking;

    this.showDetails = true;

    this.cdr.detectChanges();
  }


  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  closeDetails(): void {

    this.showDetails = false;

    this.selectedBooking = null;

    this.cdr.detectChanges();
  }


  onPageSizeChange(size: number): void {

  this.pageSize = size;

  this.pageNumber = 1;

  this.loadBookings();
}
}