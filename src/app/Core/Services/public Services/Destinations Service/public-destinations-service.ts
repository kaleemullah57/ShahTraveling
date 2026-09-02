import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PublicDestinationResponse } from '../../../Models/Public Destinations Model/public-destinations-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicDestinationsService {
    
  private readonly http = inject(HttpClient);

  private readonly apiUrl =`${environment.apiUrl}/Public/GetPublicDestinations`;

  getPublicDestinations(
    search?: string
  ): Observable<PublicDestinationResponse> {

    let params = new HttpParams();

    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get<PublicDestinationResponse>(
      this.apiUrl,
      { params }
    );
  }
}
