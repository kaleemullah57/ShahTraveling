import { inject, Injectable, Service } from '@angular/core';
import { AddTicketPurchaseRequest, PurchasedInvoiceSearchRequest } from '../../Admin Models/Ticket Inventory Models/inventory-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryServices {
    private api = inject(ApiService);


    // Get Purchased Invoices
    getPurchasedInvoices(request: PurchasedInvoiceSearchRequest) {
        return this.api.post(
            'BranchAdmin/GetPurchasedInvoices',
            request
        );
    }




    // Add Tickets To Inventory
    addTicketPurchase(request: AddTicketPurchaseRequest): Observable<any> {
        return this.api.post(
            'BranchAdmin/AddTicketPurchase',
            request
        );
    }

}
