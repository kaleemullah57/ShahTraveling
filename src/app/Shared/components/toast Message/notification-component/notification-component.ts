import {
  Component,
  inject
} from '@angular/core';

import { NotificationService } from '../../../../Core/Services/Notification Services/notification-service';

@Component({
  selector: 'app-notification',
  standalone: true,

  templateUrl: './notification-component.html',
  styleUrl: './notification-component.scss'
})
export class NotificationComponent {

  readonly notificationService =
    inject(NotificationService);

  remove(id: number): void {
    this.notificationService.remove(id);
  }
}