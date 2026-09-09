import { Injectable, Service } from '@angular/core';
import { ApiService } from '../API Services/api-service';
import { Observable } from 'rxjs';


export interface DropdownItem {
    value: number;
    text: string;
}
export interface DropdownResponse {
    statusCode: number;
    status: boolean;
    message: string;
    data: DropdownItem[];
}
@Injectable({
    providedIn: 'root'
})
export class GlobalDropdownService {

    constructor(
        private apiService: ApiService
    ) { }

    getCountries(): Observable<DropdownResponse> {

  return this.apiService.get<DropdownResponse>(
    'DropDown/GetCountries'
  );

}

}
