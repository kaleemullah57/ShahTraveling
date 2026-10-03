import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';


// =========================================================
// TICKET UPDATED
// =========================================================

export interface TicketUpdatedEvent {
  purchaseInvoiceItemId: number;
  sellingPrice?: number;
  sharedQuantityIncrease?: number;
  sharedQuantityDecrease?: number;
}


// =========================================================
// PASSENGER PRICE CHANGED
// =========================================================

export interface PassengerPriceChangedEvent {
  purchaseInvoiceItemId: number;
}


// =========================================================
// TICKET INVENTORY UPDATED
// =========================================================

export interface TicketInventoryUpdatedEvent {
  purchaseInvoiceItemId: number;
}


// =========================================================
// BOOKING PASSENGER CANCELLED
// =========================================================

export interface BookingPassengerCancelledEvent {
  bookingId: number;
  bookingPassengerId: number;
  purchaseInvoiceItemId: number;
  bookingStatusId: number;
  bookingStatus?: string;
  cancellationTypeId: number;
  cancellationTypeName?: string;
}


// =========================================================
// BOOKING PASSENGER UPDATED
// APPROVED / STATUS CHANGE
// =========================================================

export interface BookingPassengerUpdatedEvent {
  bookingPassengerId: number;
  bookingId: number;
  bookingStatusId: number;
  bookingStatus: string;
  approvedDate?: string | null;
  approvedById?: number | null;
  approvedBy?: string | null;
}


// =========================================================
// CUSTOMER NOTIFICATION
// Used for customer-specific notifications
// e.g. TicketCancelled
// =========================================================

export interface CustomerNotificationEvent {

  notificationId: number;

  customerId: number;

  notificationType: string;

  title: string;

  message: string;

  bookingId?: number | null;

  bookingPassengerId?: number | null;

  isRead: boolean;

  createdDate: string;

  readDate?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class TicketRealtimeService {

  private connection?: signalR.HubConnection;


  // =========================================================
  // TICKET UPDATED
  // =========================================================

  private ticketUpdatedSubject =
    new Subject<TicketUpdatedEvent>();

  ticketUpdated$ =
    this.ticketUpdatedSubject.asObservable();


  // =========================================================
  // TICKET INVENTORY UPDATED
  // =========================================================

  private ticketInventoryUpdatedSubject =
    new Subject<TicketInventoryUpdatedEvent>();

  ticketInventoryUpdated$ =
    this.ticketInventoryUpdatedSubject.asObservable();


  // =========================================================
  // PASSENGER PRICE ADDED
  // =========================================================

  private passengerPriceAddedSubject =
    new Subject<PassengerPriceChangedEvent>();

  passengerPriceAdded$ =
    this.passengerPriceAddedSubject.asObservable();


  // =========================================================
  // PASSENGER PRICE UPDATED
  // =========================================================

  private passengerPriceUpdatedSubject =
    new Subject<PassengerPriceChangedEvent>();

  passengerPriceUpdated$ =
    this.passengerPriceUpdatedSubject.asObservable();


  // =========================================================
  // BOOKING PASSENGER CANCELLED
  // =========================================================

  private bookingPassengerCancelledSubject =
    new Subject<BookingPassengerCancelledEvent>();

  bookingPassengerCancelled$ =
    this.bookingPassengerCancelledSubject.asObservable();


  // =========================================================
  // BOOKING PASSENGER UPDATED
  // APPROVED / STATUS CHANGE
  // =========================================================

  private bookingPassengerUpdatedSubject =
    new Subject<BookingPassengerUpdatedEvent>();

  bookingPassengerUpdated$ =
    this.bookingPassengerUpdatedSubject.asObservable();


  // =========================================================
  // CUSTOMER NOTIFICATION
  // Customer-specific notification
  // =========================================================

  private customerNotificationSubject =
    new Subject<CustomerNotificationEvent>();

  customerNotification$ =
    this.customerNotificationSubject.asObservable();


  // =========================================================
  // NOTIFICATION UPDATED
  //
  // Used when backend creates a notification and tells
  // connected clients to refresh notifications from API.
  //
  // Example:
  // NewBooking -> Branch Admin
  // =========================================================

  private notificationUpdatedSubject =
    new Subject<void>();

  notificationUpdated$ =
    this.notificationUpdatedSubject.asObservable();


  // =========================================================
  // START CONNECTION
  // =========================================================

  startConnection(): void {

    // ---------------------------------------------------------
    // Do not create another connection if already active
    // ---------------------------------------------------------

    if (
      this.connection &&
      (
        this.connection.state ===
          signalR.HubConnectionState.Connected ||

        this.connection.state ===
          signalR.HubConnectionState.Connecting ||

        this.connection.state ===
          signalR.HubConnectionState.Reconnecting
      )
    ) {
      return;
    }


    // =========================================================
    // SIGNALR CONNECTION
    // =========================================================

    this.connection =
      new signalR.HubConnectionBuilder()

        .withUrl(
          'https://localhost:7298/hubs/tickets',
          {
            accessTokenFactory: () =>
              localStorage.getItem('token') ?? ''
          }
        )

        .withAutomaticReconnect()

        .build();


    // =========================================================
    // TICKET UPDATED
    // =========================================================

    this.connection.on(
      'TicketUpdated',
      (data: TicketUpdatedEvent) => {

        this.ticketUpdatedSubject.next(data);
      }
    );


    // =========================================================
    // TICKET INVENTORY UPDATED
    // =========================================================

    this.connection.on(
      'TicketInventoryUpdated',
      (event: TicketInventoryUpdatedEvent) => {


        this.ticketInventoryUpdatedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================================================
    // PASSENGER PRICE ADDED
    // =========================================================

    this.connection.on(
      'PassengerPriceAdded',
      (event: PassengerPriceChangedEvent) => {

        this.passengerPriceAddedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================================================
    // PASSENGER PRICE UPDATED
    // =========================================================

    this.connection.on(
      'PassengerPriceUpdated',
      (event: PassengerPriceChangedEvent) => {


        this.passengerPriceUpdatedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================================================
    // BOOKING PASSENGER CANCELLED
    // =========================================================

    this.connection.on(
      'BookingPassengerCancelled',
      (event: BookingPassengerCancelledEvent) => {


        this.bookingPassengerCancelledSubject.next(event);
      }
    );


    // =========================================================
    // BOOKING PASSENGER UPDATED
    // APPROVED / STATUS CHANGE
    // =========================================================

    this.connection.on(
      'BookingPassengerUpdated',
      (event: BookingPassengerUpdatedEvent) => {

        this.bookingPassengerUpdatedSubject.next(event);
      }
    );


    // =========================================================
    // CUSTOMER NOTIFICATION
    //
    // Used for direct customer notifications.
    //
    // Example:
    // Branch Admin cancels ticket
    //       ↓
    // CustomerNotification
    //       ↓
    // Customer
    // =========================================================

    this.connection.on(
      'CustomerNotification',
      (event: CustomerNotificationEvent) => {

        this.customerNotificationSubject.next(event);
      }
    );


    // =========================================================
    // NOTIFICATION UPDATED
    //
    // Used when backend creates a notification and tells
    // the client to reload notifications from API.
    //
    // Example:
    // Customer creates booking
    //       ↓
    // NewBooking notification saved
    //       ↓
    // NotificationUpdated
    //       ↓
    // Branch Admin calls MyNotifications
    // =========================================================

    this.connection.on(
      'NotificationUpdated',
      () => {


        this.notificationUpdatedSubject.next();
      }
    );


    // =========================================================
    // START SIGNALR
    // =========================================================

    this.connection
      .start()

      .then(() => {
      })

      .catch(error => {

        console.error(
          'SignalR connection error:',
          error
        );

      });
  }


  // =========================================================
  // STOP CONNECTION
  // =========================================================

  stopConnection(): void {

    if (!this.connection) {
      return;
    }

    this.connection
      .stop()

      .then(() => {

      })

      .catch(error => {

        console.error(
          'SignalR stop error:',
          error
        );

      });
  }
}