import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../button/button';

@Component({
  selector: 'app-delete-confirmation',
  standalone:true,
  imports: [Button],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss',
})
export class DeleteConfirmation {

  @Input()
  visible = false;

  @Input()
  title = 'Delete Confirmation';

  @Input()
  itemName = '';

  @Input()
  message = 'Are you sure you want to delete this item?';

  @Input()
  warning = 'This action cannot be undone.';

  @Input()
  deleting = false;

  @Input()
  confirmLabel = 'Delete';

  @Input()
  cancelLabel = 'Cancel';


  @Output()
  confirmed = new EventEmitter<void>();

  @Output()
  cancelled = new EventEmitter<void>();


  confirm(): void {

    if (this.deleting) {
      return;
    }

    this.confirmed.emit();
  }


  cancel(): void {

    if (this.deleting) {
      return;
    }

    this.cancelled.emit();
  }
}
