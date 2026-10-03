import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterOutlet],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss',
})
export class CustomerDashboard {

   private readonly router = inject(Router);

  exploreTickets(): void {
    this.router.navigate(['/customer/shared-tickets']);
  }

  openMyTickets(): void {
  this.router.navigate(['/BookedTickets']);
}

  openOther(): void {
    // Add your Other page/route here later
  }

  openTickets(): void {
    this.router.navigate(['/tickets']);
  }

}
