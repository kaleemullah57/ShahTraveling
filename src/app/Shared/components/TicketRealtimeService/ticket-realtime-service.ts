
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

// NEW
export interface TicketInventoryUpdatedEvent {
  purchaseInvoiceItemId: number;
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
    // Existing Ticket Event
    // =========================

    this.connection.on(
      'TicketUpdated',
      (data: TicketUpdatedEvent) => {

        console.log(
          '🔔 TICKET UPDATED:',
          data
        );

        this.ticketUpdatedSubject.next(data);
      }
    );


    // =========================
    // NEW - Inventory Updated
    // =========================

    this.connection.on(
      'TicketInventoryUpdated',
      (event: TicketInventoryUpdatedEvent) => {

        console.log(
          '🔔 TICKET INVENTORY UPDATED:',
          event
        );

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

        console.log(
          '🔥 PASSENGER PRICE ADDED:',
          event
        );

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

        console.log(
          '🔥 PASSENGER PRICE UPDATED:',
          event
        );

        this.passengerPriceUpdatedSubject.next({
          purchaseInvoiceItemId:
            event.purchaseInvoiceItemId
        });
      }
    );


    // =========================
    // Start
    // =========================

    this.connection
      .start()
      .then(() => {

        console.log(
          'Ticket SignalR connected'
        );

      })
      .catch(error => {

        console.error(
          'SignalR connection error:',
          error
        );

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

          console.log(
            'Ticket SignalR disconnected'
          );

        });

    }
  }
}
