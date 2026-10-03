import { inject, Injectable, Service } from '@angular/core';
import { CancelBookingPassengerRequest, CustomerBookingApiResponse, CustomerBookingSearchRequest } from '../../Customers Models/Booked Tickets Models/booked-tickets-model';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BookedTicketsService {

    private api = inject(ApiService)
    getCustomerBookings(
        request: CustomerBookingSearchRequest
    ): Observable<CustomerBookingApiResponse> {

        return this.api.post<CustomerBookingApiResponse>(
            `Public/GetCustomerBookings`,
            request
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




    // Get Ticket Confirmed Notifications
    getMyNotifications() {
        return this.api.get<any>(
            `Public/MyNotifications`
        );
    }




    // Read Confirmed Notification
    markNotificationRead(notificationId: number): Observable<any> {
        return this.api.post<any>(
            `Public/MarkNotificationRead`,
            {
                notificationId: notificationId
            }
        );
    }
}
