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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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





  bookings: CustomerBooking[] = [];

  isLoading = false;

  totalCount = 0;

  pageNumber = 1;

  pageSize = 10;

  search = '';

  selectedBooking: CustomerBooking | null = null;

  showDetails = false;


 
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



  actions: TableAction[] = [
    {
      type: 'view',
      label: 'View',
      icon: 'fa fa-eye'
    }
  ];



  ngOnInit(): void {

    this.subscribeToRealtimeEvents();

    this.realtimeService.startConnection();

    this.loadBookings();
    this.loadNotifications();
  }



  private subscribeToRealtimeEvents(): void {

    this.realtimeService.ticketInventoryUpdated$
      .subscribe(event => {

        this.loadBookings();
      });


    this.realtimeService.bookingPassengerUpdated$
      .subscribe(event => {

        this.loadBookings();
      });

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

        this.notificationCount =
          this.notifications.length;

        this.loadBookings();

        this.cdr.detectChanges();
      });
  }


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


  onSearch(search: string): void {

    this.search = search;

    this.pageNumber = 1;

    this.loadBookings();
  }


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



async downloadPassengerTicket(
  booking: CustomerBooking,
  passenger: CustomerBookingPassenger
): Promise<void> {

  if (!booking || !passenger) {
    return;
  }

  // Which passenger index is this?
  const index = booking.passengerBookingDetails.findIndex(
    p => p.bookingPassengerId === passenger.bookingPassengerId
  );

  if (index < 0) {
    return;
  }

  const ticketElement = document.getElementById('ticket-' + index);

  if (!ticketElement) {
    return;
  }

  // Temporarily hide the download button inside the captured area
  const footerBtn = ticketElement.querySelector(
    '.individual-ticket-footer'
  ) as HTMLElement | null;

  if (footerBtn) {
    footerBtn.style.display = 'none';
  }

  try {

    // Convert the ticket card into a canvas
    const canvas = await html2canvas(ticketElement, {
      scale: 2,                 // high quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');

    // Create A4 PDF (portrait, millimeters)
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth  = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin    = 10; // mm
    const maxWidth  = pageWidth  - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    // Keep aspect ratio
    const imgWidth  = maxWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // If the ticket is taller than the page, scale it down
    let finalWidth  = imgWidth;
    let finalHeight = imgHeight;

    if (imgHeight > maxHeight) {
      finalHeight = maxHeight;
      finalWidth  = (canvas.width * finalHeight) / canvas.height;
    }

    // Center horizontally
    const x = (pageWidth  - finalWidth)  / 2;
    const y = margin;

    pdf.addImage(
      imgData,
      'PNG',
      x,
      y,
      finalWidth,
      finalHeight,
      undefined,
      'FAST'
    );

    // Build a clean filename
    const fileName =
      `Ticket_${booking.bookingReference}_${passenger.passengerName
        ?.replace(/\s+/g, '_') || 'Passenger'}.pdf`;

    // ⬇️ Real download — no print dialog
    pdf.save(fileName);

  } catch (error) {

    console.error('Ticket download failed:', error);

  } finally {

    // Restore the hidden footer button
    if (footerBtn) {
      footerBtn.style.display = '';
    }
  }
}



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



  viewBooking(
    booking: CustomerBooking
  ): void {

    this.selectedBooking = booking;

    this.showDetails = true;

    this.cdr.detectChanges();
  }



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