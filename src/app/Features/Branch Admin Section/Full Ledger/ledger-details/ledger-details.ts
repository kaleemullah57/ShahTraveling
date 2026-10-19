import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LedgerFullDetails, LedgerFullDetailsRequest } from '../../Admin Models/Branch Admin Ledger Models/get-or-create-customer-ledger-request';
import { Services } from '../../../services/services';
import { CustomerLedgerService } from '../../Admin Services/Branch Admin Ledger Services/customer-ledger-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ledger-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './ledger-details.html',
  styleUrl: './ledger-details.scss',
})
export class LedgerDetails implements OnInit {

  private getCustomerLedgerService = inject(CustomerLedgerService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadLedgerFullDetails();
  }
  ledgerDetails: LedgerFullDetails[] = [];
  readonly Math = Math;

  ledgerSearch = '';
  ledgerPageNumber = 1;
  ledgerPageSize = 10;
  ledgerTotalRecords = 0;
  ledgerAmountStatus = 0;
  ledgerLoading = false;



  loadLedgerFullDetails(): void {
    const request: LedgerFullDetailsRequest = {
      search: this.ledgerSearch.trim(),
      pageNumber: this.ledgerPageNumber,
      pageSize: this.ledgerPageSize,
      amountStatus: this.ledgerAmountStatus
    };

    this.ledgerLoading = true;
    this.cdr.detectChanges();

    this.getCustomerLedgerService
      .getLedgerFullDetails(request)
      .pipe(
        finalize(() => {
          this.ledgerLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.ledgerDetails = response.data.items ?? [];
            this.ledgerTotalRecords = response.data.totalCount ?? 0;
            this.ledgerPageNumber = response.data.pageNumber ?? 1;
            this.ledgerPageSize = response.data.pageSize ?? 10;
          } else {
            this.ledgerDetails = [];
            this.ledgerTotalRecords = 0;
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load ledger details:', error);

          this.ledgerDetails = [];
          this.ledgerTotalRecords = 0;

          this.cdr.markForCheck();
        }
      });
  }



  onLedgerSearch(): void {
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }

  onLedgerAmountStatusChange(value: string | number): void {
    this.ledgerAmountStatus = Number(value);
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }

  onLedgerPageChange(pageNumber: number): void {
    this.ledgerPageNumber = pageNumber;
    this.loadLedgerFullDetails();
  }

  onLedgerPageSizeChange(pageSize: number): void {
    this.ledgerPageSize = pageSize;
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }
}
