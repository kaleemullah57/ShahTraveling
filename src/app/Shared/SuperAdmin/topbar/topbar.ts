import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Core/Services/auth.service/auth.service';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {

   private readonly authService = inject(AuthService);
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