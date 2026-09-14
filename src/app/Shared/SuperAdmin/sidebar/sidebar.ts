import { CommonModule } from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';


@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  /* =========================================
     DESKTOP COLLAPSE
  ========================================== */

  collapsed = false;


  /* =========================================
     MOBILE STATE
  ========================================== */

  @Input()
  mobileOpen = false;


  @Output()
  mobileClose =
    new EventEmitter<void>();


  @Output()
  collapsedChange =
    new EventEmitter<boolean>();


  /* =========================================
     DESKTOP TOGGLE
  ========================================== */

  toggleSidebar(): void {

    if (window.innerWidth <= 700) {
      return;
    }

    this.collapsed = !this.collapsed;

    this.collapsedChange.emit(
      this.collapsed
    );

  }


  /* =========================================
     CLOSE MOBILE
  ========================================== */

  closeMobileSidebar(): void {

    this.mobileClose.emit();

  }


  /* =========================================
     CLOSE AFTER NAVIGATION
  ========================================== */

  closeOnNavigation(): void {

    if (window.innerWidth <= 700) {

      this.mobileClose.emit();

    }

  }


  /* =========================================
     LOGOUT
  ========================================== */

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    window.location.href = '/';

  }











  managementOpen = true;
regionsOpen = false;
contentOpen = false;
financeOpen = false;
systemOpen = false;

toggleManagement(): void {
  this.managementOpen = !this.managementOpen;
}

toggleRegions(): void {
  this.regionsOpen = !this.regionsOpen;
}

toggleContent(): void {
  this.contentOpen = !this.contentOpen;
}

toggleFinance(): void {
  this.financeOpen = !this.financeOpen;
}

toggleSystem(): void {
  this.systemOpen = !this.systemOpen;
}
}