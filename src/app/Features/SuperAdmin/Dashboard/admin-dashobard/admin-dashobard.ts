import { Component } from '@angular/core';

import { Sidebar } from '../../../../Shared/SuperAdmin/sidebar/sidebar';
import { Topbar } from '../../../../Shared/SuperAdmin/topbar/topbar';


@Component({
  selector: 'app-admin-dashobard',

  standalone: true,

  imports: [
    Sidebar,Topbar
  ],

  templateUrl: './admin-dashobard.html',
  styleUrl: './admin-dashobard.scss'
})
export class AdminDashobard {


  /* =========================================================
     MOBILE SIDEBAR
  ========================================================= */

  mobileSidebarOpen = false;


  /* =========================================================
     TOGGLE MOBILE SIDEBAR
  ========================================================= */

  toggleMobileSidebar(): void {

    this.mobileSidebarOpen =
      !this.mobileSidebarOpen;

  }


  /* =========================================================
     CLOSE MOBILE SIDEBAR
  ========================================================= */

  closeMobileSidebar(): void {

    this.mobileSidebarOpen = false;

  }

}