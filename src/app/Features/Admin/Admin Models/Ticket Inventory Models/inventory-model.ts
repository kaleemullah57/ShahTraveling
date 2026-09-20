export interface InventoryModel {}






export interface PurchasedInvoiceSearchRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
  fromDate: string | null;
  toDate: string | null;
}

export interface PurchasedInvoicePayment {
  paymentAmount: number;
  paymentDate: string;
  paymentMethodId: number | null;
  methodName: string | null;
  paymentReference: string | null;
  paymentRemarks: string | null;
  paidAmount: number;
  remainingAmount: number;
}

export interface PurchasedInvoice {

  purchaseInvoiceId: number;
  branchId: number;
  branchName: string;

  invoiceNumber: string;

  purchasedFrom: string;
  purchaseReference: string | null;

  invoiceDate: string;

  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;

  paidAmount: number;
  remainingAmount: number;

  paymentStatusId: number;
  paymentStatus: string;

  statusId: number;
  inventoryStatus: string;

  createdById: number;
  createdBy: string;
  createdDate: string;

  airlineId: number;
  airlineName: string;
  airlineCode: string;

  fromAirportId: number;
  fromAirport: string;

  toAirportId: number;
  toAirport: string;

  departureDateTime: string;
  arrivalDateTime: string;

  ticketQuantity: number;
  purchasePrice: number;

  checkedBaggageKg: number | null;
  handBaggageKg: number | null;
  personalItemKg: number | null;

  validFrom: string | null;
  validUntil: string;

  ticketTypeId: number | null;
  ticketTypeName: string; 

  paymentHistory: PurchasedInvoicePayment[];
}















// Add Ticket To Inventory
export interface AddTicketPurchaseRequest {
  purchasedFrom: string;
  purchaseReference: string;
  invoiceDate: string;

  airlineId: number;
  fromAirportId: number;
  toAirportId: number;

  departureDateTime: string;
  arrivalDateTime: string;

  quantity: number;

  ticketTypeId : number;

  purchasePrice: number;
  sellingPrice: number;

  checkedBaggageKg: number;
  handBaggageKg: number;
  personalItemKg: number;

  validFrom: string;
  validUntil: string;

  paidAmount: number;
  paymentMethodId: number;

  paymentReference: string;
  remarks: string;
}





















// Update Inventory Payments Invoices
export interface UpdatePurchasedInvoicePaymentRequest {
  purchaseInvoiceId: number;
  paymentAmount: number;
  paymentDate: string;
  paymentMethodId: number;
  paymentReference: string;
  remarks: string;
}