import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../Core/Services/auth.service/auth.service';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterLink,
    Button
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Output()
  menuToggle = new EventEmitter<void>();

  profileOpen = false;
  notificationOpen = false;

  userName = '';

  constructor() {
    this.userName = this.authService.getUserName();
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationOpen = false;
  }

  toggleNotifications(): void {
    this.notificationOpen = !this.notificationOpen;
    this.profileOpen = false;
  }

  goToDashboard(): void {
    this.profileOpen = false;
    this.router.navigate(['/AdminDashboard']);
  }

  logout(): void {
    this.profileOpen = false;

    this.authService.logout();

    this.router.navigate(['/']);
  }
}