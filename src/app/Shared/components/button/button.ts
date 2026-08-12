import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { RouterLink } from '@angular/router';


export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'light';


export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  imports: [CommonModule, RouterLink],
  standalone:true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})

export class Button {

  @Input() label = 'Button';

  @Input() variant: ButtonVariant = 'primary';

  @Input() size: ButtonSize = 'medium';

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() icon?: string;

  @Input() iconPosition: 'left' | 'right' = 'left';

  @Input() disabled = false;

  @Input() loading = false;

  @Input() fullWidth = false;

  @Input() routerLink?: string | any[];

  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }

    this.clicked.emit(event);
  }

}
