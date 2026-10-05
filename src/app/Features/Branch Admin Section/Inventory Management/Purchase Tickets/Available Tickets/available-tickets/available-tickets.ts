
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import { DataTable, TableAction, TableColumn } from '../../../../../../Shared/components/DataTables/data-table/data-table';
import { AvailableTicketModel, AvailableTicketsRequest, ReduceSharedTicketQuantityRequest, ShareTicketsRequest, UpdateTicketSellingPriceRequest } from '../../../../Admin Models/Ticket Inventory Models/available-tickets';

import { InventoryServices } from '../../../../Admin Services/Inventory Services/inventory-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../../../Shared/components/button/button';
import { FormButton, FormField, forms } from '../../../../../../Shared/components/Forms/forms/forms';
import { NotificationService } from '../../../../../../Core/Services/Notification Services/notification-service';
import { TicketRealtimeService } from '../../../../../../Shared/components/TicketRealtimeService/ticket-realtime-service';


import { PassengerTicketPriceService } from '../../../../Admin Services/PassengerTypeTicketPriceService/passenger-ticket-price-service';
import { finalize, Subscription } from 'rxjs';
import { AddSharedTicketPassengerPriceRequest, SharedTicketPassengerPrice, UpdateSharedTicketPassengerPriceRequest } from '../../../../Admin Models/PassengerTypeTicketPrice/passenger-type-price-model';
import { GlobalDropdownService } from '../../../../../../Core/Services/Dropdown Services/global-dropdown-service';


@Component({
  selector: 'app-available-tickets',
  standalone: true,
  imports: [
    CommonModule,
    DataTable,
    FormsModule,
    Button,
    forms
  ],
  templateUrl: './available-tickets.html',
  styleUrl: './available-tickets.scss'
})
export class AvailableTickets implements OnInit, OnDestroy {

  private InventoryServices = inject(InventoryServices);
  private notificationService = inject(NotificationService)
  private realtimenotificationservice = inject(TicketRealtimeService)
  private passengerTicketPriceService = inject(PassengerTicketPriceService);
  private passengerPriceSubscriptions = new Subscription();
  private GlobalDropdownService = inject(GlobalDropdownService)
  private cdr = inject(ChangeDetectorRef);

  tickets: AvailableTicketModel[] = [];

  loading = false;

  totalRecords = 0;

  pageNumber = 1;
  pageSize = 10;

  search = '';

  fromDate: string | null = null;
  toDate: string | null = null;

  fromSellingPrice: number | null = null;
  toSellingPrice: number | null = null;


  // columns = [
  //   { key: 'airlineName', label: 'Airline' },
  //   { key: 'fromAirport', label: 'From' },
  //   { key: 'toAirport', label: 'To' },
  //   { key: 'departureDateTime', label: 'Departure' },
  //   { key: 'arrivalDateTime', label: 'Arrival' },
  //   { key: 'quantity', label: 'Available' },
  //   { key: 'availableToCustomers', label: 'Available' },
  //   { key: 'sellingPrice', label: 'Selling Price' },
  //   { key: 'validUntil', label: 'Valid Until' },
  //   { key: 'ticketTypeName', label: 'Ticket Type' }
  // ];

  columns: TableColumn[] = [
    {
      key: 'airlineName',
      label: 'Airline',
      type: 'text'
    },
    {
      key: 'fromAirport',
      label: 'From',
      type: 'text'
    },
    {
      key: 'toAirport',
      label: 'To',
      type: 'text'
    },
    {
      key: 'departureDateTime',
      label: 'Departure',
      type: 'date'
    },
    {
      key: 'arrivalDateTime',
      label: 'Arrival',
      type: 'date'
    },
    {
      key: 'quantity',
      label: 'Available',
      type: 'number'
    },
    {
      key: 'availableToCustomer',
      label: 'Available',
      type: 'number'
    },
    {
      key: 'sellingPrice',
      label: 'Selling Price',
      type: 'number'
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      type: 'date'
    },
    {
      key: 'ticketTypeName',
      label: 'Ticket Type',
      type: 'text'
    }
  ];

  actions: TableAction[] = [
    {
      type: 'view',
      label: 'View',
      icon: 'fa fa-eye'
    },
    {
      type: 'edit',
      label: 'Set Price',
      icon: 'fa fa-tag'
    },
    {
      type: 'share',
      label: 'share',
      icon: 'fa fa-share-alt',
    },
    {
      type: 'reduce',
      label: 'reduce',
      icon: 'fa fa-compress',
    },
    {
      type: 'passenger-price',
      label: 'Passenger Prices',
      icon: 'fa fa-users'
    }
  ];


 ngOnInit(): void {

  this.loadAvailableTickets();

  this.realtimenotificationservice.startConnection();

  // Ticket price / sharing changes
  this.realtimenotificationservice.ticketUpdated$
    .subscribe((event) => {

      console.log(
        '🔔 TICKET UPDATED:',
        event
      );

      this.loadAvailableTickets();
    });

  // Customer booking / inventory changes
  this.realtimenotificationservice.ticketInventoryUpdated$
    .subscribe((event) => {

      console.log(
        '🔔 INVENTORY UPDATED:',
        event
      );

      this.loadAvailableTickets();
    });
}
  ngOnDestroy(): void {
    this.realtimenotificationservice.stopConnection();
  }

  loadAvailableTickets(): void {
    this.loading = true;

    const request: AvailableTicketsRequest = {
      search: this.search?.trim() || undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      fromDate: this.fromDate,
      toDate: this.toDate,
      fromSellingPrice: this.fromSellingPrice,
      toSellingPrice: this.toSellingPrice
    };

    this.InventoryServices
      .getAvailableTickets(request)
      .subscribe({
        next: (response) => {

          console.log('🔥 AVAILABLE TICKETS RESPONSE:', response);

          if (response?.status === true && Array.isArray(response?.data)) {

            this.tickets = [...response.data];

            this.totalRecords = response.data.length;

          } else {

            this.tickets = [];
            this.totalRecords = 0;
          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Available Tickets Error:',
            error
          );

          this.tickets = [];
          this.totalRecords = 0;

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }


  onPageChange(event: any): void {

    this.pageNumber = event.pageNumber;

    this.pageSize = event.pageSize;

    this.loadAvailableTickets();
  }


  applyFilters(): void {

    this.pageNumber = 1;

    this.loadAvailableTickets();
  }


  clearFilters(): void {

    this.search = '';

    this.fromDate = null;

    this.toDate = null;

    this.fromSellingPrice = null;

    this.toSellingPrice = null;

    this.pageNumber = 1;

    this.loadAvailableTickets();
  }















  selectedTicket: AvailableTicketModel | null = null;
  showViewModal = false;

  onActionClick(
    event: {
      action: TableAction;
      row: AvailableTicketModel;
    }
  ): void {

    if (event.action.type === 'view') {

      const latestTicket = this.tickets.find(
        ticket =>
          ticket.purchaseInvoiceItemId ===
          event.row.purchaseInvoiceItemId
      );

      if (!latestTicket) {
        return;
      }

      this.selectedTicket = { ...latestTicket };

      this.showViewModal = true;

      this.cdr.detectChanges();

      return;
    }

    if (event.action.type === 'edit') {
      this.openSellingPriceForm(event.row);
      return;
    }

    if (event.action.type === 'share') {
      this.openShareDialog(event.row);
      return;
    }

    if (event.action.type === 'passenger-price') {

      this.openPassengerPriceModal(event.row);

      return;
    }


    if (event.action.type === 'reduce') {
      this.openReduceDialog(event.row);
      return;
    }
  }
  closeViewModal(): void {

    this.showViewModal = false;
    this.selectedTicket = null;

  }








  // Update ticket Selling Price
  sellingPriceFormFields: FormField[] = [
    {
      key: 'sellingPrice',
      label: 'Selling Price',
      type: 'number',
      placeholder: 'Enter selling price',
      required: true
    }
  ];

  sellingPriceFormButtons: FormButton[] = [
    {
      label: 'Update Price',
      type: 'submit'
    },
    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    }
  ];

  showSellingPriceForm = false;
  selectedPriceTicket: AvailableTicketModel | null = null;
  sellingPriceFormModel: any = {};

  openSellingPriceForm(ticket: AvailableTicketModel): void {

    this.selectedPriceTicket = ticket;

    this.sellingPriceFormModel = {
      sellingPrice: ticket.sellingPrice
    };

    this.showSellingPriceForm = true;

    this.cdr.detectChanges();
  }

  closeSellingPriceForm(): void {
    this.showSellingPriceForm = false;
    this.selectedPriceTicket = null;
    this.sellingPriceFormModel = {};
  }

  updateSellingPrice(formData: any): void {

    if (!this.selectedPriceTicket) {
      return;
    }

    const sellingPrice = Number(formData.sellingPrice);

    if (!sellingPrice || sellingPrice <= 0) {
      return;
    }

    const request: UpdateTicketSellingPriceRequest = {
      purchaseInvoiceItemId:
        this.selectedPriceTicket.purchaseInvoiceItemId,
      sellingPrice: sellingPrice
    };

    this.loading = true;

    this.InventoryServices
      .updateTicketSellingPrice(request)
      .subscribe({
        next: (response) => {

          if (response.status) {

            this.notificationService.success(response.message);
            this.showSellingPriceForm = false;
            this.selectedPriceTicket = null;

            this.loadAvailableTickets();
          }

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Update Selling Price Error:',
            error
          );

          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }


























  showShareForm = false;


  shareQuantity = 1;

  sharing = false;

  shareFormFields: FormField[] = [
    {
      key: 'quantity',
      label: 'Quantity to Share',
      type: 'number',
      required: true,
      placeholder: 'Enter quantity'
    }
  ];

  shareFormButtons: FormButton[] = [
    {
      label: 'Share Tickets',
      type: 'submit'
    },
    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    }
  ];
  openShareDialog(ticket: AvailableTicketModel): void {

    this.selectedTicket = ticket;

    this.shareFormFields = [
      {
        key: 'quantity',
        label: `Quantity to Share (Max: ${ticket.availableToShare})`,
        type: 'number',
        required: true,
        placeholder: 'Enter quantity'
      }
    ];

    this.showShareForm = true;

    this.cdr.detectChanges();
  }





  shareTickets(formData: any): void {

    if (!this.selectedTicket) {
      return;
    }

    const quantity = Number(formData.quantity);

    if (quantity <= 0) {
      this.notificationService.error('Quantity must be greater than zero.');
      return;
    }

    if (quantity > this.selectedTicket.availableToShare) {
      this.notificationService.error(
        `Only ${this.selectedTicket.availableToShare} tickets are available to share.`
      );
      return;
    }

    const request: ShareTicketsRequest = {
      purchaseInvoiceItemId:
        this.selectedTicket.purchaseInvoiceItemId,

      quantity: quantity
    };

    this.sharing = true;

    this.InventoryServices
      .shareTicketsToCustomers(request)
      .subscribe({
        next: (response) => {

          this.sharing = false;

          if (response.status === true) {

            this.notificationService.success(
              response.message || 'Tickets shared successfully.'
            );

            // Close share form
            this.showShareForm = false;

            // Clear selected ticket
            this.selectedTicket = null;

            // Reset quantity
            this.shareQuantity = 1;

            // Refresh available tickets
            this.loadAvailableTickets();

            this.cdr.detectChanges();

          } else {

            this.notificationService.error(
              response.message || 'Unable to share tickets.'
            );
          }
        },

        error: (error) => {

          this.sharing = false;

          console.error('Share Tickets Error:', error);

          this.notificationService.error(
            error?.error?.message ||
            'Unable to share tickets.'
          );

          this.cdr.detectChanges();
        }
      });
  }



  cancelShare(): void {

    this.showShareForm = false;
    this.selectedTicket = null;
    this.shareQuantity = 1;

    this.cdr.detectChanges();
  }


























  // ======================================================
  // Reduce Shared Tickets
  // ======================================================

  showReduceForm = false;

  reduceQuantity = 1;

  reducing = false;

  reduceFormFields: FormField[] = [
    {
      key: 'quantity',
      label: 'Quantity to Reduce',
      type: 'number',
      required: true,
      placeholder: 'Enter quantity'
    }
  ];

  reduceFormButtons: FormButton[] = [
    {
      label: 'Reduce Shared Tickets',
      type: 'submit'
    },
    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    }
  ];

  openReduceDialog(ticket: AvailableTicketModel): void {

    this.selectedTicket = ticket;

    const maxReduceQuantity =
      ticket.sharedQuantity - ticket.soldQuantity;

    // Nothing can be reduced
    if (maxReduceQuantity <= 0) {

      this.notificationService.error(
        'There are no shared tickets available to reduce.'
      );

      return;
    }

    this.reduceFormFields = [
      {
        key: 'quantity',
        label: `Quantity to Reduce (Max: ${maxReduceQuantity})`,
        type: 'number',
        required: true,
        placeholder: 'Enter quantity'
      }
    ];

    this.showReduceForm = true;

    this.cdr.detectChanges();
  }

  reduceSharedQuantity(formData: any): void {

    if (!this.selectedTicket) {
      return;
    }

    const quantity = Number(formData.quantity);

    const maxReduceQuantity =
      this.selectedTicket.sharedQuantity -
      this.selectedTicket.soldQuantity;

    if (!Number.isInteger(quantity) || quantity <= 0) {

      this.notificationService.error(
        'Reduce quantity must be a valid number greater than zero.'
      );

      return;
    }

    if (maxReduceQuantity <= 0) {

      this.notificationService.error(
        'There are no shared tickets available to reduce.'
      );

      return;
    }

    if (quantity > maxReduceQuantity) {

      this.notificationService.error(
        `You can reduce maximum ${maxReduceQuantity} tickets.`
      );

      return;
    }

    const request: ReduceSharedTicketQuantityRequest = {
      purchaseInvoiceItemId:
        this.selectedTicket.purchaseInvoiceItemId,

      quantity: quantity
    };

    this.reducing = true;

    this.InventoryServices
      .reduceSharedTicketQuantity(request)
      .subscribe({

        next: (response) => {

          this.reducing = false;

          if (response.status === true) {

            this.notificationService.success(
              response.message ||
              'Shared ticket quantity reduced successfully.'
            );

            // Close form
            this.showReduceForm = false;

            // Clear selected ticket
            this.selectedTicket = null;

            // Reset quantity
            this.reduceQuantity = 1;

            // Refresh table
            this.loadAvailableTickets();

            this.cdr.detectChanges();

          } else {

            this.notificationService.error(
              response.message ||
              'Unable to reduce shared ticket quantity.'
            );
          }
        },

        error: (error) => {

          this.reducing = false;

          console.error(
            'Reduce Shared Ticket Error:',
            error
          );

          this.notificationService.error(
            error?.error?.message ||
            'Unable to reduce shared ticket quantity.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  cancelReduce(): void {

    this.showReduceForm = false;

    this.selectedTicket = null;

    this.reduceQuantity = 1;

    this.cdr.detectChanges();
  }




















  // Passenger Type Prices
  // ======================================================
  // Passenger Type Prices
  // ======================================================

  showPassengerPriceModal = false;

  selectedPassengerPriceTicket: AvailableTicketModel | null = null;

  passengerPrices: SharedTicketPassengerPrice[] = [];

  passengerPriceLoading = false;

  passengerPriceSaving = false;


  // Add form

  showPassengerPriceAddForm = false;


  // Edit form

  showPassengerPriceEditForm = false;

  selectedPassengerPrice: SharedTicketPassengerPrice | null = null;


  // Passenger type dropdown

  passengerTypeOptions: {
    label: string;
    value: number;
  }[] = [];


  passengerPriceColumns: TableColumn[] = [
    {
      key: 'passengerTypeName',
      label: 'Passenger Type',
      type: 'text'
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number'
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      type: 'date'
    }
  ];


  passengerPriceActions: TableAction[] = [
    {
      type: 'edit',
      label: 'Edit',
      icon: 'fa fa-edit'
    }
  ];


  passengerPriceAddFields: FormField[] = [
    {
      key: 'passengerTypeId',
      label: 'Passenger Type',
      type: 'select',
      placeholder: 'Select Passenger Type',
      required: true,
      options: []
    },
    {
      key: 'price',
      label: 'Passenger Price',
      type: 'number',
      placeholder: 'Enter passenger price',
      required: true
    }
  ];

  passengerPriceAddButtons: FormButton[] = [
    {
      label: 'Add Price',
      type: 'submit'
    },
    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    }
  ];

  passengerPriceEditFields: FormField[] = [
    {
      key: 'price',
      label: 'Passenger Price',
      type: 'number',
      placeholder: 'Enter passenger price',
      required: true
    }
  ];
  passengerPriceEditButtons: FormButton[] = [
    {
      label: 'Update Price',
      type: 'submit'
    },
    {
      label: 'Cancel',
      type: 'button',
      style: 'secondary'
    }
  ];


 openPassengerPriceModal(ticket: AvailableTicketModel): void {

  // 1. Reset everything
  this.selectedPassengerPriceTicket = ticket;
  this.showPassengerPriceAddForm = false;
  this.showPassengerPriceEditForm = false;
  this.selectedPassengerPrice = null;

  this.passengerPrices = [];

  this.showPassengerPriceModal = true;

  this.cdr.detectChanges();

  this.loadPassengerPrices();
}

  closePassengerPriceModal(): void {

    this.showPassengerPriceModal = false;

    this.showPassengerPriceAddForm = false;

    this.showPassengerPriceEditForm = false;

    this.selectedPassengerPriceTicket = null;

    this.selectedPassengerPrice = null;

    this.passengerPrices = [];

    this.cdr.detectChanges();
  }



  loadPassengerPrices(): void {

    if (!this.selectedPassengerPriceTicket) {
      return;
    }

    const purchaseInvoiceItemId =
      this.selectedPassengerPriceTicket.purchaseInvoiceItemId;

    this.passengerPriceLoading = true;

    this.passengerTicketPriceService
      .getSharedTicketPassengerPrices(
        purchaseInvoiceItemId
      )
      .pipe(
        finalize(() => {

          this.passengerPriceLoading = false;

          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: (response) => {

          console.log(
            '🔥 PASSENGER PRICES RESPONSE:',
            response
          );

          if (
            response?.status === true &&
            response?.statusCode === 200 &&
            Array.isArray(response?.data)
          ) {

            this.passengerPrices = [
              ...response.data
            ];

          } else {

            this.passengerPrices = [];

          }

        },

        error: (error) => {

          console.error(
            'GET Passenger Prices Error:',
            error
          );

          this.passengerPrices = [];

        }

      });
  }







  openPassengerPriceAddForm(): void {

    if (!this.selectedPassengerPriceTicket) {
      return;
    }

    this.passengerPriceAddFields =
      this.passengerPriceAddFields.map(field => {

        if (field.key === 'passengerTypeId') {

          return {
            ...field,
            options: this.passengerTypeOptions
          };

        }

        return field;

      });

       this.loadPassengerTypes();
    this.showPassengerPriceAddForm = true;

    this.cdr.detectChanges();
  }


  closePassengerPriceAddForm(): void {

  this.showPassengerPriceAddForm = false;

  this.cdr.detectChanges();
}



  addPassengerPrice(formData: any): void {

    if (!this.selectedPassengerPriceTicket) {
      return;
    }

    const passengerTypeId =
      Number(formData.passengerTypeId);

    const price =
      Number(formData.price);


    // Passenger type validation

    if (!passengerTypeId) {

      this.notificationService.error(
        'Please select passenger type.'
      );

      return;
    }


    // Price validation

    if (
      Number.isNaN(price) ||
      price < 0
    ) {

      this.notificationService.error(
        'Passenger price cannot be negative.'
      );

      return;
    }


    const request:
      AddSharedTicketPassengerPriceRequest = {

      purchaseInvoiceItemId:
        this.selectedPassengerPriceTicket
          .purchaseInvoiceItemId,

      passengerTypeId:
        passengerTypeId,

      price:
        price
    };


    console.log(
      '🔥 ADD PASSENGER PRICE REQUEST:',
      request
    );


    this.passengerPriceSaving = true;


    this.passengerTicketPriceService
      .addSharedTicketPassengerPrice(request)
      .pipe(
        finalize(() => {

          this.passengerPriceSaving = false;

          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: (response) => {

          console.log(
            '🔥 ADD PASSENGER PRICE RESPONSE:',
            response
          );


          if (response?.status === true) {

            this.notificationService.success(
              response.message ||
              'Passenger price added successfully.'
            );


            this.showPassengerPriceAddForm = false;


            // GET is source of truth

            this.loadPassengerPrices();


            return;
          }


          this.notificationService.error(
            response?.message ||
            'Unable to add passenger price.'
          );

        },


        error: (error) => {

          console.error(
            'ADD Passenger Price Error:',
            error
          );


          this.notificationService.error(
            error?.error?.message ||
            'Unable to add passenger price.'
          );

        }

      });
  }



  openPassengerPriceEditForm(
    price: SharedTicketPassengerPrice
  ): void {

    this.selectedPassengerPrice = {
      ...price
    };

    this.showPassengerPriceEditForm = true;

    this.cdr.detectChanges();
  }

  closePassengerPriceEditForm(): void {

    this.showPassengerPriceEditForm = false;

    this.selectedPassengerPrice = null;

    this.cdr.detectChanges();
  }


  updatePassengerPrice(formData: any): void {

    if (!this.selectedPassengerPrice) {
      return;
    }

    const price =
      Number(formData.price);


    if (
      Number.isNaN(price) ||
      price < 0
    ) {

      this.notificationService.error(
        'Passenger price cannot be negative.'
      );

      return;
    }


    const request:
      UpdateSharedTicketPassengerPriceRequest = {

      sharedTicketPassengerPriceId:
        this.selectedPassengerPrice
          .sharedTicketPassengerPriceId,

      purchaseInvoiceItemId:
        this.selectedPassengerPrice
          .purchaseInvoiceItemId,

      price:
        price
    };


    console.log(
      '🔥 UPDATE PASSENGER PRICE REQUEST:',
      request
    );


    this.passengerPriceSaving = true;


    this.passengerTicketPriceService
      .updateSharedTicketPassengerPrice(request)
      .pipe(
        finalize(() => {

          this.passengerPriceSaving = false;

          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: (response) => {

          console.log(
            '🔥 UPDATE PASSENGER PRICE RESPONSE:',
            response
          );


          if (response?.status === true) {

            this.notificationService.success(
              response.message ||
              'Passenger price updated successfully.'
            );


            this.showPassengerPriceEditForm = false;

            this.selectedPassengerPrice = null;


            // Reload from DB

            this.loadPassengerPrices();


            return;
          }


          this.notificationService.error(
            response?.message ||
            'Unable to update passenger price.'
          );

        },


        error: (error) => {

          console.error(
            'UPDATE Passenger Price Error:',
            error
          );


          this.notificationService.error(
            error?.error?.message ||
            'Unable to update passenger price.'
          );

        }

      });
  }


  onPassengerPriceAction(
    event: any
  ): void {

    if (event.action?.type === 'edit') {

      this.openPassengerPriceEditForm(
        event.row as SharedTicketPassengerPrice
      );

    }

  }









  // Load Passenger Types Dropdown
loadPassengerTypes(): void {

  this.GlobalDropdownService
    .getPassengerTypes()
    .subscribe({
      next: (response) => {

        console.log(
          '🔥 PASSENGER TYPES RESPONSE:',
          response
        );

        if (
          response?.status === true &&
          Array.isArray(response?.data)
        ) {

          this.passengerTypeOptions =
            response.data.map((item: any) => ({
              label: item.Text,
              value: Number(item.Value)
            }));

          console.log(
            '🔥 PASSENGER TYPE OPTIONS:',
            this.passengerTypeOptions
          );

          this.passengerPriceAddFields =
            this.passengerPriceAddFields.map(field => {

              if (field.key === 'passengerTypeId') {

                return {
                  ...field,
                  options: this.passengerTypeOptions
                };

              }

              return field;

            });

        } else {

          this.passengerTypeOptions = [];

        }

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Passenger Types Dropdown Error:',
          error
        );

        this.passengerTypeOptions = [];

        this.cdr.detectChanges();
      }
    });
}
}