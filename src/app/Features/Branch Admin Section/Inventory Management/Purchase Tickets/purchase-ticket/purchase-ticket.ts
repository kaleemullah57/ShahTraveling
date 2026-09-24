import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AddTicketPurchaseRequest, PurchasedInvoice, PurchasedInvoicePayment, PurchasedInvoiceSearchRequest, TicketPurchaseStop, UpdatePurchasedInvoicePaymentRequest } from '../../../Admin Models/Ticket Inventory Models/inventory-model';
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




































// ============================================================
// ADD TICKETS TO INVENTORY
// ============================================================

stops: TicketPurchaseStop[] = [];

showAddForm = false;


// ============================================================
// FLIGHT CONFIGURATION
// ============================================================

flightJourneyTypeId: number | null = null;

flightRouteTypeId: number | null = null;


// ============================================================
// DROPDOWNS
// ============================================================

flightTypes: any[] = [];

flightRouteTypes: any[] = [];

flightTypesLoading = false;

flightRouteTypesLoading = false;


// ============================================================
// OPEN ADD FORM
// ============================================================

openAddForm(): void {
  this.showAddForm = true;

  this.flightJourneyTypeId = null;
  this.flightRouteTypeId = null;
  this.stops = [];

  this.loadAirlines();
  this.loadAirports();
  this.loadPaymentMethods();
  this.loadTicketTypes();

  this.loadFlightTypes();
  this.loadFlightRouteTypes();

  this.cdr.detectChanges();
}


// ============================================================
// CLOSE ADD FORM
// ============================================================

closeAddForm(): void {

  this.showAddForm = false;

  this.flightJourneyTypeId = null;

  this.flightRouteTypeId = null;

  this.stops = [];

  this.cdr.detectChanges();
}


// ============================================================
// SHOW MAIN FORM ONLY AFTER BOTH ARE SELECTED
// ============================================================

get canShowTicketFields(): boolean {

  return (
    this.flightJourneyTypeId !== null &&
    this.flightRouteTypeId !== null
  );
}


// ============================================================
// FLIGHT JOURNEY TYPE CHANGE
// ============================================================

onFlightJourneyTypeChange(value: any): void {

  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {

    this.flightJourneyTypeId = null;

    return;
  }

  this.flightJourneyTypeId = Number(value);


  this.cdr.detectChanges();
}


// ============================================================
// FLIGHT ROUTE TYPE CHANGE
// ============================================================

onFlightRouteTypeChange(value: any): void {

  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {

    this.flightRouteTypeId = null;

    this.stops = [];

    return;
  }

  this.flightRouteTypeId = Number(value);

  this.handleRouteTypeChange(
    this.flightRouteTypeId
  );

  this.cdr.detectChanges();
}


// ============================================================
// CREATE STOP
// ============================================================

createStop(
  stopNumber: number
): TicketPurchaseStop {

  return {

    stopNumber: stopNumber,

    airportId: 0,

    arrivalDateTime: '',

    departureDateTime: ''

  };
}


// ============================================================
// HANDLE ROUTE TYPE
//
// 1 = Direct
// 2 = One Stop
// 3 = Two Stops
// 4 = Multiple Stops
// ============================================================

handleRouteTypeChange(
  routeTypeId: number
): void {

  switch (routeTypeId) {

    // --------------------------------------------------------
    // DIRECT
    // --------------------------------------------------------

    case 1:

      this.stops = [];

      break;


    // --------------------------------------------------------
    // ONE STOP
    // --------------------------------------------------------

    case 2:

      this.stops = [

        this.createStop(1)

      ];

      break;


    // --------------------------------------------------------
    // TWO STOPS
    // --------------------------------------------------------

    case 3:

      this.stops = [

        this.createStop(1),

        this.createStop(2)

      ];

      break;


    // --------------------------------------------------------
    // MULTIPLE STOPS
    // Minimum 2
    // --------------------------------------------------------

    case 4:

      this.stops = [

        this.createStop(1),

        this.createStop(2)

      ];

      break;


    // --------------------------------------------------------
    // INVALID
    // --------------------------------------------------------

    default:

      this.stops = [];

      break;
  }


  this.cdr.detectChanges();
}


// ============================================================
// ADD STOP
// Only Multiple Stops
// ============================================================

addStop(): void {

  if (this.flightRouteTypeId !== 4) {

    return;
  }

  const nextStopNumber =
    this.stops.length + 1;

  this.stops.push(
    this.createStop(nextStopNumber)
  );

  this.cdr.detectChanges();
}


// ============================================================
// REMOVE STOP
// Only Multiple Stops
// Minimum 2 stops
// ============================================================

removeStop(index: number): void {

  if (this.flightRouteTypeId !== 4) {

    return;
  }

  if (this.stops.length <= 2) {

    return;
  }

  this.stops.splice(index, 1);

  this.stops =
    this.stops.map(
      (stop, i) => ({

        ...stop,

        stopNumber: i + 1

      })
    );

  this.cdr.detectChanges();
}








// ============================================================
// TICKET FORM FIELDS
// IMPORTANT:
// flightJourneyTypeId and flightRouteTypeId are NOT HERE.
// They are selected in the header.
// ============================================================

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
     type: 'datetime-local',
    required: true
  },

  {
    key: 'airlineId',
    label: 'Airline',
    type: 'select',
    placeholder: 'Select airline',
    required: true,
    options: []
  },

  {
    key: 'fromAirportId',
    label: 'From Airport',
    type: 'select',
    placeholder: 'Select departure airport',
    required: true,
    options: []
  },

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
     type: 'datetime-local',
    required: true
  },

  {
    key: 'arrivalDateTime',
    label: 'Arrival',
     type: 'datetime-local',
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
    required: false
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
     type: 'datetime-local',
    required: true
  },

  {
    key: 'validUntil',
    label: 'Valid Until',
     type: 'datetime-local',
    required: true
  },

  {
    key: 'paidAmount',
    label: 'Paid Amount',
    type: 'number',
    placeholder: 'Enter paid amount',
    required: true
  },

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


// ============================================================
// FORM BUTTONS
// ============================================================

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


// ============================================================
// SUBMIT
// ============================================================

submitTicketPurchase(
  formValue: any
): void {
  if (
    this.flightJourneyTypeId === null
  ) {

    this.notificationService.error(
      'Please select Flight Type.'
    );

    return;
  }


  if (
    this.flightRouteTypeId === null
  ) {

    this.notificationService.error(
      'Please select Flight Route Type.'
    );

    return;
  }


  // ========================================================
  // VALIDATE STOPS
  // ========================================================

  if (!this.validateStops()) {

    return;
  }


  // ========================================================
  // BUILD REQUEST
  // ========================================================

  const request: AddTicketPurchaseRequest = {

    purchasedFrom:
      formValue.purchasedFrom,

    purchaseReference:
      formValue.purchaseReference || '',

    invoiceDate:
      formValue.invoiceDate,

    ticketTypeId:
      Number(formValue.ticketTypeId),

    airlineId:
      Number(formValue.airlineId),

    fromAirportId:
      Number(formValue.fromAirportId),

    toAirportId:
      Number(formValue.toAirportId),


    // IMPORTANT
    // These come from header
    flightJourneyTypeId:
      this.flightJourneyTypeId,

    flightRouteTypeId:
      this.flightRouteTypeId,


    // IMPORTANT
    stops:
      this.stops.map(
        stop => ({

          stopNumber:
            stop.stopNumber,

          airportId:
            Number(stop.airportId),

          arrivalDateTime:
            stop.arrivalDateTime,

          departureDateTime:
            stop.departureDateTime

        })
      ),


    departureDateTime:
      formValue.departureDateTime,

    arrivalDateTime:
      formValue.arrivalDateTime,

    quantity:
      Number(formValue.quantity),

    purchasePrice:
      Number(formValue.purchasePrice),

    sellingPrice:
      formValue.sellingPrice !== null &&
      formValue.sellingPrice !== ''
        ? Number(formValue.sellingPrice)
        : null,

    checkedBaggageKg:
      Number(
        formValue.checkedBaggageKg || 0
      ),

    handBaggageKg:
      Number(
        formValue.handBaggageKg || 0
      ),

    personalItemKg:
      Number(
        formValue.personalItemKg || 0
      ),

    validFrom:
      formValue.validFrom,

    validUntil:
      formValue.validUntil,

    paidAmount:
      Number(
        formValue.paidAmount || 0
      ),

    paymentMethodId:
      formValue.paymentMethodId
        ? Number(formValue.paymentMethodId)
        : null,

    paymentReference:
      formValue.paymentReference || '',

    remarks:
      formValue.remarks || ''

  };



  // ========================================================
  // API CALL
  // ========================================================

  this.loading = true;

  this.invoiceService
    .addTicketPurchase(request)
    .subscribe({

      next: (response: any) => {

        this.loading = false;


        if (
          response?.success &&
          response?.statusCode === 200
        ) {

          this.notificationService.success(
            response.message ||
            'Ticket purchase added successfully.'
          );

          this.showAddForm = false;

          this.flightJourneyTypeId = null;

          this.flightRouteTypeId = null;

          this.stops = [];

          this.pageNumber = 1;

          this.loadInvoices();

        }
        else {

          this.notificationService.error(
            response?.message ||
            'Unable to add ticket purchase.'
          );

        }

      },

error: (error) => {

  this.loading = false;
  this.showAddForm = true;

  const message =
    error?.error?.message ||
    error?.message ||
    'Failed to add ticket purchase.';

  this.notificationService.error(message);

  this.cdr.detectChanges();
}

    });
}


// ============================================================
// VALIDATE STOPS
// ============================================================

validateStops(): boolean {

  // ----------------------------------------------------------
  // DIRECT
  // ----------------------------------------------------------

  if (
    this.flightRouteTypeId === 1
  ) {

    if (this.stops.length !== 0) {

      this.notificationService.error(
        'Direct flight cannot have stops.'
      );

      return false;
    }

    return true;
  }


  // ----------------------------------------------------------
  // ONE STOP
  // ----------------------------------------------------------

  if (
    this.flightRouteTypeId === 2
  ) {

    if (this.stops.length !== 1) {

      this.notificationService.error(
        'One Stop flight must have exactly one stop.'
      );

      return false;
    }
  }


  // ----------------------------------------------------------
  // TWO STOPS
  // ----------------------------------------------------------

  if (
    this.flightRouteTypeId === 3
  ) {

    if (this.stops.length !== 2) {

      this.notificationService.error(
        'Two Stops flight must have exactly two stops.'
      );

      return false;
    }
  }


  // ----------------------------------------------------------
  // MULTIPLE STOPS
  // ----------------------------------------------------------

  if (
    this.flightRouteTypeId === 4
  ) {

    if (this.stops.length < 2) {

      this.notificationService.error(
        'Multiple Stops flight must have at least two stops.'
      );

      return false;
    }
  }


  // ----------------------------------------------------------
  // VALIDATE EACH STOP
  // ----------------------------------------------------------

  for (
    const stop of this.stops
  ) {

    if (
      !stop.airportId ||
      stop.airportId <= 0
    ) {

      this.notificationService.error(
        `Please select airport for Stop ${stop.stopNumber}.`
      );

      return false;
    }


    if (
      !stop.arrivalDateTime
    ) {

      this.notificationService.error(
        `Please select arrival date/time for Stop ${stop.stopNumber}.`
      );

      return false;
    }


    if (
      !stop.departureDateTime
    ) {

      this.notificationService.error(
        `Please select departure date/time for Stop ${stop.stopNumber}.`
      );

      return false;
    }

  }


  return true;
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

      },

      error: (error) => {
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

        this.updateAirportDropdowns();

        this.cdr.detectChanges();
      },

      error: (error) => {

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

        // If edit form is waiting for payment methods
        onLoaded?.();
      },

      error: (error) => {

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
      },

      error: (error) => {

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






  loadFlightTypes(): void {

    this.globalDropdownService.getFlightTypesDropDown().subscribe({

      next: (response: any) => {

        if (response?.status && response?.data) {

          this.flightTypes = response.data.map((item: any) => ({
            label: item.Text,
            value: item.Value
          }));

        } else {

          this.flightTypes = [];

        }

        this.updateFlightTypeDropdown();

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.flightTypes = [];

        this.cdr.detectChanges();
      }
    });
  }
  updateFlightTypeDropdown(): void {

    const field = this.ticketFormFields.find(
      (field: FormField) => field.key === 'flightJourneyTypeId'
    );

    if (field) {
      field.options = [...this.flightTypes];
    }

    this.ticketFormFields = [...this.ticketFormFields];
  }













  loadFlightRouteTypes(): void {

    this.globalDropdownService.getFlightRouteTypesDropDown().subscribe({

      next: (response: any) => {

        if (response?.status && response?.data) {

          this.flightRouteTypes = response.data.map((item: any) => ({
            label: item.Text,
            value: item.Value
          }));

        } else {

          this.flightRouteTypes = [];

        }

        this.updateFlightRouteTypeDropdown();

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.flightRouteTypes = [];

        this.cdr.detectChanges();
      }
    });
  }
  updateFlightRouteTypeDropdown(): void {

    const field = this.ticketFormFields.find(
      (field: FormField) => field.key === 'flightRouteTypeId'
    );

    if (field) {
      field.options = [...this.flightRouteTypes];
    }

    this.ticketFormFields = [...this.ticketFormFields];
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
        type: 'datetime-local',
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

