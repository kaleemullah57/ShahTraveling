import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from "../../components/button/button";

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [CommonModule, RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

 private router = inject(Router);

  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  logout(): void {

    localStorage.removeItem('token');

    // If you store user information
    localStorage.removeItem('user');

    this.closeMobileMenu();

    this.router.navigate(['/']);
  }
}
