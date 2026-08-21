import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Topbar } from '../../../Shared/Admin/topbar/topbar';
import { Sidebar } from '../../../Shared/Admin/sidebar/sidebar';

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
export class AdminDashboard {

  // =========================================
  // SIDEBAR STATE
  // =========================================

  sidebarOpen: boolean = true;


  // =========================================
  // TOPBAR -> SIDEBAR
  // =========================================

  toggleSidebar(): void {

    this.sidebarOpen = !this.sidebarOpen;

  }


  // =========================================
  // SIDEBAR -> DASHBOARD
  // =========================================

  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // Your existing stats
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