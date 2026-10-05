import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  GetLedgerCustomerBookingsRequest,
  LedgerConfirmedBookingPassenger,
  LedgerCustomerBooking
} from '../../Admin Models/Branch Admin Ledger Models/get-or-create-customer-ledger-request';
import { CustomerLedgerService } from '../../Admin Services/Branch Admin Ledger Services/customer-ledger-service';
import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalDropdownService } from '../../../../Core/Services/Dropdown Services/global-dropdown-service';

@Component({
  selector: 'app-customer-ledger-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  customers: any[] = [];
  selectedCustomerId: number = 0;
  selectedCustomerName: string = '';

  customerBookings: LedgerCustomerBooking[] = [];
  selectedBookingId: number = 0;
  bookingSearch: string = '';
  loadingBookings: boolean = false;





// ============================================================
// LOAD CUSTOMERS
// ============================================================

loadCustomers(search?: string): void {

  this.globalDropdownService
    .getCustomers(search)
    .subscribe({

      next: (response) => {

        if (
          response?.status === 'Success' ||
          response?.success === true
        ) {

          this.customers = response.data ?? [];

        }
        else {

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
selectCustomer(customer: any): void {

  this.selectedCustomerId = Number(customer.Value);

  this.selectedCustomerName = customer.Text;


  this.selectedBookingId = 0;

  this.customerBookings = [];

  this.loadCustomerBookings();
}

// ============================================================
// CUSTOMER DROPDOWN CHANGE
// ============================================================

onCustomerChange(): void {

  if (!this.selectedCustomerId) {

    this.selectedCustomerName = '';

    this.customerBookings = [];

    this.selectedBookingId = 0;

    this.selectedBooking = null;

    this.bookingPassengers = [];

    return;
  }

  const customer = this.customers.find(
    (x: any) =>
      Number(x.Value) ===
      Number(this.selectedCustomerId)
  );


  this.selectedBookingId = 0;

  this.selectedBooking = null;

  this.bookingPassengers = [];

  this.loadCustomerBookings();
}







  // Load Bookings

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
      .subscribe({
        next: (response) => {
          if (response?.status === true) {
            this.customerBookings = response.data ?? [];
          }
          else {
            this.customerBookings = [];
            this.notificationService.error(
              response?.message ||
              'Unable to load customer bookings.'
            );
          }

          this.loadingBookings = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          this.customerBookings = [];
          this.loadingBookings = false;
          this.notificationService.error(
            error?.error?.message ||
            'Unable to load customer bookings.'
          );
          this.cdr.detectChanges();
        }
      });
  }


onBookingClick(bookingId: number): void {

  // Same booking clicked again → hide details
  if (this.selectedBookingId === bookingId) {

    this.selectedBookingId = 0;
    this.selectedBooking = null;
    this.bookingPassengers = [];
    this.loadingPassengers = false;

    this.cdr.detectChanges();

    return;
  }

  // New booking clicked → show details
  this.selectedBookingId = bookingId;

  this.selectedBooking =
    this.customerBookings.find(
      x => x.bookingId === bookingId
    ) ?? null;

  // Clear previous booking passengers
  this.bookingPassengers = [];

  // Load selected booking passengers
  this.loadConfirmedBookingPassengers();
}



















  // Load Passenger Confirmed Tickets
  bookingPassengers: LedgerConfirmedBookingPassenger[] = [];
loadingPassengers: boolean = false;

selectedBooking: LedgerCustomerBooking | null = null;

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
    .subscribe({

      next: (response) => {

        if (
          response?.status === 'Success' ||
          response?.success === true
        ) {

          this.bookingPassengers =
            response.data ?? [];

        } else {

          this.bookingPassengers = [];

          this.notificationService.error(
            response?.message ||
            'Unable to load confirmed passengers.'
          );
        }

        this.loadingPassengers = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.bookingPassengers = [];

        this.loadingPassengers = false;

        this.notificationService.error(
          error?.error?.message ||
          'Unable to load confirmed passengers.'
        );

        this.cdr.detectChanges();
      }
    });
}
}