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
  ) { }


  
  async downloadInvoice(
    invoice: PurchasedInvoice
  ): Promise<void> {

    if (!invoice) {
      throw new Error('Invoice data is required.');
    }

  
    const componentRef = createComponent(
      Downloadpdf,
      {
        environmentInjector: this.environmentInjector
      }
    );

    componentRef.setInput(
      'invoice',
      invoice
    );

    this.appRef.attachView(
      componentRef.hostView
    );

    const hostElement =
      componentRef.location.nativeElement as HTMLElement;


  
    hostElement.style.position = 'fixed';
    hostElement.style.left = '-10000px';
    hostElement.style.top = '0';
    hostElement.style.width = '794px';
    hostElement.style.zIndex = '-1';

    document.body.appendChild(
      hostElement
    );


  
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

  
      this.appRef.detachView(
        componentRef.hostView
      );

      componentRef.destroy();

      hostElement.remove();
    }
  }


  async downloadElement(
    element: HTMLElement,
    fileName: string
  ): Promise<void> {

    if (!element) {
      throw new Error('PDF element not found.');
    }



    const header =
      element.querySelector(
        '.pdf-header'
      ) as HTMLElement;


    if (!header) {
      throw new Error(
        'PDF header not found.'
      );
    }



    const invoiceCanvas =
      await html2canvas(
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



    const headerCanvas =
      await html2canvas(
        header,
        {
          scale: 3,

          useCORS: true,

          allowTaint: false,

          backgroundColor: '#ffffff',

          logging: false,

          width: header.scrollWidth,

          height: header.scrollHeight,

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
      pageWidth -
      (margin * 2);


    const pdfHeight =
      pageHeight -
      (margin * 2);



    const headerHeight =
      (
        headerCanvas.height *
        pdfWidth
      ) /
      headerCanvas.width;


    const availableContentHeight =
      pdfHeight -
      headerHeight;



    const headerSourceHeight =
      Math.round(
        (
          headerHeight *
          invoiceCanvas.width
        ) /
        pdfWidth
      );



    if (
      headerSourceHeight <= 0 ||
      headerSourceHeight >= invoiceCanvas.height
    ) {

      throw new Error(
        'Invalid PDF header height.'
      );
    }


    const contentSourceHeight =
      invoiceCanvas.height -
      headerSourceHeight;

    const contentCanvas =
      document.createElement('canvas');


    contentCanvas.width =
      invoiceCanvas.width;


    contentCanvas.height =
      contentSourceHeight;


    const contentContext =
      contentCanvas.getContext('2d');


    if (!contentContext) {

      throw new Error(
        'Unable to create PDF canvas context.'
      );
    }



    contentContext.fillStyle =
      '#ffffff';


    contentContext.fillRect(
      0,
      0,
      contentCanvas.width,
      contentCanvas.height
    );


    contentContext.drawImage(

      invoiceCanvas,

      0,
      headerSourceHeight,

      invoiceCanvas.width,
      contentSourceHeight,

      0,
      0,

      contentCanvas.width,
      contentCanvas.height
    );


    const totalContentHeight =
      (
        contentCanvas.height *
        pdfWidth
      ) /
      contentCanvas.width;



    const contentSourcePageHeight =
      Math.floor(
        (
          availableContentHeight *
          contentCanvas.width
        ) /
        pdfWidth
      );


    const headerImage =
      headerCanvas.toDataURL(
        'image/png'
      );


    // =========================================================
    // CALCULATE NUMBER OF PAGES
    // =========================================================

    const totalPages =
      Math.ceil(
        totalContentHeight /
        availableContentHeight
      );


    // =========================================================
    // CREATE EVERY PAGE
    // =========================================================

    for (
      let pageIndex = 0;
      pageIndex < totalPages;
      pageIndex++
    ) {

      if (pageIndex > 0) {

        pdf.addPage();

      }


      // =======================================================
      // ADD SAME HEADER
      //
      // IMPORTANT:
      // Header is added FIRST.
      // Content is cropped and added separately.
      //
      // Therefore content can NEVER cover the header.
      // =======================================================

      pdf.addImage(

        headerImage,

        'PNG',

        margin,

        margin,

        pdfWidth,

        headerHeight
      );


      const sourceY =
        pageIndex *
        contentSourcePageHeight;


      const remainingSourceHeight =
        contentCanvas.height -
        sourceY;


      const currentSourceHeight =
        Math.min(
          contentSourcePageHeight,
          remainingSourceHeight
        );

      const currentPdfHeight =
        (
          currentSourceHeight *
          pdfWidth
        ) /
        contentCanvas.width;


      // =======================================================
      // CREATE PAGE CONTENT CANVAS
      //
      // This is the important part.
      //
      // We DON'T put the complete content image on the page.
      //
      // We crop only the section belonging to this page.
      // =======================================================

      const pageCanvas =
        document.createElement('canvas');


      pageCanvas.width =
        contentCanvas.width;


      pageCanvas.height =
        currentSourceHeight;


      const pageContext =
        pageCanvas.getContext('2d');


      if (!pageContext) {

        throw new Error(
          'Unable to create page canvas context.'
        );
      }



      pageContext.fillStyle =
        '#ffffff';


      pageContext.fillRect(
        0,
        0,

        pageCanvas.width,
        pageCanvas.height
      );


      pageContext.drawImage(

        contentCanvas,

        0,
        sourceY,

        contentCanvas.width,
        currentSourceHeight,

        0,
        0,

        pageCanvas.width,
        currentSourceHeight
      );


      const pageImage =
        pageCanvas.toDataURL(
          'image/png'
        );


      // =======================================================
      // ADD CONTENT BELOW HEADER
      // =======================================================

      pdf.addImage(

        pageImage,

        'PNG',

        margin,

        margin + headerHeight,

        pdfWidth,

        currentPdfHeight
      );
    }

    pdf.save(fileName);
  }
}