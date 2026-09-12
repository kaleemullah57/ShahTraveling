import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Button } from '../../button/button';

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
  | 'date'
  | 'file';

  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  options?: {
    label: string;
    value: any;
  }[];
}

export interface FormButton {
  label: string;
  type?: 'submit' | 'button' | 'reset';
  style?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'app-global-form',
  standalone: true,
  imports: [FormsModule,Button],
  templateUrl: './forms.html',
  styleUrl: './forms.scss'
})
export class forms {

  @Input() model: any = {};

  @Input() fields: FormField[] = [];

  @Input() buttons: FormButton[] = [];

  @Input() title = '';

  @Input() loading = false;


  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output() submitForm = new EventEmitter<any>();

  @Output() cancelForm = new EventEmitter<void>();

  @Output() fieldChange = new EventEmitter<{
    key: string;
    value: any;
  }>();


  // =========================================================
  // GET VALUE
  // =========================================================

  getValue(key: string): any {

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

    this.fieldChange.emit({
      key,
      value
    });
  }


  // =========================================================
  // FORM SUBMIT
  // =========================================================

  onSubmit(): void {

    if (this.loading) {
      return;
    }

    console.log(
      '🚀 GLOBAL FORM MODEL:',
      this.model
    );

    this.submitForm.emit({
      ...this.model
    });

  }


  // =========================================================
  // BUTTON CLICK
  // =========================================================

  onButtonClick(button: FormButton): void {

  if (this.loading) {
    return;
  }

  if (button.disabled) {
    return;
  }

  if (
    button.type === 'reset' ||
    (
      button.type === 'button' &&
      button.style === 'secondary'
    )
  ) {
    this.cancelForm.emit();
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


  // =========================================================
  // FILE CHANGE
  // =========================================================

  onFileChange(
    event: Event,
    key: string
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files) {

      this.setValue(
        key,
        []
      );

      return;
    }

    const files: File[] =
      Array.from(input.files);

    this.setValue(
      key,
      files
    );

  }


  // =========================================================
  // CONVERT VALUE
  // =========================================================

  convertValue(
    fieldType: string,
    value: any
  ): any {

    if (fieldType === 'number') {

      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {

        return null;
      }

      return Number(value);
    }

    return value;
  }


  // =========================================================
  // SELECT CHANGE
  // =========================================================

  onSelectChange(
    key: string,
    value: any
  ): void {

    console.log(
      '🔽 SELECT CHANGE'
    );

    console.log(
      'Key:',
      key
    );

    console.log(
      'Raw Value:',
      value
    );


    // Empty option
    if (
      value === '' ||
      value === null ||
      value === undefined
    ) {

      this.setValue(
        key,
        null
      );

      return;
    }


    // Convert dropdown value to number
    const numericValue =
      Number(value);


    console.log(
      '🔢 Numeric Value:',
      numericValue
    );


    this.setValue(
      key,
      numericValue
    );


  }

}