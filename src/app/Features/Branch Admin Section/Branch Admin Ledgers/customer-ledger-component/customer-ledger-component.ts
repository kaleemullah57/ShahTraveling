import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  GetLedgerCustomerBookingsRequest,
  LedgerConfirmedBookingPassenger,
  LedgerCustomerBooking,
  TicketPaymentAddRequest
} from '../../Admin Models/Branch Admin Ledger Models/get-or-create-customer-ledger-request';

import {
  CustomerLedgerService
} from '../../Admin Services/Branch Admin Ledger Services/customer-ledger-service';

import {
  NotificationService
} from '../../../../Core/Services/Notification Services/notification-service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-ledger-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customer-ledger-component.html',
  styleUrl: './customer-ledger-component.scss',
})
export class CustomerLedgerComponent implements OnInit {

  private getCustomerLedgerService = inject(CustomerLedgerService);
  private notificationService = inject(NotificationService);
  private globalDropdownService = inject(GlobalDropdownService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadCustomers();
  }

  // ============================================================
  // CUSTOMER
  // ============================================================

  customers: any[] = [];

  selectedCustomerId = 0;
  selectedCustomerName = '';

  // ============================================================
  // BOOKINGS
  // ============================================================

  customerBookings: LedgerCustomerBooking[] = [];

  selectedBookingId = 0;
  selectedBooking: LedgerCustomerBooking | null = null;

  bookingSearch = '';

  loadingBookings = false;

  // ============================================================
  // PASSENGERS
  // ============================================================

  bookingPassengers: LedgerConfirmedBookingPassenger[] = [];

  loadingPassengers = false;

  // ============================================================
  // PAYMENT MODAL
  // ============================================================

  selectedPassengerIds: number[] = [];

  paymentModalVisible = false;
  isSavingPayment = false;

  selectedPaymentMethodId = 1;

  paymentTotalAmount = 0;

  paymentDate = this.getCurrentLocalDateTime();

  paymentReference = '';
  paymentRemarks = '';


  passengerAllocations: {
    bookingPassengerId: number;
    allocatedAmount: number | null;
  }[] = [];

  paymentError = '';

  readonly paymentMethods = [
    {
      id: 1,
      title: 'Single Passenger',
      description: 'Record payment for one passenger.',
      icon: 'fa-user'
    },
    {
      id: 2,
      title: 'Equal Distribution',
      description: 'Divide payment equally between passengers.',
      icon: 'fa-users'
    },
    {
      id: 3,
      title: 'Custom Distribution',
      description: 'Set a different amount for each passenger.',
      icon: 'fa-sliders'
    }
  ];

  // ============================================================
  // DATE HELPER
  // ============================================================

  private getCurrentLocalDateTime(): string {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, '0');

    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');

    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // ============================================================
  // RESPONSE HELPER
  // ============================================================

  private isSuccessfulResponse(response: any): boolean {

    return response?.success === true ||
      response?.status === true ||
      response?.status === 'Success';
  }

  // ============================================================
  // LOAD CUSTOMERS
  // ============================================================

  loadCustomers(search?: string): void {

    this.globalDropdownService
      .getCustomers(search)
      .subscribe({

        next: (response) => {

          if (this.isSuccessfulResponse(response)) {

            this.customers = response.data ?? [];

          } else {

            this.customers = [];

            this.notificationService.error(
              response?.message ||
              'Unable to load customers.'
            );
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.customers = [];

          this.notificationService.error(
            error?.error?.message ||
            'Unable to load customers.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // ============================================================
  // SELECT CUSTOMER
  // ============================================================

  selectCustomer(customer: any): void {

    this.selectedCustomerId = Number(customer.Value);

    this.selectedCustomerName = customer.Text;

    this.resetSelectedBooking();

    this.customerBookings = [];

    this.loadCustomerBookings();
  }

  // ============================================================
  // CUSTOMER DROPDOWN CHANGE
  // ============================================================

  onCustomerChange(): void {

    const customer = this.customers.find(
      (x: any) =>
        Number(x.Value) === Number(this.selectedCustomerId)
    );

    if (!this.selectedCustomerId) {

      this.selectedCustomerName = '';

      this.customerBookings = [];

      this.resetSelectedBooking();

      this.cdr.detectChanges();

      return;
    }

    this.selectedCustomerName = customer?.Text ?? '';

    this.customerBookings = [];

    this.resetSelectedBooking();

    this.loadCustomerBookings();
  }

  // ============================================================
  // RESET BOOKING AND PAYMENT SELECTION
  // ============================================================

  private resetSelectedBooking(): void {

    this.selectedBookingId = 0;

    this.selectedBooking = null;

    this.bookingPassengers = [];

    this.loadingPassengers = false;

    this.resetPaymentSelection();
  }

  private resetPaymentSelection(): void {

    this.selectedPassengerIds = [];

    this.passengerAllocations = [];

    this.paymentTotalAmount = 0;

    this.selectedPaymentMethodId = 1;

    this.paymentError = '';
  }

  // ============================================================
  // LOAD CUSTOMER BOOKINGS
  // ============================================================

  loadCustomerBookings(): void {

    if (!this.selectedCustomerId) {
      return;
    }

    this.loadingBookings = true;

    const request: GetLedgerCustomerBookingsRequest = {
      customerId: this.selectedCustomerId,
      search: this.bookingSearch?.trim() || null
    };

    this.getCustomerLedgerService
      .getCustomerBookings(request)
      .pipe(
        finalize(() => {
          this.loadingBookings = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response) => {

          if (this.isSuccessfulResponse(response)) {

            this.customerBookings = response.data ?? [];

          } else {

            this.customerBookings = [];

            this.notificationService.error(
              response?.message ||
              'Unable to load customer bookings.'
            );
          }
        },

        error: (error) => {

          this.customerBookings = [];

          this.notificationService.error(
            error?.error?.message ||
            'Unable to load customer bookings.'
          );
        }
      });
  }

  // ============================================================
  // BOOKING CLICK
  // ============================================================

  onBookingClick(bookingId: number): void {

    if (this.selectedBookingId === bookingId) {

      this.resetSelectedBooking();

      this.cdr.detectChanges();

      return;
    }

    this.selectedBookingId = bookingId;

    this.selectedBooking =
      this.customerBookings.find(
        x => x.bookingId === bookingId
      ) ?? null;

    this.bookingPassengers = [];

    this.resetPaymentSelection();

    this.loadConfirmedBookingPassengers();
  }

  // ============================================================
  // LOAD CONFIRMED PASSENGERS
  // ============================================================

  loadConfirmedBookingPassengers(): void {

    if (
      !this.selectedCustomerId ||
      !this.selectedBookingId
    ) {
      return;
    }

    this.loadingPassengers = true;

    const request = {
      customerId: this.selectedCustomerId,
      bookingId: this.selectedBookingId
    };

    this.getCustomerLedgerService
      .getConfirmedBookingPassengers(request)
      .pipe(
        finalize(() => {
          this.loadingPassengers = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response) => {

          if (this.isSuccessfulResponse(response)) {

            this.bookingPassengers = response.data ?? [];

            // Remove selections that no longer have an outstanding balance.
            this.selectedPassengerIds =
              this.selectedPassengerIds.filter(id =>
                this.bookingPassengers.some(passenger =>
                  Number(passenger.bookingPassengerId) === id &&
                  this.getOutstanding(passenger) > 0
                )
              );

            this.recalculatePaymentTotal();

          } else {

            this.bookingPassengers = [];

            this.notificationService.error(
              response?.message ||
              'Unable to load confirmed passengers.'
            );
          }
        },

        error: (error) => {

          this.bookingPassengers = [];

          this.notificationService.error(
            error?.error?.message ||
            'Unable to load confirmed passengers.'
          );
        }
      });
  }

  // ============================================================
  // PASSENGER BALANCE HELPERS
  // ============================================================

  getOutstanding(passenger: LedgerConfirmedBookingPassenger): number {

    const item = passenger as any;

    const explicitOutstanding = item.outstanding ??
      item.Outstanding ??
      item.remainingAmount ??
      item.RemainingAmount;

    if (explicitOutstanding !== undefined &&
        explicitOutstanding !== null) {

      return this.roundMoney(
        Math.max(0, Number(explicitOutstanding) || 0)
      );
    }

    // Until the API returns an outstanding field, the ticket price
    // is only a fallback. This is not accurate for previously paid tickets.
    return this.roundMoney(
      Math.max(0, Number(item.unitPrice ?? item.UnitPrice ?? 0))
    );
  }

  getTotalPaid(passenger: LedgerConfirmedBookingPassenger): number {

    const item = passenger as any;

    return this.roundMoney(
      Number(
        item.alreadyPaid ??
        item.TotalPaid ??
        item.paidAmount ??
        item.PaidAmount ??
        0
      ) || 0
    );
  }

  getPaymentStatus(passenger: LedgerConfirmedBookingPassenger): string {

    const outstanding = this.getOutstanding(passenger);

    const totalPaid = this.getTotalPaid(passenger);

    if (outstanding <= 0) {
      return 'Paid';
    }

    if (totalPaid <= 0) {
      return 'Unpaid';
    }

    return 'Partially Paid';
  }

  private roundMoney(value: number): number {

    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  // ============================================================
  // PASSENGER SELECTION
  // ============================================================

  isPassengerSelected(bookingPassengerId: number): boolean {

    return this.selectedPassengerIds.includes(
      Number(bookingPassengerId)
    );
  }

 
togglePassengerSelection(
    bookingPassengerId: number,
    checked: boolean
): void {

    const passengerId = Number(bookingPassengerId);

    const passenger = this.bookingPassengers.find(
        p => Number(p.bookingPassengerId) === passengerId
    );

    if (!passenger) {
        return;
    }

    // A fully paid ticket cannot be selected.
    if (checked && this.getOutstanding(passenger) <= 0) {
        return;
    }

    if (checked) {

        // Add the passenger only if not already selected.
        if (!this.selectedPassengerIds.includes(passengerId)) {
            this.selectedPassengerIds = [
                ...this.selectedPassengerIds,
                passengerId
            ];
        }

        this.ensurePassengerAllocation(passengerId);

    } else {

        // Remove only the unchecked passenger.
        this.selectedPassengerIds =
            this.selectedPassengerIds.filter(
                id => Number(id) !== passengerId
            );

        this.passengerAllocations =
            this.passengerAllocations.filter(
                allocation =>
                    Number(allocation.bookingPassengerId) !== passengerId
            );
    }

    // Don't automatically discard other selections.
    this.paymentError = '';

    // Keep the displayed amount in sync with the selection.
    this.recalculatePaymentTotal();
}

  private ensurePassengerAllocation(passengerId: number): void {

    const exists = this.passengerAllocations.some(
      allocation => allocation.bookingPassengerId === passengerId
    );

    if (!exists) {

      this.passengerAllocations.push({
        bookingPassengerId: passengerId,
        allocatedAmount: null
      });
    }
  }

  // ============================================================
  // PAYMENT METHOD
  // ============================================================

selectPaymentMethod(methodId: number): void {

  if (![1, 2, 3].includes(methodId)) {
    return;
  }

  // Change the payment method without removing selected passengers.
  this.selectedPaymentMethodId = methodId;

  this.paymentError = '';

  this.recalculatePaymentTotal();
}

  // ============================================================
  // SELECTED PASSENGERS
  // ============================================================

  getSelectedPassengers(): LedgerConfirmedBookingPassenger[] {

    return this.bookingPassengers.filter(passenger =>
      this.selectedPassengerIds.includes(
        Number(passenger.bookingPassengerId)
      )
    );
  }

  // ============================================================
  // PAYMENT ALLOCATIONS
  // ============================================================

  getCustomAllocation(bookingPassengerId: number): number {

    const allocation = this.passengerAllocations.find(
      x => x.bookingPassengerId === bookingPassengerId
    );

    return Number(allocation?.allocatedAmount ?? 0);
  }

  updatePassengerAllocation(
    passenger: LedgerConfirmedBookingPassenger,
    event: Event
  ): void {

    const input = event.target as HTMLInputElement;

    const value = Number(input.value);

    const outstanding = this.getOutstanding(passenger);

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > outstanding
    ) {

      this.paymentError =
        `Allocation cannot exceed the outstanding balance of ${outstanding}.`;

      return;
    }

    const amount = this.roundMoney(value);

    let allocation = this.passengerAllocations.find(
      x => x.bookingPassengerId === passenger.bookingPassengerId
    );

    if (!allocation) {

      allocation = {
        bookingPassengerId: passenger.bookingPassengerId,
        allocatedAmount: amount
      };

      this.passengerAllocations.push(allocation);

    } else {

      allocation.allocatedAmount = amount;
    }

    this.paymentError = '';

    this.recalculatePaymentTotal();
  }

  getAllocatedTotal(): number {

    return this.roundMoney(
      this.getSelectedPassengers().reduce(
        (total, passenger) =>
          total + this.getCustomAllocation(
            Number(passenger.bookingPassengerId)
          ),
        0
      )
    );
  }

  // ============================================================
  // TOTAL AMOUNT CALCULATION
  // ============================================================

  recalculatePaymentTotal(): void {

    const selectedPassengers = this.getSelectedPassengers();

    if (this.selectedPaymentMethodId === 1) {

      this.paymentTotalAmount = selectedPassengers.length === 1
        ? this.getOutstanding(selectedPassengers[0])
        : 0;

      return;
    }

    if (this.selectedPaymentMethodId === 2) {

      // Default amount: total outstanding of the selected passengers.
      // The user can reduce the amount after opening the modal.
      this.paymentTotalAmount = this.roundMoney(
        selectedPassengers.reduce(
          (total, passenger) =>
            total + this.getOutstanding(passenger),
          0
        )
      );

      return;
    }

    if (this.selectedPaymentMethodId === 3) {

      this.paymentTotalAmount = this.getAllocatedTotal();
    }
  }

  // ============================================================
  // CUSTOM ALLOCATION VALIDATION
  // ============================================================

  isAllocationBalanced(): boolean {

    const passengers = this.getSelectedPassengers();

    if (passengers.length < 2) {
      return false;
    }

    const total = this.getAllocatedTotal();

    if (total <= 0) {
      return false;
    }

    const invalidAllocation = passengers.some(passenger => {

      const amount = this.getCustomAllocation(
        Number(passenger.bookingPassengerId)
      );

      return amount < 0 ||
        amount > this.getOutstanding(passenger);
    });

    return !invalidAllocation &&
      Math.abs(total - this.paymentTotalAmount) < 0.005;
  }

  // ============================================================
// OPEN PAYMENT MODAL
// ============================================================

openPaymentModal(): void {

  this.paymentError = '';

  // Validate customer and booking.
  if (!this.selectedCustomerId || !this.selectedBookingId) {

    this.notificationService.error(
      'Please select a customer and booking.'
    );

    return;
  }

  // Get the currently selected passengers.
  const selectedPassengers = this.getSelectedPassengers();

  if (selectedPassengers.length === 0) {

    this.notificationService.error(
      'Please select at least one passenger.'
    );

    return;
  }

  // Check that every selected passenger has an outstanding balance.
  const invalidPassenger = selectedPassengers.find(
    passenger => this.getOutstanding(passenger) <= 0
  );

  if (invalidPassenger) {

    this.notificationService.error(
      `Passenger ${invalidPassenger.fullName} has no outstanding balance.`
    );

    return;
  }

  // Automatically choose the correct default payment method.
  if (selectedPassengers.length === 1) {

    this.selectedPaymentMethodId = 1;

  } else {

    this.selectedPaymentMethodId = 2;
  }

  // Initialize payment information.
  this.paymentDate = this.getCurrentLocalDateTime();

  this.paymentReference = '';

  this.paymentRemarks = '';

  this.paymentError = '';

  // Ensure allocations exist for every selected passenger.
  selectedPassengers.forEach(passenger => {
    this.ensurePassengerAllocation(
      Number(passenger.bookingPassengerId)
    );
  });

  // Calculate the initial payment amount.
  this.recalculatePaymentTotal();

  // Display the modal.
  this.paymentModalVisible = true;

  this.cdr.detectChanges();
}

  // ============================================================
  // CLOSE PAYMENT MODAL
  // ============================================================

  closePaymentModal(): void {

    if (this.isSavingPayment) {
      return;
    }

    this.paymentModalVisible = false;

    this.paymentReference = '';

    this.paymentRemarks = '';

    this.paymentDate = this.getCurrentLocalDateTime();

    this.resetPaymentSelection();
  }

  // ============================================================
  // SAVE PAYMENT
  // ============================================================

  submitPayment(): void {

    this.paymentError = '';

    if (!this.selectedCustomerId || !this.selectedBookingId) {

      this.paymentError = 'Please select a customer and booking.';

      return;
    }

    const selectedPassengers = this.getSelectedPassengers();

    if (!selectedPassengers.length) {

      this.paymentError = 'Select at least one passenger.';

      return;
    }

    if (
      this.selectedPaymentMethodId === 1 &&
      selectedPassengers.length !== 1
    ) {

      this.paymentError =
        'Single Passenger payment requires exactly one passenger.';

      return;
    }

    if (
      this.selectedPaymentMethodId !== 1 &&
      selectedPassengers.length < 2
    ) {

      this.paymentError =
        'Select at least two passengers for distribution.';

      return;
    }

    if (
      !Number.isFinite(this.paymentTotalAmount) ||
      this.paymentTotalAmount <= 0
    ) {

      this.paymentError =
        'Payment amount must be greater than zero.';

      return;
    }

    if (this.selectedPaymentMethodId === 3) {

      if (!this.isAllocationBalanced()) {

        this.paymentError =
          'Custom allocations must equal the total payment and cannot exceed passenger balances.';

        return;
      }
    }

    // The frontend is not the source of truth for balances.
    // The backend stored procedure must validate all balances again.
    const allocations = selectedPassengers.map(passenger => {

      const passengerId = Number(passenger.bookingPassengerId);

      let allocatedAmount: number | null = null;

      if (this.selectedPaymentMethodId === 1) {

        allocatedAmount = this.paymentTotalAmount;

      } else if (this.selectedPaymentMethodId === 3) {

        allocatedAmount = this.getCustomAllocation(passengerId);
      }

      return {
        bookingPassengerId: passengerId,
        allocatedAmount
      };
    });

    const request: TicketPaymentAddRequest = {

      customerId: Number(this.selectedCustomerId),

      bookingId: Number(this.selectedBookingId),

      paymentMethodId: this.selectedPaymentMethodId,

      totalAmount: this.roundMoney(this.paymentTotalAmount),

      paymentDate: this.paymentDate
        ? new Date(this.paymentDate).toISOString()
        : null,

      paymentReference: this.paymentReference.trim() || null,

      remarks: this.paymentRemarks.trim() || null,

      allocations
    };

    this.isSavingPayment = true;

    this.getCustomerLedgerService
      .addPayment(request)
      .pipe(
        finalize(() => {

          this.isSavingPayment = false;

          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response: any) => {

          if (!this.isSuccessfulResponse(response)) {

            this.paymentError =
              response?.message || 'Unable to save payment.';

            this.notificationService.error(this.paymentError);

            this.cdr.detectChanges();

            return;
          }

          this.paymentModalVisible = false;

          this.paymentReference = '';

          this.paymentRemarks = '';

          this.resetPaymentSelection();

          this.notificationService.success(
            response?.message || 'Payment saved successfully.'
          );

          // Reload actual database balances.
          this.loadConfirmedBookingPassengers();

          // Refresh the booking list as well.
          this.loadCustomerBookings();
        },

        error: (error) => {

          console.error('Add Payment API error:', error);

          this.paymentError =
            error?.error?.message ||
            'An unexpected error occurred while saving payment.';

          this.notificationService.error(this.paymentError);

          this.cdr.detectChanges();
        }
      });
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackByPassengerId(
    index: number,
    passenger: LedgerConfirmedBookingPassenger
  ): number {

    return Number(passenger.bookingPassengerId);
  }




















  updatePassengerAllocationValue(
  passenger: LedgerConfirmedBookingPassenger,
  amount: number | string | null
): void {
  const value = amount === null || amount === ''
    ? 0
    : Number(amount);

  this.updatePassengerAllocation(passenger, {
    target: { value: String(value) }
  } as unknown as Event);
}
}
