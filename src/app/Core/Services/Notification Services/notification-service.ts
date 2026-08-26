import { Injectable, signal } from '@angular/core';

export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface NotificationItem {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private nextId = 1;

  readonly notifications = signal<NotificationItem[]>([]);

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  remove(id: number): void {
    this.notifications.update(items =>
      items.filter(item => item.id !== id)
    );
  }

  private show(
    type: NotificationType,
    message: string
  ): void {

    const id = this.nextId++;

    this.notifications.update(items => [
      ...items,
      {
        id,
        type,
        message
      }
    ]);

    // Automatically remove after 4 seconds
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }
}