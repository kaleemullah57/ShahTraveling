import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

import {
    AddSharedTicketPassengerPriceRequest,
    UpdateSharedTicketPassengerPriceRequest
} from '../../Admin Models/PassengerTypeTicketPrice/passenger-type-price-model';

@Injectable({
    providedIn: 'root'
})
export class PassengerTicketPriceService {

    private api = inject(ApiService);

    addSharedTicketPassengerPrice(
        request: AddSharedTicketPassengerPriceRequest
    ) {
        return this.api.post<any>(
            `BranchAdmin/AddSharedTicketPassengerPrice`,
            request
        );
    }

    updateSharedTicketPassengerPrice(
        request: UpdateSharedTicketPassengerPriceRequest
    ) {
        return this.api.post<any>(
            `BranchAdmin/UpdateSharedTicketPassengerPrice`,
            request
        );
    }

    getSharedTicketPassengerPrices(
        purchaseInvoiceItemId: number
    ) {
        return this.api.get<any>(
            `BranchAdmin/GetSharedTicketPassengerPrices?PurchaseInvoiceItemId=${purchaseInvoiceItemId}`
        );
    }
}