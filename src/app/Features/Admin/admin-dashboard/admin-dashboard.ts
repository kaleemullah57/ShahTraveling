import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Topbar } from '../../../Shared/Admin/topbar/topbar';
import { Sidebar } from '../../../Shared/Admin/sidebar/sidebar';
import { BranchAdminService } from '../Admin Services/Admin Services/branch-admin-service';
import { AuthService } from '../../../Core/Services/auth.service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    Topbar,
    Sidebar
  ],

  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  branchId: number = 0;
  branchName: string = '';

  sidebarOpen: boolean = true;

  constructor(
    private branchAdminService: BranchAdminService,
    private AuthService: AuthService,
     private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

  this.branchId = this.AuthService.getBranchId();

  if (this.branchId > 0) {

    this.getBranchDetails();

  } else {

    console.error('BranchId not found in JWT.');

  }

  }


  // ==========================================
  // Get Logged-In Admin Branch
  // ==========================================

getBranchDetails(): void {

  console.log('getBranchDetails() called');

  this.branchAdminService
    .getBranchByBranchId(this.branchId)
    .subscribe({

      next: (response: any) => {

        console.log('Branch API Response:', response);

        if (
          response.statusCode === 200 &&
          response.status === true &&
          response.data
        ) {

          this.branchName = response.data.branchName;
          // Force Angular to update the template
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

  // ==========================================
  // Sidebar
  // ==========================================

  toggleSidebar(): void {

    this.sidebarOpen = !this.sidebarOpen;

  }


  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // ==========================================
  // Statistics
  // ==========================================

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


  // ==========================================
  // Recent Activities
  // ==========================================

  recentActivities = [
    {
      title: 'New booking received',
      description: 'Dubai Holiday Package',
      time: '5 min ago',
      icon: 'fa-solid fa-calendar-check'
    },
    {
      title: 'New user registered',
      description: 'Ahmed Khan joined the platform',
      time: '18 min ago',
      icon: 'fa-solid fa-user-plus'
    },
    {
      title: 'Destination added',
      description: 'Maldives destination was added',
      time: '42 min ago',
      icon: 'fa-solid fa-location-dot'
    },
    {
      title: 'New travel post',
      description: 'Top places to visit in Turkey',
      time: '1 hour ago',
      icon: 'fa-solid fa-pen'
    }
  ];

}