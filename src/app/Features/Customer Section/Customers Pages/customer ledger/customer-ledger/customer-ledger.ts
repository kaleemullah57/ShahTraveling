
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  CustomerLedgerService
} from '../../../../Branch Admin Section/Admin Services/Branch Admin Ledger Services/customer-ledger-service';

import {
  LedgerFullDetails,
  LedgerFullDetailsRequest
} from '../../../../Branch Admin Section/Admin Models/Branch Admin Ledger Models/get-or-create-customer-ledger-request';

import {
  NotificationService
} from '../../../../../Core/Services/Notification Services/notification-service';

@Component({
  selector: 'app-customer-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-ledger.html',
  styleUrl: './customer-ledger.scss'
})
export class CustomerLedger implements OnInit {

  private ledgerService = inject(CustomerLedgerService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  readonly Math = Math;

  ledgerDetails: LedgerFullDetails[] = [];

  ledgerSearch = '';
  ledgerAmountStatus = 0;

  ledgerPageNumber = 1;
  ledgerPageSize = 10;
  ledgerTotalRecords = 0;

  ledgerLoading = false;

  readonly pageSizeOptions = [10, 20, 50, 100];

  readonly amountStatusOptions = [
    { value: 0, label: 'All Payments' },
    { value: 1, label: 'Unpaid' },
    { value: 2, label: 'Partially Paid' },
    { value: 3, label: 'Paid' },
    { value: 4, label: 'Outstanding' }
  ];

  ngOnInit(): void {
    this.loadLedgerFullDetails();
  }

  // -----------------------------------------------
  // Load ledger data
  // -----------------------------------------------
  loadLedgerFullDetails(): void {

    const request: LedgerFullDetailsRequest = {
      search: this.ledgerSearch.trim(),
      pageNumber: this.ledgerPageNumber,
      pageSize: this.ledgerPageSize,
      amountStatus: this.ledgerAmountStatus
    };

    this.ledgerLoading = true;
    this.cdr.detectChanges();

    this.ledgerService
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

            if (response.message) {
              this.notificationService.error(response.message);
            }
          }

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Failed to load customer ledger:', error);

          this.ledgerDetails = [];
          this.ledgerTotalRecords = 0;

          this.notificationService.error(
            'Unable to load customer ledger details.'
          );

          this.cdr.markForCheck();
        }
      });
  }

  // -----------------------------------------------
  // Search
  // -----------------------------------------------
  onSearch(): void {
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }

  clearSearch(): void {
    this.ledgerSearch = '';
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }

  // -----------------------------------------------
  // Amount status filter
  // -----------------------------------------------
  onAmountStatusChange(value: string | number): void {
    this.ledgerAmountStatus = Number(value);
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }

  // -----------------------------------------------
  // Page size
  // -----------------------------------------------
  onPageSizeChange(value: string | number): void {
    this.ledgerPageSize = Number(value);
    this.ledgerPageNumber = 1;
    this.loadLedgerFullDetails();
  }

  // -----------------------------------------------
  // Pagination
  // -----------------------------------------------
  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.ledgerTotalRecords / this.ledgerPageSize)
    );
  }

  get startRecord(): number {
    if (this.ledgerTotalRecords === 0) {
      return 0;
    }

    return (this.ledgerPageNumber - 1) * this.ledgerPageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.ledgerPageNumber * this.ledgerPageSize,
      this.ledgerTotalRecords
    );
  }

  get paginationPages(): number[] {
    const start = Math.max(1, this.ledgerPageNumber - 2);
    const end = Math.min(this.totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index
    );
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.ledgerPageNumber ||
      this.ledgerLoading
    ) {
      return;
    }

    this.ledgerPageNumber = page;
    this.loadLedgerFullDetails();
  }

  // -----------------------------------------------
  // Summary calculations for the loaded page
  // -----------------------------------------------

  /**
   * A passenger can appear multiple times because each payment
   * allocation is returned as a separate ledger row.
   * Deduplicate passengers for ticket-balance summaries.
   */
  private get uniquePassengers(): LedgerFullDetails[] {
    const passengers = new Map<number, LedgerFullDetails>();

    for (const item of this.ledgerDetails) {
      if (!passengers.has(item.bookingPassengerId)) {
        passengers.set(item.bookingPassengerId, item);
      }
    }

    return Array.from(passengers.values());
  }

  get pagePassengerCount(): number {
    return this.uniquePassengers.length;
  }

  get pageTotalTicketPrice(): number {
    return this.uniquePassengers.reduce(
      (total, item) => total + Number(item.ticketPrice || 0),
      0
    );
  }

  get pageTotalPaid(): number {
    return this.uniquePassengers.reduce(
      (total, item) => total + Number(item.totalPaid || 0),
      0
    );
  }

  get pageOutstanding(): number {
    return this.uniquePassengers.reduce(
      (total, item) => total + Number(item.remainingBalance || 0),
      0
    );
  }

  get pagePaidCount(): number {
    return this.uniquePassengers.filter(
      item => item.paymentStatus === 'Paid'
    ).length;
  }

  get pageUnpaidCount(): number {
    return this.uniquePassengers.filter(
      item => item.paymentStatus === 'Unpaid'
    ).length;
  }

  get pagePartialCount(): number {
    return this.uniquePassengers.filter(
      item => item.paymentStatus === 'Partially Paid'
    ).length;
  }

  get pagePaymentAmount(): number {
    return this.ledgerDetails.reduce(
      (total, item) => total + Number(item.paidAmount || 0),
      0
    );
  }

  // -----------------------------------------------
  // Formatting helpers
  // -----------------------------------------------
  getStatusClass(status: string | null | undefined): string {
    switch (status) {
      case 'Paid':
        return 'status-paid';

      case 'Partially Paid':
        return 'status-partial';

      case 'Unpaid':
        return 'status-unpaid';

      default:
        return 'status-default';
    }
  }

  getPaymentMethodIcon(method: string | null | undefined): string {
    const value = (method || '').toLowerCase();

    if (value.includes('cash')) {
      return 'bi bi-cash-stack';
    }

    if (value.includes('bank') || value.includes('transfer')) {
      return 'bi bi-bank';
    }

    if (value.includes('card')) {
      return 'bi bi-credit-card';
    }

    if (value.includes('custom')) {
      return 'bi bi-diagram-3';
    }

    if (value.includes('online')) {
      return 'bi bi-globe';
    }

    return 'bi bi-wallet2';
  }

  trackByLedgerRow(
    index: number,
    item: LedgerFullDetails
  ): string {
    return `${item.bookingPassengerId}-${item.ticketPaymentId ?? 'unpaid'}-${index}`;
  }
}
