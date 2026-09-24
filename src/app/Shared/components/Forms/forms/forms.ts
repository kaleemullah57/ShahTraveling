import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Button } from '../../button/button';
import { CommonModule } from '@angular/common';

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
  | 'file'
  | 'datetime-local';

  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: any;
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
  imports: [FormsModule, Button, CommonModule],
  templateUrl: './forms.html',
  styleUrl: './forms.scss'
})
export class forms {

  @Input() model: any = {};

  @Input() fields: FormField[] = [];

  @Input() buttons: FormButton[] = [];

  @Input() title = '';

  @Input() loading = false;
  @Input() embedded = false;

  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output() submitForm = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formReset = new EventEmitter<void>();
  @Output() formValueChange = new EventEmitter<any>();
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

    const value = {
      ...this.model
    };

    // Existing projects/components
    this.submitForm.emit(value);

    // New/current components
    this.formSubmit.emit(value);
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

      // Existing components
      this.cancelForm.emit();
      this.formCancel.emit();
      this.formReset.emit();

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

      this.formValueChange.emit({
        key: key,
        value: null
      });

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


    // Notify parent component
    this.formValueChange.emit({
      key: key,
      value: numericValue
    });

  }



  isOptionSelected(
    fieldKey: string,
    optionValue: any
  ): boolean {

    const currentValue = this.getValue(fieldKey);

    return Number(currentValue) === Number(optionValue);
  }
}