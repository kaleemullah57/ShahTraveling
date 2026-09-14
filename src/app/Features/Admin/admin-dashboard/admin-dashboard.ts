import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { Sidebar } from '../../../Shared/Admin/sidebar/sidebar';
import { Topbar } from '../../../Shared/Admin/topbar/topbar';

import { BranchAdminService } from '../Admin Services/Admin Global Services/branch-admin-service';
import { AuthService } from '../../../Core/Services/auth.service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    RouterOutlet
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly branchAdminService = inject(BranchAdminService);
  private readonly cdr = inject(ChangeDetectorRef);



  sidebarOpen = true;


  userName = '';
  branchId = 0;
  branchName = '';



  stats = [
    {
      title: 'Total Bookings',
      value: '1,284',
      change: '+12.5%',
      icon: 'fa-solid fa-calendar-check'
    },
    {
      title: 'Total Users',
      value: '8,492',
      change: '+8.2%',
      icon: 'fa-solid fa-users'
    },
    {
      title: 'Destinations',
      value: '126',
      change: '+5.4%',
      icon: 'fa-solid fa-location-dot'
    },
    {
      title: 'Revenue',
      value: '$84,290',
      change: '+18.7%',
      icon: 'fa-solid fa-chart-line'
    }
  ];



  get isDashboardHome(): boolean {

    return this.router.url === '/AdminDashboard';

  }


  ngOnInit(): void {

    this.userName =
      this.authService.getUserName();

    this.branchId =
      this.authService.getBranchId();



    if (this.branchId > 0) {

      this.getBranchDetails();

    } else {

      console.error(
        'BranchId not found in JWT.'
      );

    }

  }


  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  getBranchDetails(): void {

    this.branchAdminService
      .getBranchByBranchId(this.branchId)
      .subscribe({

        next: (response: any) => {

          if (
            response.statusCode === 200 &&
            response.status === true &&
            response.data
          ) {

            this.branchName =
              response.data.branchName;


            this.cdr.detectChanges();

          }

        },


        error: (error) => {

          console.error(
            'Branch API Error:',
            error
          );

        }

      });

  }

}