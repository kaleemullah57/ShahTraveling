import { Component, inject, Input } from '@angular/core';
import { PurchasedInvoice } from '../../../../Features/Branch Admin Section/Admin Models/Ticket Inventory Models/inventory-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-downloadpdf',
  imports: [CommonModule],
  templateUrl: './downloadpdf.html',
  styleUrl: './downloadpdf.scss',
})
export class Downloadpdf {
   @Input()
  invoice!: PurchasedInvoice;
}
