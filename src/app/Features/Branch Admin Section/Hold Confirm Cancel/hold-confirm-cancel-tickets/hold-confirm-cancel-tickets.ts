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
import { PendingHoldBooking, PendingHoldBookingPassenger, PendingHoldBookingResponse } from '../../Admin Models/Hold Confirm Cancel Models/hold-pending-confirm-cancelled-model';
import { TicketRealtimeService } from '../../../../Shared/components/TicketRealtimeService/ticket-realtime-service';
import { ConfirmHeldTicketResponse } from '../../../Customer Section/Customers Models/Booked Tickets Models/booked-tickets-model';
import { CustomerNotification } from '../../../Customer Section/Customers Models/Customer Notifications Models/customer-notification';
import { BookedTicketsService } from '../../../Customer Section/Customers services/Booked Tickets Services/booked-tickets-service';

@Component({
  selector: 'app-hold-confirm-cancel-tickets',
  standalone: true,
  imports: [DataTable, CommonModule, FormsModule],
  templateUrl: './hold-confirm-cancel-tickets.html',
  styleUrl: './hold-confirm-cancel-tickets.scss',
})
export class PendingHoldConfirmBookingsComponent implements OnInit {

  private readonly bookedTicketsService = inject(BookedTicketsService);
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
    this.loadNotifications();
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





















  // Confirm Held Tickets
  selectedApprovalPassenger: PendingHoldBookingPassenger | null = null;
  showApproveModal = false;
  isApproving = false;

  approvePassenger(
    passenger: PendingHoldBookingPassenger
  ): void {

    console.log('APPROVE BUTTON CLICKED');
    console.log('Passenger:', passenger);
    console.log('BookingPassengerId:', passenger?.bookingPassengerId);

    if (!passenger?.bookingPassengerId) {
      console.error('Invalid BookingPassengerId');
      return;
    }

    this.selectedApprovalPassenger = passenger;
    this.showApproveModal = true;

    console.log('Approve modal:', this.showApproveModal);

    this.cdr.detectChanges();
  }


  closeApproveModal(): void {

    if (this.isApproving) {
      return;
    }

    this.showApproveModal = false;
    this.selectedApprovalPassenger = null;
  }


  confirmApprovePassenger(): void {

    if (
      !this.selectedApprovalPassenger ||
      !this.selectedApprovalPassenger.bookingPassengerId
    ) {
      return;
    }

    const passenger = this.selectedApprovalPassenger;

    this.isApproving = true;

    this.holdService
      .confirmHeldTicket(passenger.bookingPassengerId)
      .subscribe({

        next: (response: ConfirmHeldTicketResponse) => {

          console.log('CONFIRM APPROVAL RESPONSE:', response);

          if (response?.status && response.data) {

            // Update current passenger immediately
            passenger.bookingStatusId =
              response.data.bookingStatusId;

            passenger.bookingStatus =
              response.data.bookingStatus;

            passenger.approvedDate =
              response.data.approvedDate;

            passenger.approvedById =
              response.data.approvedById;

            passenger.approvedBy =
              response.data.approvedBy;


            // Update parent booking
            if (
              this.selectedBooking &&
              this.selectedBooking.bookingId ===
              response.data.bookingId
            ) {

              this.selectedBooking.bookingStatusId =
                response.data.bookingStatusId;

              this.selectedBooking.bookingStatus =
                response.data.bookingStatus;
            }


            // CLOSE POPUP IMMEDIATELY
            this.showApproveModal = false;
            this.selectedApprovalPassenger = null;
            this.isApproving = false;

            this.cdr.detectChanges();


            // Refresh table AFTER popup is already closed
            this.getPendingHoldConfirmBookings();

            return;
          }


          this.isApproving = false;

          console.error(
            'Confirm ticket failed:',
            response?.message
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'CONFIRM APPROVAL ERROR:',
            error
          );

          this.isApproving = false;

          this.cdr.detectChanges();
        }

      });
  }









  notifications: CustomerNotification[] = [];
  notificationCount = 0;
  showNotifications = false;


  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;

    this.cdr.detectChanges();
  }

  closeNotifications(): void {
    this.showNotifications = false;

    this.cdr.detectChanges();
  }


  openNotification(
    notification: CustomerNotification
  ): void {

    // ==========================================
    // TICKET CONFIRMED
    // ==========================================

    if (
      notification.notificationType ===
      'TicketConfirmed'
    ) {

      if (notification.bookingId) {

        const booking =
          this.bookings.find(
            x =>
              x.bookingId ===
              notification.bookingId
          );

        if (booking) {

          this.viewBooking(booking);

          this.showNotifications = false;

          this.cdr.detectChanges();

          return;
        }

        // Booking is not currently in loaded page.
        // Refresh bookings and then try again.
        this.getPendingHoldConfirmBookings();

        this.showNotifications = false;

        return;
      }
    }

    // ==========================================
    // DEFAULT
    // ==========================================

    console.log(
      'No action configured for notification:',
      notification
    );
  }


  loadNotifications(): void {
    this.bookedTicketsService.getMyNotifications().subscribe({
      next: (response) => {

        if (response?.status && response?.data) {

          this.notifications = response.data;

          this.notificationCount =
            this.notifications.length;

        } else {

          this.notifications = [];
          this.notificationCount = 0;
        }

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load notifications:',
          error
        );

        this.notifications = [];
        this.notificationCount = 0;

        this.cdr.detectChanges();
      }
    });
  }



















  // Read Confirmed Ticket Notifications
  markNotificationAsRead(
    notification: CustomerNotification
  ): void {

    if (!notification?.notificationId) {
      console.error('Invalid notification ID:', notification);
      return;
    }

    this.bookedTicketsService
      .markNotificationRead(notification.notificationId)
      .subscribe({
        next: (response) => {

          console.log(
            'Notification read response:',
            response
          );

          if (response?.status) {

            // Remove notification from UI
            this.notifications =
              this.notifications.filter(
                x =>
                  x.notificationId !==
                  notification.notificationId
              );

            // Update bell count
            this.notificationCount =
              this.notifications.length;

            this.cdr.detectChanges();
          }
        },

        error: (error) => {
          console.error(
            'Failed to mark notification as read:',
            error
          );
        }
      });
  }



  private subscribeToRealtimeEvents(): void {

  // =========================================================
  // TICKET INVENTORY UPDATED
  // =========================================================

  this.readltimeService.ticketInventoryUpdated$
    .subscribe(event => {

      console.log(
        'ADMIN: Inventory updated',
        event
      );

      this.getPendingHoldConfirmBookings();
    });


  // =========================================================
  // BOOKING PASSENGER CANCELLED
  // =========================================================

  this.readltimeService.bookingPassengerCancelled$
    .subscribe(event => {

      console.log(
        'ADMIN: Booking passenger cancelled',
        event
      );

      this.getPendingHoldConfirmBookings();
    });


  // =========================================================
  // NEW BOOKING / NOTIFICATION UPDATED
  // =========================================================

  this.readltimeService.notificationUpdated$
    .subscribe(() => {

      console.log(
        'ADMIN: NotificationUpdated received'
      );

      // Re-fetch notifications from database
      this.loadNotifications();
    });
}
}