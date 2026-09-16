import {
  Injectable,
  ApplicationRef,
  createComponent,
  EnvironmentInjector
} from '@angular/core';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { PurchasedInvoice } from '../../../Features/Admin/Admin Models/Ticket Inventory Models/inventory-model';

import { Downloadpdf } from '../../../Shared/components/Download pdf/downloadpdf/downloadpdf';

@Injectable({
  providedIn: 'root'
})
export class DownloadpdfService {

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}


  // =========================================================
  // DOWNLOAD INVOICE
  // =========================================================

  async downloadInvoice(
    invoice: PurchasedInvoice
  ): Promise<void> {

    if (!invoice) {
      throw new Error('Invoice data is required.');
    }

    // Create global PDF component dynamically
    const componentRef = createComponent(
      Downloadpdf,
      {
        environmentInjector: this.environmentInjector
      }
    );

    // Pass invoice to @Input()
    componentRef.setInput(
      'invoice',
      invoice
    );

    // Attach Angular component
    this.appRef.attachView(
      componentRef.hostView
    );

    const hostElement =
      componentRef.location.nativeElement as HTMLElement;

    // =========================================================
    // HIDE PDF TEMPLATE FROM USER
    // =========================================================

    hostElement.style.position = 'fixed';
    hostElement.style.left = '-10000px';
    hostElement.style.top = '0';
    hostElement.style.width = '794px';
    hostElement.style.zIndex = '-1';

    document.body.appendChild(
      hostElement
    );

    // Give Angular time to render
    await new Promise(resolve =>
      setTimeout(resolve, 200)
    );

    const element =
      hostElement.querySelector(
        '.pdf-document'
      ) as HTMLElement;

    if (!element) {

      this.appRef.detachView(
        componentRef.hostView
      );

      componentRef.destroy();

      throw new Error(
        'PDF document template not found.'
      );
    }

    try {

      await this.downloadElement(
        element,
        `${invoice.invoiceNumber}.pdf`
      );

    } finally {

      // =======================================================
      // CLEANUP DYNAMIC COMPONENT
      // =======================================================

      this.appRef.detachView(
        componentRef.hostView
      );

      componentRef.destroy();

      hostElement.remove();
    }
  }


  // =========================================================
  // GENERATE PDF FROM HTML ELEMENT
  // =========================================================

  async downloadElement(
    element: HTMLElement,
    fileName: string
  ): Promise<void> {

    if (!element) {
      throw new Error(
        'PDF element not found.'
      );
    }

    const canvas = await html2canvas(
      element,
      {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,

        width: element.scrollWidth,
        height: element.scrollHeight,

        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      }
    );


    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });


    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 8;

    const pdfWidth =
      pageWidth - (margin * 2);

    const pdfContentHeight =
      pageHeight - (margin * 2);


    const imageHeight =
      (canvas.height * pdfWidth) /
      canvas.width;


    const imageData =
      canvas.toDataURL('image/png');


    let heightLeft =
      imageHeight;

    let position =
      margin;


    // =========================================================
    // FIRST PAGE
    // =========================================================

    pdf.addImage(
      imageData,
      'PNG',
      margin,
      position,
      pdfWidth,
      imageHeight
    );

    heightLeft -=
      pdfContentHeight;


    // =========================================================
    // ADDITIONAL PAGES
    // =========================================================

    while (heightLeft > 0) {

      position =
        margin -
        (imageHeight - heightLeft);

      pdf.addPage();

      pdf.addImage(
        imageData,
        'PNG',
        margin,
        position,
        pdfWidth,
        imageHeight
      );

      heightLeft -=
        pdfContentHeight;
    }


    // =========================================================
    // SAVE
    // =========================================================

    pdf.save(fileName);
  }
}