import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';


// =========================================================
// FORM FIELD
// =========================================================

export interface FormField {

  key: string;

  label: string;

  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'date';

  placeholder?: string;

  required?: boolean;

  disabled?: boolean;

  options?: {
    label: string;
    value: any;
  }[];

}


// =========================================================
// FORM BUTTON
// =========================================================

export interface FormButton {

  label: string;

  type?: 'submit' | 'button' | 'reset';

  style?: 'primary' | 'secondary' | 'danger';

  disabled?: boolean;

  loading?: boolean;

}


// =========================================================
// COMPONENT
// =========================================================

@Component({
  selector: 'app-global-form',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './forms.html',

  styleUrl: './forms.scss'
})
export class forms {


  // =========================================================
  // INPUTS
  // =========================================================

  @Input()
  model: any = {};


  @Input()
  fields: FormField[] = [];


  @Input()
  buttons: FormButton[] = [];


  @Input()
  title = '';


  /**
   * Parent controls this value.
   *
   * Example:
   *
   * [loading]="saving"
   */
  @Input()
  loading = false;


  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output()
  submitForm =
    new EventEmitter<any>();


  @Output()
  cancelForm =
    new EventEmitter<void>();


  // =========================================================
  // GET VALUE
  // =========================================================

  getValue(
    key: string
  ): any {

    return this.model?.[key];

  }


  // =========================================================
  // SET VALUE
  // =========================================================

  setValue(
    key: string,
    value: any
  ): void {

    if (!this.model) {

      this.model = {};

    }

    this.model[key] = value;

  }


  // =========================================================
  // SUBMIT
  // =========================================================

  onSubmit(): void {

    /**
     * Prevent double submission.
     */
    if (this.loading) {

      return;

    }


    /**
     * Send a copy of the model.
     *
     * This prevents unexpected reference
     * changes while the API request is running.
     */
    this.submitForm.emit({
      ...this.model
    });

  }


  // =========================================================
  // BUTTON CLICK
  // =========================================================

  onButtonClick(
    button: FormButton
  ): void {

    if (this.loading) {

      return;

    }


    if (button.disabled) {

      return;

    }


    // -------------------------------------------------------
    // CANCEL
    // -------------------------------------------------------

    if (button.type === 'reset') {

      this.cancelForm.emit();

      return;

    }


    // -------------------------------------------------------
    // NORMAL BUTTON
    // -------------------------------------------------------

    if (button.type === 'button') {

      return;

    }

  }


  // =========================================================
  // FIELD DISABLED
  // =========================================================

  isFieldDisabled(
    field: FormField
  ): boolean {

    return !!(
      field.disabled ||
      this.loading
    );

  }


  // =========================================================
  // BUTTON DISABLED
  // =========================================================

  isButtonDisabled(
    button: FormButton
  ): boolean {

    return !!(
      button.disabled ||
      this.loading
    );

  }

}