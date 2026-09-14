import { inject, Injectable, Service } from '@angular/core';
import { ApiService } from '../../API Services/api-service';
import { BranchServicesResponse, GetBranchServicesRequest } from '../../../Models/BranchServices Model/branch-services-model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PublicBranchServices {


 private readonly api = inject(ApiService);

  getBranchServices(
    request: GetBranchServicesRequest
  ): Observable<BranchServicesResponse> {

    return this.api.post<BranchServicesResponse>(
      'Public/GetBranchServicesForPublic',
      request
    );
  }
}

