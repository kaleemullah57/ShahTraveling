
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PurchasedInvoice, PurchasedInvoiceSearchRequest } from '../../../Admin Models/Ticket Inventory Models/inventory-model';
import { InventoryServices } from '../../../Admin Services/Inventory Services/inventory-services';
import { DataTable, TableAction, TableColumn } from '../../../../../Shared/components/DataTables/data-table/data-table';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DownloadpdfService } from '../../../../../Core/Services/Download pdf Service/downloadpdf-service';

@Component({
  selector: 'app-purchase-ticket',
   imports: [
    DatePipe,
    DecimalPipe,
    DataTable
  ],
  templateUrl: './purchase-ticket.html',
  styleUrl: './purchase-ticket.scss',
})
export class PurchaseTicket implements OnInit {

  private invoiceService = inject(InventoryServices);
  private cdr = inject(ChangeDetectorRef);
  private pdfService = inject(DownloadpdfService);


  // =========================================================
  // TABLE DATA
  // =========================================================

  invoices: PurchasedInvoice[] = [];

  loading = false;

  totalRecords = 0;

  pageNumber = 1;
  pageSize = 10;

  search = '';

  fromDate: string | null = null;
  toDate: string | null = null;


  // =========================================================
  // TABLE COLUMNS
  // =========================================================
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
      key: 'paymentStatus',
      label: 'Payment Status',
      type: 'status',
      sortable: true
    }

  ];


  // =========================================================
  // ACTIONS
  // =========================================================

  actions: TableAction[] = [
    {
      label: 'View',
      icon: 'fa fa-eye',
      type: 'view'
    }
  ];


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadInvoices();
  }


  // =========================================================
  // LOAD INVOICES
  // =========================================================

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


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(value: string): void {

    this.search = value;

    this.pageNumber = 1;

    this.loadInvoices();
  }


  // =========================================================
  // PAGINATION
  // =========================================================

  onPageChange(page: number): void {

    this.pageNumber = page;

    this.loadInvoices();
  }


  onPageSizeChange(size: number): void {

    this.pageSize = size;

    this.pageNumber = 1;

    this.loadInvoices();
  }


  // =========================================================
  // DATE FILTER
  // =========================================================

  onDateFilter(
    fromDate: string | null,
    toDate: string | null
  ): void {

    this.fromDate = fromDate;

    this.toDate = toDate;

    this.pageNumber = 1;

    this.loadInvoices();
  }


  // =========================================================
  // TABLE ACTION
  // =========================================================

onActionClick(event: any): void {

  console.log('ACTION EVENT:', event);

  const invoice = event.row as PurchasedInvoice;

  if (!invoice) {
    return;
  }

  // VIEW
  if (event.action?.type === 'view') {

    this.selectedInvoice = invoice;
    this.showInvoice = true;

    return;
  }

  // DOWNLOAD
  if (event.action?.type === 'download') {

    this.pdfService
      .downloadInvoice(invoice)
      .catch(error => {

        console.error(
          'PDF generation failed:',
          error
        );

      });

    return;
  }
}







  // View Invoice Details
  selectedInvoice: PurchasedInvoice | null = null;

  showInvoice = false;

  viewInvoice(invoice: PurchasedInvoice): void {

    console.log(
      'View invoice:',
      invoice.purchaseInvoiceId
    );

  }

  printInvoice(): void {

    window.print();

  }

  closeInvoice(): void {

    this.showInvoice = false;

    this.selectedInvoice = null;
  }
























  // Download PDF
async downloadInvoicePdf(): Promise<void> {

  if (!this.selectedInvoice) {
    return;
  }

  try {

    await this.pdfService.downloadInvoice(
      this.selectedInvoice
    );

  } catch (error) {

    console.error(
      'PDF generation failed:',
      error
    );

  }
}
}

