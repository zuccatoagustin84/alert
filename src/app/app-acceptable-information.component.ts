import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  Renderer2,
  OnInit,
  Optional,
  Host,
  SkipSelf,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Warning } from './warning';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acceptable-information',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert d-flex" 
         *ngIf="warning?.present" 
         [ngClass]="{
           'alert-warning': !isVibrating && !shouldShake, 
           'alert-danger vibrate': isVibrating,
           'shake': shouldShake
         }">
      <span class="flex-grow-1 me-3">
        <i class="fas fa-exclamation-triangle"></i> {{ message }} -
        {{ allowedMessage || allowedMessageDefault }}
        <ng-content select="[detail-section]"></ng-content>
      </span>
      <button
        *ngIf="!warning?.accepted"
        type="button"
        class="btn btn-sm btn-outline-primary"
        (click)="acceptWarning()"
      >
        Ok, I understand
      </button>
      <span *ngIf="warning?.accepted" class="flex-shrink-0">
        <i class="fas fa-check text-success"></i><span>Accepted</span></span>
    </div>


   <!-- <div *ngIf="control?.invalid && control?.touched">
      <div *ngIf="control?.hasError('required')">This field is required</div>
      <div *ngIf="control?.hasError('requiredTrue')">You must accept the warning</div>      
    </div>-->
  `,
  styles: [
    `
    .vibrate {
      animation: vibrate 0.5s cubic-bezier(.36,.07,.19,.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
    .shake {
      animation: shake 0.5s;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    @keyframes vibrate {
      0%, 100% { transform: translate3d(0, 0, 0); }
      10%, 30%, 50%, 70%, 90% { transform: translate3d(-4px, 0, 0); }
      20%, 40%, 60%, 80% { transform: translate3d(4px, 0, 0); }
    }
  `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppAcceptableInformationComponent),
      multi: true,
    },
  ],
})
export class AppAcceptableInformationComponent
  implements ControlValueAccessor, OnInit
{
  @Input() warning: Warning | null = null;
  @Input() message: string = '';
  @Input() required = true;
  @Input() allowedMessage: string = '';

  @Input() set triggerTouched(value: { value: boolean }) {
    if (value.value) {
      this.validate();
    }
  }
  shouldShake = false;
  isVibrating = false;
  allowedMessageDefault = 'if you proceed the appointment will be moved anyway';

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    public el: ElementRef
  ) {
    if (this.controlContainer) {
      (this.controlContainer.formDirective as FormGroupDirective)?.ngSubmit
        //.pipe(takeUntil(this.onDestroySubject))
        .subscribe(() => {
          this.validate();
        });
    }
  }

  ngOnInit() {
    // Obtener el FormControl asociado dinámicamente
    //this.shouldShake = true;
    this.el.nativeElement.addEventListener('vibrate', () => this.validate());
    //this.el.nativeElement.addEventListener('shake', () => this.shake());
  }

  writeValue(value: boolean): void {
    if (this.warning) {
      this.warning.accepted = value;
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if you need to handle the disabled state
  }

  acceptWarning(): void {
    if (this.warning) {
      this.warning.accept();
      this.onChange(true);
      this.onTouched();
    }
  }

  validate(): void {
    if (this.required && this.warning && !this.warning.accepted) {
      this.isVibrating = true;
      this.shouldShake = true;
      setTimeout(() => {
        this.isVibrating = false;
        this.shouldShake = false;
      }, 500);
    }
  }
}
