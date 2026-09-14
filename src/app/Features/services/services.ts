import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Button } from "../../Shared/components/button/button";
import { GlobalCard } from "../../Shared/components/Card/global-card/global-card";
import { PublicBranchServices } from "../../Core/Services/public Services/Public BranchServicess/public-branch-services";
import { BranchServices } from "../Admin/Services/branch-services/branch-services";
import { BranchService } from "../../Core/Models/BranchServices Model/branch-services-model";
import { GetBranchServicesRequest } from "../../Core/Models/BranchServices Model/branch-services-model";
@Component({
  selector: 'app-services',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Button,
    GlobalCard
  ],

  templateUrl: './services.html',

  styleUrl: './services.scss'
})
export class Services {

  private readonly publicBranchServices =
    inject(PublicBranchServices);

  private readonly cdr =
    inject(ChangeDetectorRef);

  branchServices: BranchService[] = [];

  loading = false;

  pageNumber = 1;

  pageSize = 20;

  totalRecords = 0;


  get totalPages(): number {

    return Math.ceil(
      this.totalRecords / this.pageSize
    );

  }

  search = '';

  ngOnInit(): void {

    this.loadBranchServices();

  }


  loadBranchServices(): void {

    this.loading = true;


    const request: GetBranchServicesRequest = {

      search:
        this.search.trim() === ''
          ? null
          : this.search.trim(),

      pageNumber: this.pageNumber,

      pageSize: this.pageSize

    };


    this.publicBranchServices
      .getBranchServices(request)
      .subscribe({

        next: (response) => {

          if (response.success) {

            this.branchServices =
              response.data ?? [];

            this.totalRecords =
              response.totalCount ?? 0;

          }
          else {

            this.branchServices = [];

            this.totalRecords = 0;

          }


          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'GET BRANCH SERVICES ERROR:',
            error
          );

          this.branchServices = [];

          this.totalRecords = 0;

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

  
  onSearch(): void {

    this.pageNumber = 1;

    this.loadBranchServices();

  }

  clearSearch(): void {

    this.search = '';

    this.pageNumber = 1;

    this.loadBranchServices();

  }

  onPageChange(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.pageNumber = page;

    this.loadBranchServices();

  }

  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.loadBranchServices();

  }

  onServiceClick(service: BranchService): void {

    console.log(
      'Selected service:',
      service
    );

  }

}