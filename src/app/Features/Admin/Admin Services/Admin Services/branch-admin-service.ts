import { inject, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
@Service()
export class BranchAdminService {
    private readonly apiService = inject(ApiService);



    getBranchByBranchId(branchId: number) {
  return this.apiService.get(
    `SuperAdminSetup/GetBranchByBranchId/${branchId}`
  );
}
}


