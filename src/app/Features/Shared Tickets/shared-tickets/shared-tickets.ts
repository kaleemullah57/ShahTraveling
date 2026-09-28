import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedTicketService } from '../../../Core/Services/public Services/Shared Tickets Service/shared-ticket-service';

import {
  TicketInventoryUpdatedEvent,
  TicketRealtimeService,
  TicketUpdatedEvent
} from '../../../Shared/components/TicketRealtimeService/ticket-realtime-service';

import {
  SharedTicketModel,
  SharedTicketsRequest
} from '../../../Core/Models/Public Tickets/shared-ticket-model';

import { Router } from '@angular/router';
import { AuthService } from '../../../Core/Services/auth.service/auth.service';

import {
  BookingPassengerRequest,
  CreateBookingRequest,
  CreateBookingResponse
} from '../../Customer Section/Customers Models/Ticket Booking Models/ticket-booking-model';

import { TicketBookingService } from '../../Customer Section/Customers services/Ticket Booking Services/ticket-booking-service';

import { GlobalDropdownService } from '../../../Core/Services/Dropdown Services/global-dropdown-service';

@Component({
  selector: 'app-shared-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './shared-tickets.html',
  styleUrl: './shared-tickets.scss'
})
export class SharedTickets implements OnInit, OnDestroy {

  private readonly sharedTicketsService = inject(SharedTicketService);
  private readonly ticketRealtimeService = inject(TicketRealtimeService);

  // IMPORTANT:
  // Must not be private because HTML template uses it.
  readonly authService = inject(AuthService);

  private bookingService = inject(TicketBookingService);
  private globalDropDownService = inject(GlobalDropdownService);

  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);


  // ============================================================
  // TICKETS
  // ============================================================

  tickets: SharedTicketModel[] = [];

  loading = false;

  totalRecords = 0;

  pageNumber = 1;

  pageSize = 10;


  // ============================================================
  // FILTERS
  // ============================================================

  search = '';

  fromDate: string | null = null;

  toDate: string | null = null;

  fromSellingPrice: number | null = null;

  toSellingPrice: number | null = null;


  // ============================================================
  // BOOKING
  // ============================================================

  showBookingForm = false;

  selectedTicket: SharedTicketModel | null = null;

  bookingPassengers: BookingPassengerRequest[] = [];

  bookingResult: CreateBookingResponse | null = null;

  passengerTypes: {
    label: string;
    value: number;
  }[] = [];

  isBooking = false;


  // ============================================================
  // INIT
  // ============================================================

 ngOnInit(): void {

  // Tickets are PUBLIC
  this.loadTickets();


  // Passenger types are only required when booking
  if (this.authService.isLoggedIn()) {
    this.loadPassengerTypes();
  }


  // Start SignalR
  this.ticketRealtimeService.startConnection();


  // Existing ticket sharing / price updates
  this.ticketRealtimeService.ticketUpdated$
    .subscribe((event) => {

      this.updateTicket(event);

    });


  // NEW - Booking / Hold / Cancel / Expiry
  this.ticketRealtimeService.ticketInventoryUpdated$
    .subscribe((event) => {

      this.updateTicketInventory(event);

    });

}


  // ============================================================
  // LOAD TICKETS
  // ============================================================

  loadTickets(): void {

    this.loading = true;

    const request: SharedTicketsRequest = {

      search: this.search,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize,

      fromDate: this.fromDate,

      toDate: this.toDate,

      fromSellingPrice: this.fromSellingPrice,

      toSellingPrice: this.toSellingPrice

    };


    this.sharedTicketsService.getSharedTickets(request).subscribe({

      next: (response) => {

        if (response.status === true) {

          this.tickets = response.data ?? [];

          this.totalRecords = response.totalCount ?? 0;

        }
        else {

          this.tickets = [];

          this.totalRecords = 0;

        }


        this.loading = false;

        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Get Shared Tickets Error:',
          error
        );

        this.tickets = [];

        this.totalRecords = 0;

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }


  // ============================================================
  // FILTERS
  // ============================================================

  applyFilters(): void {

    this.pageNumber = 1;

    this.loadTickets();

  }


  clearFilters(): void {

    this.search = '';

    this.fromDate = null;

    this.toDate = null;

    this.fromSellingPrice = null;

    this.toSellingPrice = null;

    this.pageNumber = 1;

    this.loadTickets();

  }


  // ============================================================
  // PAGINATION
  // ============================================================

  onPageChange(event: any): void {

    this.pageNumber = event.pageNumber;

    this.pageSize = event.pageSize;

    this.loadTickets();

  }


  // ============================================================
  // SIGNALR
  // ============================================================

  private updateTicket(
    event: TicketUpdatedEvent
  ): void {

    this.ngZone.run(() => {

      const index = this.tickets.findIndex(
        x =>
          Number(x.purchaseInvoiceItemId) ===
          Number(event.purchaseInvoiceItemId)
      );


      // Ticket is not currently in the loaded page.
      // Reload so first-time sharing also appears.
      if (index === -1) {

        if (
          event.sharedQuantityIncrease !== undefined
        ) {

          this.loadTickets();

        }

        return;

      }


      const ticket = this.tickets[index];

      const updatedTicket: SharedTicketModel = {
        ...ticket
      };


      // Selling price changed
      if (
        event.sellingPrice !== undefined
      ) {

        updatedTicket.sellingPrice =
          Number(event.sellingPrice);

      }


      // Shared quantity increased
      if (
        event.sharedQuantityIncrease !== undefined
      ) {

        updatedTicket.availableQuantity =
          Number(ticket.availableQuantity ?? 0) +
          Number(event.sharedQuantityIncrease);

      }


      // Shared quantity decreased
      if (
        event.sharedQuantityDecrease !== undefined
      ) {

        updatedTicket.availableQuantity =
          Math.max(
            0,
            Number(ticket.availableQuantity ?? 0) -
            Number(event.sharedQuantityDecrease)
          );

      }


      this.tickets = this.tickets.map(
        (item, i) =>
          i === index
            ? updatedTicket
            : item
      );


      this.cdr.detectChanges();

    });

  }

  private updateTicketInventory(
  event: TicketInventoryUpdatedEvent
): void {

  this.ngZone.run(() => {

    console.log(
      '🔔 INVENTORY UPDATED:',
      event.purchaseInvoiceItemId
    );

    this.loadTickets();

  });

}


  // ============================================================
  // GUEST TICKET DETAILS
  // ============================================================

seeTicketDetails(ticket: SharedTicketModel): void {

  const returnUrl =
    `/SharedTickets?ticketId=${ticket.purchaseInvoiceItemId}`;

  this.router.navigate(
    ['/login'],
    {
      queryParams: {
        returnUrl
      }
    }
  );
}
  openBookingForm(
    ticket: SharedTicketModel
  ): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }


    this.selectedTicket = ticket;


    this.bookingPassengers = [

      {
        passengerTypeId: 0,

        fullName: '',

        passportNumber: '',

        dateOfBirth: '',

        gender: '',

        nationality: '',

        contactNumber: '',

        email: ''

      }

    ];


    this.bookingResult = null;

    this.showBookingForm = true;

  }


  // ============================================================
  // ADD PASSENGER
  // ============================================================

  addPassenger(): void {

    this.bookingPassengers.push({

      passengerTypeId: 0,

      fullName: '',

      passportNumber: '',

      dateOfBirth: '',

      gender: '',

      nationality: '',

      contactNumber: '',

      email: ''

    });

  }


  // ============================================================
  // REMOVE PASSENGER
  // ============================================================

  removePassenger(
    index: number
  ): void {

    if (
      this.bookingPassengers.length === 1
    ) {

      return;

    }


    this.bookingPassengers.splice(
      index,
      1
    );

  }


  // ============================================================
  // CREATE BOOKING
  // ============================================================

  createBooking(): void {

    if (
      !this.authService.isLoggedIn()
    ) {

      return;

    }


    if (
      !this.selectedTicket?.purchaseInvoiceItemId
    ) {

      return;

    }


    if (
      !this.validatePassengers()
    ) {

      return;

    }


    const request: CreateBookingRequest = {

      purchaseInvoiceItemId:
        this.selectedTicket.purchaseInvoiceItemId,

      passengers:
        this.bookingPassengers.map(
          p => ({

            passengerTypeId:
              Number(p.passengerTypeId),

            fullName:
              p.fullName.trim(),

            passportNumber:
              p.passportNumber.trim(),

            dateOfBirth:
              p.dateOfBirth,

            gender:
              p.gender,

            nationality:
              p.nationality.trim(),

            contactNumber:
              p.contactNumber.trim(),

            email:
              p.email.trim()

          })
        )

    };


    this.isBooking = true;


    this.bookingService
      .createBooking(request)
      .subscribe({

        next: (response) => {

          this.isBooking = false;


          if (response?.status) {

            this.bookingResult =
              response.data;

            // Refresh availability
            this.loadTickets();

          }

        },


        error: (error) => {

          this.isBooking = false;

          console.error(
            'Create booking error:',
            error
          );

        }

      });

  }


  // ============================================================
  // VALIDATE PASSENGERS
  // ============================================================

  validatePassengers(): boolean {

    if (
      !this.bookingPassengers.length
    ) {

      return false;

    }


    for (
      const passenger
      of this.bookingPassengers
    ) {

      if (
        !passenger.passengerTypeId
      ) {

        return false;

      }


      if (
        !passenger.fullName?.trim()
      ) {

        return false;

      }


      if (
        !passenger.passportNumber?.trim()
      ) {

        return false;

      }


      if (
        !passenger.dateOfBirth
      ) {

        return false;

      }


      if (
        !passenger.gender
      ) {

        return false;

      }


      // Nationality optional


      if (
        !passenger.contactNumber?.trim()
      ) {

        return false;

      }


      // Email optional

    }


    return true;

  }


  // ============================================================
  // PASSENGER TYPE NAME
  // ============================================================

  getPassengerTypeName(
    passengerTypeId: number
  ): string {

    return (
      this.passengerTypes.find(
        x =>
          x.value ===
          Number(passengerTypeId)
      )?.label
      ?? 'Passenger'
    );

  }


  // ============================================================
  // LOAD PASSENGER TYPES
  // ============================================================

  loadPassengerTypes(): void {

    this.globalDropDownService
      .getPassengerTypes()
      .subscribe({

        next: (response) => {

          if (
            response?.status &&
            response?.data
          ) {

            this.passengerTypes =
              response.data.map(
                (item: any) => ({

                  label:
                    item.text ??
                    item.Text,

                  value:
                    Number(
                      item.value ??
                      item.Value
                    )

                })
              );

          }

        },


        error: (error) => {

          console.error(
            'Failed to load passenger types',
            error
          );

        }

      });

  }


  // ============================================================
  // CLOSE BOOKING
  // ============================================================

  closeBookingForm(): void {

    this.showBookingForm = false;

    this.selectedTicket = null;

    this.bookingPassengers = [];

    this.bookingResult = null;

  }


  


  // ============================================================
  // DESTROY
  // ============================================================

  ngOnDestroy(): void {

    this.ticketRealtimeService.stopConnection();

  }

}