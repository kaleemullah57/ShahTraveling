import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-global-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './global-card.html',
  styleUrl: './global-card.scss',
})
export class GlobalCard {
  
 @Input() icon = 'fa fa-plane';

  @Input() category = '';

  @Input() title = '';

  @Input() description = '';

  @Input() footerText = '';

  @Input() number: string | number = '';

  @Input() arrow = 'fa fa-arrow-right';

  @Input() clickable = true;

  @Output() cardClick =
    new EventEmitter<void>();


  onCardClick(): void {

    if (!this.clickable) {
      return;
    }

    this.cardClick.emit();

  }}
