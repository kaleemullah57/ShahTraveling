import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { AddProvinceRequest, AddProvinceResponse, ProvinceResponse } from '../../Super Admin Models/Provinces Models/provinces-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Injectable({
    providedIn: 'root'
})
export class ProvincesService {

    constructor(
        private apiService: ApiService
    ) { }



    getProvinces(
        search: string = '',
        pageNumber: number = 1,
        pageSize: number = 20
    ): Observable<ProvinceResponse> {

        const request = {
            search: search,
            pageNumber: pageNumber,
            pageSize: pageSize
        };

        return this.apiService.post<ProvinceResponse>(
            'SuperAdminSetup/GetProvincesList',
            request
        );
    }









    // Add Provinces
    addProvince(
        model: AddProvinceRequest
    ): Observable<AddProvinceResponse> {

        return this.apiService.post<AddProvinceResponse>(
            'SuperAdminSetup/AddProvince',
            model
        );
    }
}
