import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HoldConfirmCancelService } from '../../Admin Services/Hold Confrm Cancell Service/hold-confirm-cancel-service';

import { TableColumn, TableAction, DataTable } from '../../../../Shared/components/DataTables/data-table/data-table';
import { PendingHoldBooking, PendingHoldBookingResponse } from '../../Admin Models/Hold Confirm Cancel Models/hold-pending-confirm-cancelled-model';
import { TicketRealtimeService } from '../../../../Shared/components/TicketRealtimeService/ticket-realtime-service';

@Component({
  selector: 'app-hold-confirm-cancel-tickets',
  standalone: true,
  imports: [DataTable, CommonModule, FormsModule],
  templateUrl: './hold-confirm-cancel-tickets.html',
  styleUrl: './hold-confirm-cancel-tickets.scss',
})
export class PendingHoldConfirmBookingsComponent implements OnInit {

  private holdService = inject(HoldConfirmCancelService);
  private readltimeService = inject(TicketRealtimeService)
  private cdr = inject(ChangeDetectorRef);

  // =========================
  // Table
  // =========================

  columns: TableColumn[] = [
    {
      key: 'bookingReference',
      label: 'Booking Reference',
      type: 'text'
    },
    {
      key: 'customerName',
      label: 'Customer',
      type: 'text'
    },
    {
      key: 'airlineName',
      label: 'Airline',
      type: 'text'
    },
    {
      key: 'fromAirport',
      label: 'From',
      type: 'text'
    },
    {
      key: 'toAirport',
      label: 'To',
      type: 'text'
    },
    {
      key: 'quantity',
      label: 'Passengers',
      type: 'number'
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      type: 'number'
    },
    {
      key: 'bookingStatus',
      label: 'Status',
      type: 'status'
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      type: 'date'
    }
  ];

  actions: TableAction[] = [
    {
      label: 'View',
      icon: 'fa fa-eye',
      type: 'view'
    }
  ];

  // =========================
  // Data
  // =========================

  bookings: PendingHoldBooking[] = [];

  // =========================
  // Filters
  // =========================

  search = '';

  // Held = 1
  bookingStatus = 1;

  // =========================
  // Pagination
  // =========================

  pageNumber = 1;
  pageSize = 10;

  totalCount = 0;

  loading = false;

  ngOnInit(): void {
    this.readltimeService.startConnection();
    this.subscribeToRealtimeEvents();
    this.getPendingHoldConfirmBookings();
  }



  getPendingHoldConfirmBookings(): void {

    this.loading = true;

    this.holdService
      .getPendingHoldConfirmBookings(
        this.search,
        this.pageNumber,
        this.pageSize,
        this.bookingStatus
      )
      .subscribe({
        next: (response: PendingHoldBookingResponse) => {

          if (response?.status) {

            this.bookings = response.data ?? [];

            this.totalCount = response.totalCount ?? 0;

          } else {

            this.bookings = [];
            this.totalCount = 0;

          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          this.bookings = [];
          this.totalCount = 0;
          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  // =========================
  // Search
  // =========================

  onSearch(): void {

    this.pageNumber = 1;

    this.getPendingHoldConfirmBookings();
  }

  clearSearch(): void {

    this.search = '';

    this.pageNumber = 1;

    this.getPendingHoldConfirmBookings();
  }

  // =========================
  // Pagination
  // =========================

  onPageChange(page: number): void {

    this.pageNumber = page;

    this.getPendingHoldConfirmBookings();
  }

  onPageSizeChange(size: number): void {

    this.pageSize = size;
    this.pageNumber = 1;

    this.getPendingHoldConfirmBookings();
  }

  // =========================
  // Table Actions
  // =========================

  onTableAction(event: {
    action: TableAction;
    row: PendingHoldBooking;
  }): void {
    if (event.action.type === 'view') {
      this.viewBooking(event.row);
    }
  }



  bookingStatuses = [
    { value: 1, label: 'Held' },
    { value: 2, label: 'Approved' },
    { value: 3, label: 'Rejected' },
    { value: 4, label: 'Cancelled By Customer' },
    { value: 5, label: 'Cancelled By Admin' },
    { value: 6, label: 'Expired' },
    { value: 7, label: 'Ticket Issued' },
    { value: 8, label: 'Cancelled' }
  ];


  onBookingStatusChange(): void {
    this.pageNumber = 1;
    this.getPendingHoldConfirmBookings();

  }




























  selectedBooking: PendingHoldBooking | null = null;
  showBookingDetails = false;

  viewBooking(booking: PendingHoldBooking): void {
    this.selectedBooking = booking;
    this.showBookingDetails = true;

  }

  closeBookingDetails(): void {
    this.showBookingDetails = false;
    this.selectedBooking = null;
  }






























  // =========================
  // Cancel Hold Ticket
  // =========================

  showCancelConfirm = false;
  selectedPassengerForCancel: any = null;
  isCancellingPassenger = false;

  cancelPassenger(passenger: any): void {

    if (!passenger?.bookingPassengerId) {
      return;
    }

    this.selectedPassengerForCancel = passenger;
    this.showCancelConfirm = true;

    this.cdr.detectChanges();
  }

  closeCancelConfirm(): void {

    if (this.isCancellingPassenger) {
      return;
    }

    this.showCancelConfirm = false;
    this.selectedPassengerForCancel = null;

    this.cdr.detectChanges();
  }

  confirmCancelPassenger(): void {

    const passenger = this.selectedPassengerForCancel;

    if (!passenger?.bookingPassengerId) {
      return;
    }

    this.isCancellingPassenger = true;

    const request = {
      bookingPassengerId: passenger.bookingPassengerId,
      cancellationReason: 'Cancelled by Branch Admin'
    };

    this.holdService
      .cancelBookingPassenger(request)
      .subscribe({

        next: (response) => {

          this.isCancellingPassenger = false;

          if (response?.status === true) {

            // Stop loading
            this.isCancellingPassenger = false;

            // Close cancel confirmation
            this.showCancelConfirm = false;
            this.selectedPassengerForCancel = null;

            // Close booking details form/modal
            this.showBookingDetails = false;
            this.selectedBooking = null;

            // Refresh list
            this.getPendingHoldConfirmBookings();

            this.cdr.detectChanges();

            return;
          }

          alert(
            response?.message ||
            'Unable to cancel booking passenger.'
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.isCancellingPassenger = false;

          alert(
            error?.error?.message ||
            'Unable to cancel booking passenger.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // cancelPassenger(passenger: any): void {

  //   if (!passenger?.bookingPassengerId) {
  //     return;
  //   }

  //   const confirmed = confirm(
  //     `Are you sure you want to cancel the ticket for ${passenger.passengerName}?`
  //   );

  //   if (!confirmed) {
  //     return;
  //   }

  //   const request = {
  //     bookingPassengerId: passenger.bookingPassengerId,
  //     cancellationReason: 'Cancelled by Branch Admin'
  //   };


  //   this.holdService
  //     .cancelBookingPassenger(request)
  //     .subscribe({

  //       next: (response) => {
  //         if (response?.status === true) {

  //           // Update this passenger only
  //           passenger.bookingStatusId = 5;
  //           passenger.bookingStatus = 'Cancelled By Admin';

  //           passenger.cancellationType =
  //             response?.data?.cancellationTypeName ||
  //             'Cancelled by Branch Admin';

  //           passenger.cancelledDate = new Date();

  //           passenger.cancellationReason =
  //             request.cancellationReason;

  //           this.cdr.detectChanges();

  //           // Refresh table
  //           this.getPendingHoldConfirmBookings();

  //         } else {

  //           alert(
  //             response?.message ||
  //             'Unable to cancel booking passenger.'
  //           );

  //         }
  //       },

  //       error: (error) => {

  //         alert(
  //           error?.error?.message ||
  //           'Unable to cancel booking passenger.'
  //         );

  //       }
  //     });
  // }









  private subscribeToRealtimeEvents(): void {

    this.readltimeService.ticketInventoryUpdated$
      .subscribe(event => {

        this.getPendingHoldConfirmBookings();
      });


    this.readltimeService.bookingPassengerCancelled$
      .subscribe(event => {

        this.getPendingHoldConfirmBookings();
      });
  }
}