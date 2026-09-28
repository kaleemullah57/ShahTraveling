import { inject, Injectable, Service } from '@angular/core';
import { CustomerBookingApiResponse, CustomerBookingSearchRequest } from '../../Customers Models/Booked Tickets Models/booked-tickets-model';
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
}
