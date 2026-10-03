export interface CustomerNotification {
  notificationId: number;
  customerId: number;
  notificationType: string;
  title: string;
  message: string;

  bookingId?: number | null;
  bookingPassengerId?: number | null;

  isRead: boolean;

  createdDate: string;
  readDate?: string | null;
}