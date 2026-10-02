import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface TicketUpdatedEvent {
  purchaseInvoiceItemId: number;
  sellingPrice?: number;
  sharedQuantityIncrease?: number;
  sharedQuantityDecrease?: number;
}

export interface PassengerPriceChangedEvent {
  purchaseInvoiceItemId: number;
}

export interface TicketInventoryUpdatedEvent {
  purchaseInvoiceItemId: number;
}

export interface BookingPassengerCancelledEvent {
  bookingId: number;
  bookingPassengerId: number;
  purchaseInvoiceItemId: number;
  bookingStatusId: number;
  bookingStatus?: string;
  cancellationTypeId: number;
  cancellationTypeName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketRealtimeService {

  private connection!: signalR.HubConnection;

  // =========================
  // Ticket Events
  // =========================

  private ticketUpdatedSubject =
    new Subject<TicketUpdatedEvent>();

  ticketUpdated$ =
    this.ticketUpdatedSubject.asObservable();


  // =========================
  // Ticket Inventory Events
  // =========================

  private ticketInventoryUpdatedSubject =
    new Subject<TicketInventoryUpdatedEvent>();

  ticketInventoryUpdated$ =
    this.ticketInventoryUpdatedSubject.asObservable();


  // =========================
  // Passenger Price Events
  // =========================

  private passengerPriceAddedSubject =
    new Subject<PassengerPriceChangedEvent>();

  passengerPriceAdded$ =
    this.passengerPriceAddedSubject.asObservable();


  private passengerPriceUpdatedSubject =
    new Subject<PassengerPriceChangedEvent>();

  passengerPriceUpdated$ =
    this.passengerPriceUpdatedSubject.asObservable();


  // =========================
  // Booking Passenger Cancelled
  // =========================

  private bookingPassengerCancelledSubject =
    new Subject<BookingPassengerCancelledEvent>();

  bookingPassengerCancelled$ =
    this.bookingPassengerCancelledSubject.asObservable();


  // =========================
  // Start Connection
  // =========================

  startConnection(): void {

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

    this.connection =
      new signalR.HubConnectionBuilder()
        .withUrl(
          'https://localhost:7298/hubs/tickets'
        )
        .withAutomaticReconnect()
        .build();


    // =========================
    // Ticket Updated
    // =========================

    this.connection.on(
      'TicketUpdated',
      (data: TicketUpdatedEvent) => {
        this.ticketUpdatedSubject.next(data);
      }
    );


    // =========================
    // Ticket Inventory Updated
    // =========================

    this.connection.on(
      'TicketInventoryUpdated',
      (event: TicketInventoryUpdatedEvent) => {
        this.ticketInventoryUpdatedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================
    // Passenger Price Added
    // =========================

    this.connection.on(
      'PassengerPriceAdded',
      (event: PassengerPriceChangedEvent) => {

        this.passengerPriceAddedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================
    // Passenger Price Updated
    // =========================

    this.connection.on(
      'PassengerPriceUpdated',
      (event: PassengerPriceChangedEvent) => {

        this.passengerPriceUpdatedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================
    // Booking Passenger Cancelled
    // =========================

    this.connection.on(
      'BookingPassengerCancelled',
      (event: BookingPassengerCancelledEvent) => {

        this.bookingPassengerCancelledSubject.next(event);
      }
    );


    // =========================
    // Start
    // =========================

    this.connection
      .start()
      .then(() => {
      })
      .catch(error => {

      });
  }


  // =========================
  // Stop Connection
  // =========================

  stopConnection(): void {

    if (this.connection) {

      this.connection
        .stop()
        .then(() => {
        });

    }
  }
}