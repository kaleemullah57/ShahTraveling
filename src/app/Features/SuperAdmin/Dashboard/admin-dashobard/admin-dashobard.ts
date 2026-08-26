import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Sidebar } from '../../../../Shared/SuperAdmin/sidebar/sidebar';
import { Topbar } from '../../../../Shared/SuperAdmin/topbar/topbar';
import { AuthService } from '../../../../Core/Services/auth.service/auth.service';


@Component({
  selector: 'app-admin-dashobard',
  standalone: true,
  imports: [
    Sidebar,
    Topbar,
    RouterOutlet
  ],
  templateUrl: './admin-dashobard.html',
  styleUrl: './admin-dashobard.scss'
})
export class AdminDashobard {

  private readonly router = inject(Router);
   private readonly authService = inject(AuthService);
  mobileSidebarOpen = false;


  toggleMobileSidebar(): void {

    this.mobileSidebarOpen =
      !this.mobileSidebarOpen;

  }


  closeMobileSidebar(): void {

    this.mobileSidebarOpen = false;

  }


  get isDashboardHome(): boolean {

    return this.router.url === '/SuperAdminDashboard';

  }




  userName = '';

  ngOnInit(): void {

    this.userName =
      this.authService.getUserName();

    console.log(
      'Logged in user:',
      this.authService.getCurrentUser()
    );
  }
}