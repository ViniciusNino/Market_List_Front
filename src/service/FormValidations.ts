import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";
import { LoginApi } from 'src/app/login/login.api';

@Injectable({
    providedIn: 'root'
  })

export class FormValidations {
  constructor(private readonly loginApi: LoginApi,) {}

  verificaValidTouched(field) {
    return !field.contrvalid && field.touched;
  }

  validateFormField(field: string, error: string, form: FormGroup) {
      if(form.get(field).errors?.[error] && form.get(field)?.touched) {
        return true;
      }
      return false;
  }

  validateFormControls(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.validateFormControls(control);
      }
    });
    return formGroup;
  }

  disableFormControl(formGroup: FormGroup, fieldChange: string) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateFormControls(control);
      }
      let change = formGroup.get(fieldChange);
      if (change === control) {
        control.disable();
      }
    });
    return formGroup;
  }

  enableFormControl(formGroup: FormGroup, fieldChange: string) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateFormControls(control);
      }
      let change = formGroup.get(fieldChange);
      if (change === control) {
        control.enable();
      }
    });
    return formGroup;
  }

  static equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {
      if (otherField == null) {
        throw new Error('It is necessary to inform a field.');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field) {
        throw new Error('It is necessary to inform a valid field.');
      }
      if (field.value !== formControl.value) {
        return { equalsTo: otherField };
      }
      return null;
    };
    return validator;
  }

  async validateEmail(email: string) {
    // return await this.serviceApi.getValidadteEmail(email);
  }

  async validateFirstName(firstName: FormControl) {
    // return await this.serviceApi.getValidadteFirstName(firstName);
  }

  validateFields(fieldNames: string[], form: FormGroup) {
    let valid = true;
    fieldNames.forEach(fieldName => {
      const field = form.get(fieldName);
      if(!field.valid) {
        valid = false;
      }
    });
    return valid;
  }

  touchedFields(fieldNames: string[], form: FormGroup) {
    fieldNames.forEach(fieldName => {
        form.get(fieldName).markAsTouched();
    });
    return form;
  }

  onlyLetters(target: any) {
    target.value = target.value.replace(/\d/g,"");
  }
}


export const ERRORS = {
    REQUIRED: 'required',
    EMAIL: 'email',
    CHECKBOX: 'terms',
    PATTERN: 'pattern'
}


