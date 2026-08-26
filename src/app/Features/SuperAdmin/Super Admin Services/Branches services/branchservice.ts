import { inject, Service } from '@angular/core';
import { GetBranchesRequest } from '../../Super Admin Models/BranchModels/get-branches-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../Core/Models/API Response/api-response';
import { BranchModel } from '../../Super Admin Models/BranchModels/branch-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Service()
export class Branchservice {

    private readonly apiService = inject(ApiService);

    getAllBranches(
        request: GetBranchesRequest
    ): Observable<ApiResponse<BranchModel[]>> {
        return this.apiService.post<ApiResponse<BranchModel[]>>(
            'SuperAdminSetup/GetAllBranches',
            request
        );
    }
}
