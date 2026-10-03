import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BookedTicketsService } from '../../../Customers services/Booked Tickets Services/booked-tickets-service';

import { BookingPassengerCancelledEvent, BookingPassengerUpdatedEvent } from '../../../../../Shared/components/TicketRealtimeService/ticket-realtime-service';

import { TicketRealtimeService } from '../../../../../Shared/components/TicketRealtimeService/ticket-realtime-service';

import {
  CancelBookingPassengerRequest,
  CustomerBooking,
  CustomerBookingPassenger,
  CustomerBookingSearchRequest
} from '../../../Customers Models/Booked Tickets Models/booked-tickets-model';

import {
  TableAction,
  TableColumn,
  DataTable
} from '../../../../../Shared/components/DataTables/data-table/data-table';
import { Subject } from 'rxjs';
import { CustomerNotification } from '../../../Customers Models/Customer Notifications Models/customer-notification';

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

  private readonly bookedTicketsService = inject(BookedTicketsService);

  private readonly realtimeService = inject(TicketRealtimeService);

  private bookingPassengerUpdatedSubject = new Subject<BookingPassengerUpdatedEvent>();

  bookingPassengerUpdated$ = this.bookingPassengerUpdatedSubject.asObservable();
  private readonly cdr = inject(ChangeDetectorRef);





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
      label: 'Status',
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

    this.subscribeToRealtimeEvents();

    this.realtimeService.startConnection();

    this.loadBookings();
    this.loadNotifications();
  }


  // =========================================================
  // REALTIME EVENTS
  // =========================================================

  private subscribeToRealtimeEvents(): void {

    // =========================================================
    // INVENTORY UPDATED
    // =========================================================

    this.realtimeService.ticketInventoryUpdated$
      .subscribe(event => {

        this.loadBookings();
      });


    // =========================================================
    // BOOKING PASSENGER UPDATED
    // APPROVED / STATUS CHANGE
    // =========================================================

    this.realtimeService.bookingPassengerUpdated$
      .subscribe(event => {

        this.loadBookings();
      });


    // =========================================================
    // CUSTOMER NOTIFICATION
    // =========================================================




    this.realtimeService.customerNotification$
      .subscribe(event => {


        const notification: CustomerNotification = {
          notificationId: event.notificationId,
          customerId: event.customerId,

          notificationType: event.notificationType,

          title: event.title,
          message: event.message,

          bookingId: event.bookingId,
          bookingPassengerId: event.bookingPassengerId,

          isRead: event.isRead,

          createdDate: event.createdDate,

          readDate: null
        };

        // =====================================================
        // PREVENT DUPLICATE NOTIFICATION
        // =====================================================

        const alreadyExists =
          this.notifications.some(
            x =>
              x.notificationId ===
              notification.notificationId
          );

        if (!alreadyExists) {

          this.notifications.unshift(
            notification
          );
        }

        // =====================================================
        // UPDATE NOTIFICATION COUNT
        // =====================================================

        this.notificationCount =
          this.notifications.length;

        // =====================================================
        // REFRESH BOOKINGS
        // =====================================================

        this.loadBookings();

        this.cdr.detectChanges();
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

          if (
            response?.status &&
            response?.data
          ) {

            this.bookings =
              response.data;

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
  // PAGE SIZE
  // =========================================================

  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.loadBookings();
  }


  // =========================================================
  // TABLE ACTION
  // =========================================================

  onTableAction(event: {
    action: TableAction;
    row: CustomerBooking;
  }): void {

    if (
      event.action.type === 'view'
    ) {

      this.viewBooking(event.row);
    }
  }


  // =========================================================
  // VIEW BOOKING
  // =========================================================

  viewBooking(
    booking: CustomerBooking
  ): void {

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


  // =========================================================
  // CANCEL PASSENGER
  // =========================================================

  showCancelModal = false;

  selectedPassenger:
    CustomerBookingPassenger | null = null;

  cancellationReason = '';

  isCancelling = false;


  openCancelModal(
    passenger: CustomerBookingPassenger
  ): void {

    // Customer can cancel ONLY Held passenger
    if (
      passenger.passengerBookingStatus !==
      'Held'
    ) {
      return;
    }

    this.selectedPassenger =
      passenger;

    this.cancellationReason = '';

    this.showCancelModal = true;

    this.cdr.detectChanges();
  }


  closeCancelModal(): void {

    if (this.isCancelling) {
      return;
    }

    this.showCancelModal = false;

    this.selectedPassenger = null;

    this.cancellationReason = '';

    this.cdr.detectChanges();
  }


  cancelTicket(): void {

    if (!this.selectedPassenger) {
      return;
    }

    if (
      !this.selectedPassenger
        .bookingPassengerId ||
      this.selectedPassenger
        .bookingPassengerId <= 0
    ) {
      return;
    }

    this.isCancelling = true;

    const request:
      CancelBookingPassengerRequest = {

      bookingPassengerId:
        this.selectedPassenger
          .bookingPassengerId,

      cancellationReason:
        this.cancellationReason
          ?.trim() || undefined
    };


    this.bookedTicketsService
      .cancelBookingPassenger(request)
      .subscribe({

        next: (response) => {

          this.isCancelling = false;

          if (response?.status) {

            this.showCancelModal = false;

            this.selectedPassenger = null;

            this.cancellationReason = '';

            /*
             * Do not depend on this reload for
             * realtime functionality.
             *
             * The SignalR event will also
             * trigger loadBookings().
             */
            this.loadBookings();

            this.cdr.detectChanges();

          } else {
            this.cdr.detectChanges();
          }
        },

        error: (error) => {

          this.isCancelling = false;

          this.cdr.detectChanges();
        }
      });
  }

















  // Load Notifications

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


  // markNotificationAsRead(
  //   notification: CustomerNotification
  // ): void {

  //   if (!notification.notificationId) {
  //     return;
  //   }

  //   this.bookedTicketsService
  //     .markNotificationRead(notification.notificationId)
  //     .subscribe({

  //       next: (response) => {

  //         if (response?.status) {

  //           this.notifications =
  //             this.notifications.filter(
  //               x =>
  //                 x.notificationId !==
  //                 notification.notificationId
  //             );

  //           this.notificationCount =
  //             this.notifications.length;

  //           this.cdr.detectChanges();
  //         }
  //       },

  //       error: (error) => {

  //         console.error(
  //           'Failed to close notification:',
  //           error
  //         );
  //       }
  //     });
  // }


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

      this.loadBookings();

      this.showNotifications = false;

      return;
    }
  }


  // ==========================================
  // TICKET CANCELLED
  // ==========================================

  if (
    notification.notificationType ===
    'TicketCancelled'
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

      // Booking may not currently be
      // available in the loaded page.
      this.loadBookings();

      this.showNotifications = false;

      return;
    }
  }

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
}