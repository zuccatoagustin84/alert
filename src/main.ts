import { Component, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppAcceptableInformationComponent } from './app/app-acceptable-information.component';
import { Warning, WarningImpl } from './app/warning';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppAcceptableInformationComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `
    <div class="container mt-4">
      <h1>{{ name }} Form Example</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" formControlName="name" class="form-control">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" formControlName="email" class="form-control">
        </div>    
        
        <app-acceptable-information
          [warning]="warning"
          [message]="'Please review the terms and conditions'"
          [allowedMessage]="'By proceeding, you agree to our terms'"
          formControlName="acceptTerms" 
          #acceptableInfo1>
        </app-acceptable-information>


        <button type="submit" class="btn btn-primary mt-3">Submit</button>

  
      </form>


      <app-acceptable-information
          [warning]="warning"
          [message]="'Please review the terms and conditions'"
          [allowedMessage]="'By proceeding, you agree to our terms'"   
          [triggerTouched]="{value : shouldTriggerTouched}"
          id="acceptableInfo2"
          #acceptableInfo2>
        </app-acceptable-information>
  

      <div *ngIf="submitted" class="alert alert-success mt-3">
        Form submitted successfully!
      </div>
    </div>
  `,
})
export class App {
  name = 'Angular';
  warning: Warning = new WarningImpl();
  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  shouldTriggerTouched = false;
  @ViewChild('acceptableInfo2')
  acceptableInformation!: AppAcceptableInformationComponent;

  onSubmit() {
    if (this.form.valid && this.warning.accepted) {
      console.log('Form submitted', this.form.value);
      this.submitted = true;
    } else if (!this.warning.accepted) {
      // Trigger vibration effect
      const acceptableInfoElement = document.querySelector('#acceptableInfo2');
      // debugger;
      if (acceptableInfoElement) {
        acceptableInfoElement.dispatchEvent(new CustomEvent('vibrate'));
      }
      // const nativeElement = this.acceptableInformation!.el.nativeElement;
      // nativeElement.dispatchEvent(new CustomEvent('vibrate'));
      // this.shouldTriggerTouched = true;
      //this.acceptableInformation.validate();
    }
  }
}

bootstrapApplication(App);
