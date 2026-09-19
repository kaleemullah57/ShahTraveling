
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { DataTable, TableAction } from '../../../../../../Shared/components/DataTables/data-table/data-table';
import { AvailableTicketModel, AvailableTicketsRequest, ShareTicketsRequest, UpdateTicketSellingPriceRequest } from '../../../../Admin Models/Ticket Inventory Models/available-tickets';

import { InventoryServices } from '../../../../Admin Services/Inventory Services/inventory-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../../../Shared/components/button/button';
import { FormButton, FormField, forms } from '../../../../../../Shared/components/Forms/forms/forms';
import { NotificationService } from '../../../../../../Core/Services/Notification Services/notification-service';

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
export class AvailableTickets implements OnInit {

  private InventoryServices = inject(InventoryServices);
  private notificationService = inject(NotificationService)
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


  columns = [
    { key: 'airlineName', label: 'Airline' },
    { key: 'fromAirport', label: 'From' },
    { key: 'toAirport', label: 'To' },
    { key: 'departureDateTime', label: 'Departure' },
    { key: 'arrivalDateTime', label: 'Arrival' },
    { key: 'quantity', label: 'Available' },
    { key: 'sellingPrice', label: 'Selling Price' },
    { key: 'validUntil', label: 'Valid Until' }
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
    }
  ];


  ngOnInit(): void {
    this.loadAvailableTickets();
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
          if (response.status && response.data) {

            this.tickets = response.data;

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

  onActionClick(event: { action: TableAction; row: AvailableTicketModel }): void {
    if (event.action.type === 'view') {
      this.selectedTicket = event.row;
      this.showViewModal = true;

      this.cdr.detectChanges();
    }


    if (event.action.type === 'edit') {
      this.openSellingPriceForm(event.row);
    }


    if (event.action.type == 'share') {

      const ticket = event.row;

      this.openShareDialog(ticket);
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
}