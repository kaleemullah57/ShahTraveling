import { CommonModule } from '@angular/common';

import {
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  Button
} from '../../components/button/button';

import {
  AuthService
} from '../../../Core/Services/auth.service/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Button
  ],

  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header
  implements OnInit, OnDestroy {


  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  private readonly destroy$ =
    new Subject<void>();


  // ==========================================
  // STATE
  // ==========================================

  isLoggedIn = false;

  userType = 0;

  mobileMenuOpen = false;


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    // Load current state immediately
    this.updateUser(
      this.authService.getCurrentUser()
    );


    // Listen for login/logout/user changes
    this.authService.user$
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe(user => {

        console.log(
          'HEADER USER CHANGED:',
          user
        );


        this.updateUser(
          user
        );

      });

  }


  // ==========================================
  // UPDATE USER
  // ==========================================

  private updateUser(
    user: any
  ): void {

    if (!user) {

      this.isLoggedIn = false;

      this.userType = 0;

      console.log(
        'HEADER: LOGGED OUT'
      );

      return;
    }


    this.isLoggedIn = true;


    this.userType =
      Number(
        user.userTypeId ?? 0
      );


    console.log(
      'HEADER: LOGGED IN'
    );


    console.log(
      'HEADER USER TYPE:',
      this.userType
    );

  }


  // ==========================================
  // MOBILE MENU
  // ==========================================

  toggleMobileMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

  }


  closeMobileMenu(): void {

    this.mobileMenuOpen = false;

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    console.log(
      'HEADER LOGOUT'
    );


    this.authService.logout();


    this.closeMobileMenu();


    this.router.navigateByUrl(
      '/'
    );

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}