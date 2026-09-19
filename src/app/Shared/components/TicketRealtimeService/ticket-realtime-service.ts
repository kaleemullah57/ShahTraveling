import { Injectable, Service } from '@angular/core';


import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';



export interface TicketUpdatedEvent {
  purchaseInvoiceItemId: number;
  sellingPrice: number;

  sharedQuantityIncrease?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketRealtimeService {

  private connection!: signalR.HubConnection;

  private ticketUpdatedSubject =
    new Subject<TicketUpdatedEvent>();

  ticketUpdated$ =
    this.ticketUpdatedSubject.asObservable();

  startConnection(): void {

    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      return;
    }

    this.connection =
      new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7298/hubs/tickets')
        .withAutomaticReconnect()
        .build();

    this.connection.on(
      'TicketUpdated',
      (data: TicketUpdatedEvent) => {
        console.log('🔔 SIGNALR EVENT RECEIVED:', data);
        this.ticketUpdatedSubject.next(data);

      }
    );

    this.connection
      .start()
      .then(() => {
        console.log('Ticket SignalR connected');
      })
      .catch(error => {
        console.error(
          'SignalR connection error:',
          error
        );
      });
  }

  stopConnection(): void {

    if (this.connection) {

      this.connection
        .stop()
        .then(() => {
          console.log('Ticket SignalR disconnected');
        });

    }
  }
}
