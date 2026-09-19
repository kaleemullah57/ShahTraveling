import { inject, Injectable, Service } from '@angular/core';
import { AddTicketPurchaseRequest, PurchasedInvoiceSearchRequest, UpdatePurchasedInvoicePaymentRequest } from '../../Admin Models/Ticket Inventory Models/inventory-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { Observable } from 'rxjs';
import { ApiResponse, AvailableTicketModel, AvailableTicketsRequest } from '../../Admin Models/Ticket Inventory Models/available-tickets';

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






    // Update Inventory Payment Invoices
    updatePurchasedInvoicePayment(request: UpdatePurchasedInvoicePaymentRequest) {
        return this.api.post<any>(
            `BranchAdmin/UpdatePurchasedInvoicePayment`,
            request
        );
    }






    // Available Tickets
    getAvailableTickets(
        request: AvailableTicketsRequest
    ): Observable<ApiResponse<AvailableTicketModel[]>> {

        return this.api.post<ApiResponse<AvailableTicketModel[]>>(
            'BranchAdmin/GetAvailableTickets',
            request
        );
    }
}
