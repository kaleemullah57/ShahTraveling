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


    // Countries Dropdown
    getCountries(): Observable<DropdownResponse> {

        return this.apiService.get<DropdownResponse>(
            'DropDown/GetCountries'
        );

    }




    // Provinces Dropdown
    getProvincesByCountryId(
        countryId: number
    ): Observable<DropdownResponse> {

        return this.apiService.get<DropdownResponse>(
            `DropDown/GetProvincesByCountryId?countryId=${countryId}`
        );
    }



    // Cities Dropdown
    getCitiesByProvinceId(
        provinceId: number
    ): Observable<DropdownResponse> {
        return this.apiService.get<DropdownResponse>(
            `DropDown/GetCitiesByProvinceId?provinceId=${provinceId}`
        );
    }



    // Services DropDown

    getServicesDropDown(search?: string): Observable<any> {

        let endpoint = 'DropDown/GetServicesDropDown';

        if (search?.trim()) {
            endpoint += `?search=${encodeURIComponent(search.trim())}`;
        }

        return this.apiService.get(endpoint);
    }

}
