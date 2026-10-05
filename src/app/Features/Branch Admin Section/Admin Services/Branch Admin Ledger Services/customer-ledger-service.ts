import { inject, Injectable, Service } from '@angular/core';
import { GetLedgerCustomerBookingsRequest } from '../../Admin Models/Branch Admin Ledger Models/get-or-create-customer-ledger-request';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Injectable({
    providedIn: 'root'
})
export class CustomerLedgerService {


    private apiService = inject(ApiService);

    getCustomerBookings(
        request: GetLedgerCustomerBookingsRequest
    ): Observable<any> {
        return this.apiService.post<any>(
            'BranchAdminLedger/GetCustomerBookings',
            request
        );
    }




    getConfirmedBookingPassengers(request: {
        customerId: number;
        bookingId: number;
    }) {
        return this.apiService.post<any>(
            `BranchAdminLedger/GetConfirmedBookingPassengers`,
            request
        );
    }

}
