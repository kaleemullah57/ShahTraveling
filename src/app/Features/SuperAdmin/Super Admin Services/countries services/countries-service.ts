import { inject, Service } from '@angular/core';
import { CountryResponse, GetCountriesRequest } from '../../Super Admin Models/CountriesModels/countries-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Service()
export class CountriesService {
  private readonly apiService = inject(ApiService);


  getCountries(request: GetCountriesRequest) {

    return this.apiService.post<CountryResponse>(
      'SuperAdminSetup/GetCountries',
      request
    );
  }
}
