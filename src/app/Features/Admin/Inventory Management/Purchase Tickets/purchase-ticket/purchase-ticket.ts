import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AddTicketPurchaseRequest, PurchasedInvoice, PurchasedInvoicePayment, PurchasedInvoiceSearchRequest, UpdatePurchasedInvoicePaymentRequest } from '../../../Admin Models/Ticket Inventory Models/inventory-model';
import { InventoryServices } from '../../../Admin Services/Inventory Services/inventory-services';
import { DataTable, TableAction, TableColumn } from '../../../../../Shared/components/DataTables/data-table/data-table';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DownloadpdfService } from '../../../../../Core/Services/Download pdf Service/downloadpdf-service';
import { NotificationService } from '../../../../../Core/Services/Notification Services/notification-service';
import { FormsModule } from '@angular/forms';
import { FormField, forms, FormButton } from '../../../../../Shared/components/Forms/forms/forms';
import { DropdownItem, DropdownResponse, GlobalDropdownService } from '../../../../../Core/Services/Dropdown Services/global-dropdown-service';
import { Button } from '../../../../../Shared/components/button/button';


@Component({
  selector: 'app-purchase-ticket',
  imports: [
    DatePipe,
    DecimalPipe,
    DataTable,
    FormsModule,
    forms,
    Button
  ],
  templateUrl: './purchase-ticket.html',
  styleUrl: './purchase-ticket.scss',
})
export class PurchaseTicket implements OnInit {

  private invoiceService = inject(InventoryServices);
  private cdr = inject(ChangeDetectorRef);
  private pdfService = inject(DownloadpdfService);
  private readonly globalDropdownService = inject(GlobalDropdownService);

  private notificationService = inject(NotificationService);

  invoices: PurchasedInvoice[] = [];

  loading = false;

  totalRecords = 0;

  pageNumber = 1;
  pageSize = 10;

  search = '';

  fromDate: string | null = null;
  toDate: string | null = null;

  filterFromDate: string | null = null;
  filterToDate: string | null = null;


  columns: TableColumn[] = [

    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      type: 'text',
      sortable: true
    },

    {
      key: 'invoiceDate',
      label: 'Invoice Date',
      type: 'date',
      sortable: true
    },

    {
      key: 'purchasedFrom',
      label: 'Purchased From',
      type: 'text',
      sortable: true
    },

    {
      key: 'subTotal',
      label: 'Sub Total',
      type: 'number',
      sortable: true
    },

    {
      key: 'paidAmount',
      label: 'Paid',
      type: 'number',
      sortable: true
    },

    {
      key: 'remainingAmount',
      label: 'Remaining',
      type: 'number',
      sortable: true
    },

    {
      key: 'validUntil',
      label: 'validUntil',
      type: 'text',
      sortable: true
    }

  ];



  actions: TableAction[] = [
    {
      label: 'View',
      icon: 'fa fa-eye',
      type: 'view'
    },
    {
      label: 'Payment',
      icon: 'fa fa-credit-card',
      type: 'payment'
    }
  ];


  ngOnInit(): void {
    this.loadInvoices();
  }



  loadInvoices(): void {

    this.loading = true;

    const request: PurchasedInvoiceSearchRequest = {

      search: this.search?.trim() || '',

      pageNumber: this.pageNumber,

      pageSize: this.pageSize,

      fromDate: this.fromDate,

      toDate: this.toDate
    };


    this.invoiceService
      .getPurchasedInvoices(request)
      .subscribe({

        next: (response: any) => {

          if (response?.statusCode === 200 && response?.success) {

            this.invoices =
              response.data?.data ??
              response.data ??
              [];

            this.totalRecords =
              response.data?.totalCount ??
              this.invoices.length;

          }
          else {

            this.invoices = [];

            this.totalRecords = 0;
          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading purchased invoices:',
            error
          );

          this.invoices = [];

          this.totalRecords = 0;

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }


  onSearch(value: string): void {

    this.search = value;

    this.pageNumber = 1;

    this.loadInvoices();
  }


  onPageChange(page: number): void {

    this.pageNumber = page;

    this.loadInvoices();
  }


  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.loadInvoices();
  }



  onDateFilter(): void {

    this.fromDate = this.filterFromDate;
    this.toDate = this.filterToDate;

    this.pageNumber = 1;

    this.loadInvoices();
  }

  clearDateFilter(): void {

    this.filterFromDate = null;
    this.filterToDate = null;

    this.fromDate = null;
    this.toDate = null;

    this.pageNumber = 1;

    this.loadInvoices();
  }





  onActionClick(event: any): void {

    const invoice = event.row as PurchasedInvoice;

    if (!invoice) {
      return;
    }



    if (event.action?.type === 'view') {

      this.selectedInvoice = invoice;

      this.showInvoice = true;

      return;
    }

    if (event.action?.type === 'payment') {

      this.selectedInvoice = invoice;

      if (!invoice.paymentHistory || invoice.paymentHistory.length === 0) {
        this.notificationService.error(
          'No payment history found for this invoice.'
        );
        return;
      }

      // Select latest payment
      const payment =
        invoice.paymentHistory[invoice.paymentHistory.length - 1];

      this.openPaymentEditForm(payment);

      return;
    }



    if (event.action?.type === 'download') {

      this.pdfService
        .downloadInvoice(invoice)
        .then(() => {

          this.notificationService.success(
            `Invoice ${invoice.invoiceNumber} downloaded successfully.`
          );

        })
        .catch(error => {

          console.error(
            'PDF generation failed:',
            error
          );

          this.notificationService.error(
            `Failed to download invoice ${invoice.invoiceNumber}.`
          );

        });

      return;
    }
  }


  // =========================================================
  // DOWNLOAD PDF FROM PREVIEW
  // =========================================================

  async downloadInvoicePdf(): Promise<void> {

    if (!this.selectedInvoice) {
      return;
    }

    const invoice = this.selectedInvoice;

    try {

      await this.pdfService.downloadInvoice(invoice);

      this.notificationService.success(
        `Invoice ${invoice.invoiceNumber} downloaded successfully.`
      );

    } catch (error) {

      console.error(
        'PDF generation failed:',
        error
      );

      this.notificationService.error(
        `Failed to download invoice ${invoice.invoiceNumber}.`
      );
    }
  }








  // View Invoice Details
  selectedInvoice: PurchasedInvoice | null = null;

  showInvoice = false;

  viewInvoice(invoice: PurchasedInvoice): void {


  }

  printInvoice(): void {

    window.print();

  }

  closeInvoice(): void {

    this.showInvoice = false;

    this.selectedInvoice = null;
  }








































  // Add Tickets To Inventory
  showAddForm = false;
  openAddForm(): void {

    this.showAddForm = true;

    // Load dropdowns only when form opens
    this.loadAirlines();
    this.loadAirports();
    this.loadPaymentMethods();
    this.loadTicketTypes();
  }

  closeAddForm(): void {
    this.showAddForm = false;
  }

  ticketFormFields: FormField[] = [

    {
      key: 'purchasedFrom',
      label: 'Purchased From',
      type: 'text',
      placeholder: 'Enter supplier / airline',
      required: true
    },

    {
      key: 'purchaseReference',
      label: 'Purchase Reference',
      type: 'text',
      placeholder: 'Enter purchase reference',
      required: false
    },

    {
      key: 'invoiceDate',
      label: 'Invoice Date',
      type: 'date',
      required: true
    },

    // Airline
    {
      key: 'airlineId',
      label: 'Airline',
      type: 'select',
      placeholder: 'Select airline',
      required: true,
      options: []
    },

    // From Airport
    {
      key: 'fromAirportId',
      label: 'From Airport',
      type: 'select',
      placeholder: 'Select departure airport',
      required: true,
      options: []
    },

    // To Airport
    {
      key: 'toAirportId',
      label: 'To Airport',
      type: 'select',
      placeholder: 'Select arrival airport',
      required: true,
      options: []
    },

    {
      key: 'departureDateTime',
      label: 'Departure',
      type: 'date',
      required: true
    },

    {
      key: 'arrivalDateTime',
      label: 'Arrival',
      type: 'date',
      required: true
    },

    {
      key: 'quantity',
      label: 'Quantity',
      type: 'number',
      placeholder: 'Enter quantity',
      required: true
    },

    {
      key: 'ticketTypeId',
      label: 'Ticket Type',
      type: 'select',
      placeholder: 'Select Ticket Type',
      required: true,
      options: []
    },

    {
      key: 'purchasePrice',
      label: 'Purchase Price',
      type: 'number',
      placeholder: 'Enter purchase price',
      required: true
    },

    {
      key: 'sellingPrice',
      label: 'Selling Price',
      type: 'number',
      placeholder: 'Enter selling price',
      required: true
    },

    {
      key: 'checkedBaggageKg',
      label: 'Checked Baggage (KG)',
      type: 'number',
      placeholder: '0',
      required: false
    },

    {
      key: 'handBaggageKg',
      label: 'Hand Baggage (KG)',
      type: 'number',
      placeholder: '0',
      required: false
    },

    {
      key: 'personalItemKg',
      label: 'Personal Item (KG)',
      type: 'number',
      placeholder: '0',
      required: false
    },

    {
      key: 'validFrom',
      label: 'Valid From',
      type: 'date',
      required: true
    },

    {
      key: 'validUntil',
      label: 'Valid Until',
      type: 'date',
      required: true
    },

    {
      key: 'paidAmount',
      label: 'Paid Amount',
      type: 'number',
      placeholder: 'Enter paid amount',
      required: true
    },

    // Payment Method
    {
      key: 'paymentMethodId',
      label: 'Payment Method',
      type: 'select',
      placeholder: 'Select payment method',
      required: true,
      options: []
    },

    {
      key: 'paymentReference',
      label: 'Payment Reference',
      type: 'text',
      placeholder: 'Enter payment reference',
      required: false
    },

    {
      key: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'Enter remarks',
      required: false
    }

  ];



  formButtons: FormButton[] = [

    {
      label: 'Add Ticket Purchase',
      type: 'submit',
      style: 'primary'
    },
    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    }
  ];
  submitTicketPurchase(formValue: any): void {

    console.log('🔥 SUBMIT TICKET PURCHASE FIRED');
    console.log('FORM VALUE:', formValue);

    const request: AddTicketPurchaseRequest = {
      purchasedFrom: formValue.purchasedFrom,
      purchaseReference: formValue.purchaseReference,
      invoiceDate: formValue.invoiceDate,

      airlineId: Number(formValue.airlineId),
      fromAirportId: Number(formValue.fromAirportId),
      toAirportId: Number(formValue.toAirportId),

      departureDateTime: formValue.departureDateTime,
      arrivalDateTime: formValue.arrivalDateTime,

      quantity: Number(formValue.quantity),

      ticketTypeId: Number(formValue.ticketTypeId),

      purchasePrice: Number(formValue.purchasePrice),
      sellingPrice: Number(formValue.sellingPrice),

      checkedBaggageKg: Number(formValue.checkedBaggageKg || 0),
      handBaggageKg: Number(formValue.handBaggageKg || 0),
      personalItemKg: Number(formValue.personalItemKg || 0),

      validFrom: formValue.validFrom,
      validUntil: formValue.validUntil,

      paidAmount: Number(formValue.paidAmount || 0),
      paymentMethodId: Number(formValue.paymentMethodId),

      paymentReference: formValue.paymentReference || '',
      remarks: formValue.remarks || ''
    };

    console.log('🔥 REQUEST:', request);

    this.loading = true;

    console.log('🔥 CALLING ADD TICKET API');

    this.invoiceService.addTicketPurchase(request).subscribe({
      next: (response: any) => {

        console.log('🔥 API RESPONSE:', response);

        this.loading = false;

        if (response?.success && response?.statusCode === 200) {

          this.notificationService.success(
            response.message || 'Ticket purchase added successfully.'
          );

          this.showAddForm = false;

          this.pageNumber = 1;
          this.loadInvoices();

        } else {

          this.notificationService.error(
            response?.message || 'Unable to add ticket purchase.'
          );
        }
      },

      error: (error) => {

        console.error('🔥 API ERROR:', error);

        this.loading = false;

        this.notificationService.error(
          error?.error?.message ||
          'Failed to add ticket purchase.'
        );
      }
    });
  }




















  // Load Airliens Dropdown
  airlines: any[] = [];
  airlinesLoading = false;

  loadAirlines(): void {

    this.airlinesLoading = true;

    this.globalDropdownService.getAirlinesDropDown().subscribe({

      next: (response: any) => {

        if (response?.status && response?.data) {

          this.airlines = response.data.map((item: any) => ({
            label: item.Text,
            value: item.Value
          }));

        } else {

          this.airlines = [];

        }

        const airlineField = this.ticketFormFields.find(
          (field: FormField) => field.key === 'airlineId'
        );

        if (airlineField) {

          airlineField.options = [...this.airlines];

        }

        // Important: create a new array reference
        this.ticketFormFields = [...this.ticketFormFields];

        this.airlinesLoading = false;

        this.cdr.detectChanges();

        console.log('Ticket form fields:', this.ticketFormFields);

      },

      error: (error) => {

        console.error('Error loading airlines:', error);

        this.airlines = [];
        this.airlinesLoading = false;

        this.cdr.detectChanges();
      }
    });
  }


  updateAirlineDropdown(): void {

    const airlineField = this.ticketFormFields.find(
      (field: FormField) => field.key === 'airlineId'
    );

    if (airlineField) {

      airlineField.options = this.airlines;

      console.log(
        'Airline field options:',
        airlineField.options
      );
    }
  }





















  // Get Airports DropDown
  airports: any[] = [];
  airportsLoading = false;

  loadAirports(): void {

    this.airportsLoading = true;

    this.globalDropdownService.getAirPortsDropDown().subscribe({

      next: (response: any) => {

        if (response?.status && response?.data) {

          this.airports = response.data.map((item: any) => ({
            label: item.Text,
            value: item.Value
          }));

        } else {

          this.airports = [];

        }

        this.airportsLoading = false;

        // Correct method
        this.updateAirportDropdowns();

        this.cdr.detectChanges();

        console.log('Airports:', this.airports);
      },

      error: (error) => {

        console.error('Error loading airports:', error);

        this.airports = [];
        this.airportsLoading = false;

        this.cdr.detectChanges();
      }
    });
  }


  updateAirportDropdowns(): void {

    const fromAirportField = this.ticketFormFields.find(
      (field: FormField) => field.key === 'fromAirportId'
    );

    const toAirportField = this.ticketFormFields.find(
      (field: FormField) => field.key === 'toAirportId'
    );

    if (fromAirportField) {
      fromAirportField.options = [...this.airports];
    }

    if (toAirportField) {
      toAirportField.options = [...this.airports];
    }

    this.ticketFormFields = [...this.ticketFormFields];

  }























  // Payment Methods DropDown
  paymentMethods: any[] = [];
  paymentMethodsLoading = false;

  loadPaymentMethods(onLoaded?: () => void): void {

    this.paymentMethodsLoading = true;

    this.globalDropdownService.getPaymentMethodsDropDown().subscribe({

      next: (response: any) => {

        if (response?.status && response?.data) {

          this.paymentMethods = response.data.map((item: any) => ({
            label: item.Text,
            value: item.Value
          }));

        } else {

          this.paymentMethods = [];

        }

        const paymentMethodField = this.ticketFormFields.find(
          (field: FormField) => field.key === 'paymentMethodId'
        );

        if (paymentMethodField) {

          paymentMethodField.options = [
            ...this.paymentMethods
          ];

        }

        this.ticketFormFields = [
          ...this.ticketFormFields
        ];

        this.paymentMethodsLoading = false;

        this.cdr.detectChanges();

        console.log(
          'Payment Methods:',
          this.paymentMethods
        );

        // If edit form is waiting for payment methods
        onLoaded?.();
      },

      error: (error) => {

        console.error(
          'Error loading payment methods:',
          error
        );

        this.paymentMethods = [];

        this.paymentMethodsLoading = false;

        this.cdr.detectChanges();

        this.notificationService.error(
          error?.error?.message ||
          'Unable to load payment methods.'
        );
      }
    });
  }




  // Load Ticket Types Dropdown
  ticketTypes: any[] = [];
  ticketTypesLoading = false;
  // Load Ticket Types Dropdown
  loadTicketTypes(): void {

    this.ticketTypesLoading = true;

    this.globalDropdownService.getTicketTypesDropDown().subscribe({

      next: (response: any) => {

        if (response?.status && response?.data) {

          this.ticketTypes = response.data.map((item: any) => ({
            label: item.Text,
            value: item.Value
          }));

        } else {

          this.ticketTypes = [];

        }

        const ticketTypeField = this.ticketFormFields.find(
          (field: FormField) => field.key === 'ticketTypeId'
        );

        if (ticketTypeField) {

          ticketTypeField.options = [
            ...this.ticketTypes
          ];

        }

        this.ticketFormFields = [
          ...this.ticketFormFields
        ];

        this.ticketTypesLoading = false;

        this.cdr.detectChanges();

        console.log(
          'Ticket Types:',
          this.ticketTypes
        );
      },

      error: (error) => {

        console.error(
          'Error loading ticket types:',
          error
        );

        this.ticketTypes = [];

        this.ticketTypesLoading = false;

        this.cdr.detectChanges();

        this.notificationService.error(
          error?.error?.message ||
          'Unable to load ticket types.'
        );
      }
    });
  }





























  // Update Inventory Payment Invoices
  selectedPaymentInvoice: PurchasedInvoice | null = null;
  selectedPayment: PurchasedInvoicePayment | null = null;

  showPaymentEditForm = false;
  paymentSubmitting = false;

  paymentEditFormFields: FormField[] = [];

  paymentEditFormButtons: FormButton[] = [

    {
      label: 'Update Payment',
      type: 'submit',
      style: 'primary'
    },
    {
      label: 'Cancel',
      type: 'reset',
      style: 'secondary'
    }
  ];



  openPaymentEditForm(
    payment: PurchasedInvoicePayment
  ): void {

    if (!this.selectedInvoice) {
      return;
    }

    this.selectedPaymentInvoice =
      this.selectedInvoice;

    this.selectedPayment =
      payment;

    if (this.paymentMethods.length > 0) {

      this.buildPaymentEditForm(payment);

      return;
    }

    this.loadPaymentMethods(() => {

      this.buildPaymentEditForm(payment);

    });
  }


  private buildPaymentEditForm(
    payment: PurchasedInvoicePayment
  ): void {

    this.paymentEditFormFields = [
      {
        key: 'paymentAmount',
        label: 'Payment Amount',
        type: 'number',
        placeholder: 'Enter payment amount',
        required: true,
        value: payment.paymentAmount
      },

      {
        key: 'paymentDate',
        label: 'Payment Date',
        type: 'date',
        required: true,
        value: payment.paymentDate
          ? payment.paymentDate.substring(0, 10)
          : ''
      },

      {
        key: 'paymentMethodId',
        label: 'Payment Method',
        type: 'select',
        placeholder: 'Select payment method',
        required: true,
        options: [...this.paymentMethods],
        value: payment.paymentMethodId
      },

      {
        key: 'paymentReference',
        label: 'Payment Reference',
        type: 'text',
        placeholder: 'Enter payment reference',
        required: false,
        value: payment.paymentReference || ''
      },

      {
        key: 'remarks',
        label: 'Remarks',
        type: 'textarea',
        placeholder: 'Enter payment remarks',
        required: false,
        value: payment.paymentRemarks || ''
      }
    ];

    console.log('EDIT PAYMENT:', payment);
    console.log('EDIT FORM FIELDS:', this.paymentEditFormFields);

    this.showPaymentEditForm = true;

    this.cdr.detectChanges();
  }




  updatePayment(formData: any): void {

    if (!this.selectedPaymentInvoice) {
      this.notificationService.error(
        'Invoice not selected.'
      );
      return;
    }

    const paymentAmount = Number(formData.paymentAmount);

    if (!paymentAmount || paymentAmount <= 0) {
      this.notificationService.error(
        'Payment amount must be greater than zero.'
      );
      return;
    }

    const request: UpdatePurchasedInvoicePaymentRequest = {
      purchaseInvoiceId:
        this.selectedPaymentInvoice.purchaseInvoiceId,

      paymentAmount: paymentAmount,

      paymentDate:
        formData.paymentDate,

      paymentMethodId:
        Number(formData.paymentMethodId),

      paymentReference:
        formData.paymentReference || '',

      remarks:
        formData.remarks || ''
    };

    console.log('UPDATE PAYMENT REQUEST:', request);

    this.paymentSubmitting = true;

    this.invoiceService
      .updatePurchasedInvoicePayment(request)
      .subscribe({

        next: (response: any) => {

          this.paymentSubmitting = false;

          if (response?.success === true) {

            this.notificationService.success(
              response.message ||
              'Payment updated successfully.'
            );

            this.showPaymentEditForm = false;
            this.selectedPayment = null;
            this.selectedPaymentInvoice = null;

            this.loadInvoices();

          } else {

            this.notificationService.error(
              response?.message ||
              'Unable to update payment.'
            );
          }
        },

        error: (error: any) => {

          this.paymentSubmitting = false;

          console.error('Update Payment Error:', error);

          this.notificationService.error(
            error?.error?.message ||
            'Unable to update payment.'
          );
        }
      });
  }


  closePaymentEditForm(): void {
    this.showPaymentEditForm = false;
    this.selectedPayment = null;
    this.selectedPaymentInvoice = null;
  }


}

