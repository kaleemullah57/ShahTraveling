import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  @Output()
  menuToggle = new EventEmitter<void>();


  profileOpen = false;

  notificationOpen = false;


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


  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    window.location.href = '/';

  }
}
