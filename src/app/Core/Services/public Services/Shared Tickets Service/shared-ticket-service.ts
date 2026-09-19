import { inject, Injectable, Service } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { SharedTicketsRequest } from '../../../Models/Public Tickets/shared-ticket-model';
import { Observable } from 'rxjs';
import { ApiService } from '../../API Services/api-service';


@Injectable({
  providedIn: 'root'
})
export class SharedTicketService {

    private readonly api = inject(ApiService);
    getSharedTickets(
        request: SharedTicketsRequest
    ): Observable<any> {

        return this.api.post<any>(
            `Public/GetSharedTickets`,
            request
        );
    }

}
