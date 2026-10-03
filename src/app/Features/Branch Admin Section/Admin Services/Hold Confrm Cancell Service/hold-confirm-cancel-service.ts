import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { PendingHoldBookingResponse } from '../../Admin Models/Hold Confirm Cancel Models/hold-pending-confirm-cancelled-model';
import { Observable } from 'rxjs';
import { CancelBookingPassengerRequest, ConfirmHeldTicketResponse } from '../../../Customer Section/Customers Models/Booked Tickets Models/booked-tickets-model';

@Injectable({
  providedIn: 'root'
})
export class HoldConfirmCancelService {

  private api = inject(ApiService);

  getPendingHoldConfirmBookings(
    search: string,
    pageNumber: number,
    pageSize: number,
    bookingStatus: number
  ): Observable<PendingHoldBookingResponse> {

    const params = {
      Search: search || '',
      PageNumber: pageNumber,
      PageSize: pageSize,
      BookingStatus: bookingStatus
    };

    return this.api.post(
      'BranchAdmin/GetPendingHoldConfirmBookings',
      params
    );
  }







  cancelBookingPassenger(
    request: CancelBookingPassengerRequest
  ): Observable<any> {

    return this.api.post<any>(
      `Public/CancelBookingPassenger`,
      request
    );
  }







  confirmHeldTicket(
    bookingPassengerId: number
  ): Observable<ConfirmHeldTicketResponse> {

    return this.api.post(
      'BranchAdmin/ConfirmHeldTicket',
      {
        bookingPassengerId
      }
    );
  }
}