import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  // =========================================
  // SIDEBAR OPEN / CLOSE
  // =========================================

  @Input()
  isOpen: boolean = true;


  // =========================================
  // SEND CLOSE EVENT TO DASHBOARD
  // =========================================

  @Output()
  closeMenu = new EventEmitter<void>();


  // =========================================
  // MOBILE CLOSE
  // =========================================

  closeSidebar(): void {

    this.closeMenu.emit();

  }


  // =========================================
  // MENU CLICK
  // =========================================

  onMenuClick(): void {

    // Close sidebar only on mobile
    if (window.innerWidth <= 768) {

      this.closeSidebar();

    }

  }
}
