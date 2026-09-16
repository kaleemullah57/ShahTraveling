import { inject, Injectable, Service } from '@angular/core';
import { PurchasedInvoiceSearchRequest } from '../../Admin Models/Ticket Inventory Models/inventory-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Injectable({
    providedIn: 'root'
})
export class InventoryServices {
    private api = inject(ApiService);

    getPurchasedInvoices(request: PurchasedInvoiceSearchRequest) {
        return this.api.post(
            'BranchAdmin/GetPurchasedInvoices',
            request
        );
    }
}
