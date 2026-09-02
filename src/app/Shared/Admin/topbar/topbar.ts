import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  inject,
  Output
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../Core/Services/auth.service/auth.service';
import { Button } from '../../components/button/button';


@Component({
  selector: 'app-topbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    Button
  ],

  templateUrl: './topbar.html',

  styleUrl: './topbar.scss',
})
export class Topbar {


  // =====================================================
  // SERVICES
  // =====================================================

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  // =====================================================
  // SIDEBAR
  // =====================================================

  @Output()
  menuToggle =
    new EventEmitter<void>();


  // =====================================================
  // DROPDOWNS
  // =====================================================

  profileOpen = false;

  notificationOpen = false;


  // =====================================================
  // USER INFORMATION
  // =====================================================

  userName = '';

  userType = '';

  branchId = 0;


  // =====================================================
  // INITIALIZATION
  // =====================================================

  ngOnInit(): void {

    this.userName =
      this.authService.getUserName();


    this.userType =
      this.authService.getUserType();


    this.branchId =
      this.authService.getBranchId();


    console.log(
      'Topbar User:',
      this.userName
    );


    console.log(
      'Topbar User Type:',
      this.userType
    );


    console.log(
      'Topbar BranchId:',
      this.branchId
    );

  }


  // =====================================================
  // BRANCH ADMIN CHECK
  // =====================================================

  get isBranchAdmin(): boolean {

    return (
      this.branchId > 0 &&
      this.userType === 'Admin'
    );

  }


  // =====================================================
  // SIDEBAR TOGGLE
  // =====================================================

  toggleMenu(): void {

    this.menuToggle.emit();

  }


  // =====================================================
  // PROFILE
  // =====================================================

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.profileOpen = false;

  }


  // =====================================================
  // GO TO BRANCH ADMIN DASHBOARD
  // =====================================================

  goToDashboard(): void {

    this.profileOpen = false;

    this.router.navigate([
      '/AdminDashboard'
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.profileOpen = false;

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    window.location.href = '/';

  }

}