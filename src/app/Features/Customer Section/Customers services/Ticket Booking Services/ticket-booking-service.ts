import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateBookingRequest } from '../../Customers Models/Ticket Booking Models/ticket-booking-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Injectable({
  providedIn: 'root'
})
export class TicketBookingService {

  private api = inject(ApiService);

  createBooking(
    request: CreateBookingRequest
  ): Observable<any> {
    return this.api.post<any>(
      `Public/CreateBooking`,
      request
    );
  }
}