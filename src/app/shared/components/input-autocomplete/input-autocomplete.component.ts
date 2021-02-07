import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  Optional,
  Self,
  ChangeDetectorRef,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, ValidationErrors, ControlValueAccessor, FormControl, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Identifiable } from './input-autocomplete.model';
import { ErrorMatcher } from 'app/core/services/error-matcher';
import { ValidationService } from 'app/core/services/validation.services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

/** https://inglkruiz.github.io/angular-material-reusable-autocomplete/ */
@UntilDestroy()
@Component({
  selector: 'input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAutocompleteComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  matcher = new ErrorMatcher();
  @Input() dirty: false;
  @Input() placeholder? = '';
  private _options: any[];

  @Input() set options(options: any[]) {
    this._options = options;
    if (options) {
      this.cargando = false;
    } else {
      this.cargando = true;
    }
  }
  get options(): any[] {
    return this._options;
  }

  private _required: boolean = true; // Es requerido o no.
  @Input() set required(required: boolean) {
    this._required = JSON.parse(String(required)); // [required]="true" se toma como string, por eso se castea
    if (this._required && this._required.valueOf() === true) {
      //  this.inputControl.markAsTouched();
      this.inputControl.setValidators([
        Validators.required,
        ValidationService.esEntidad,
        Validators.minLength(this._lengthToTriggerSearch),
      ]);
    } else {
      this.inputControl.clearValidators();
      this.inputControl.setValidators([Validators.minLength(this._lengthToTriggerSearch), ValidationService.esEntidad]);
    }
  }
  get required(): boolean {
    return this._required;
  }
  @Input() campoNombre: string = 'nombre'; // Nombre del campo a mostrar.
  @Input() campoId: string = 'id'; // Nombre del id a buscar.
  @Input() hint: string = 'Ingrese al menos 3 letras'; // Es requerido o no.
  @Input() icon: string = 'search';
  @Input() label?: string;
  @Input() width?: string = '100%';
  @Output() inputActivado? = new EventEmitter<boolean>();
  // Inner form control to link input text changes to mat autocomplete
  inputControl;
  noResults = false;
  isSearching = false;
  cargando = true;
  private _lengthToTriggerSearch = 0;

  @Input()
  set lengthToTriggerSearch(value: number) {
    this._lengthToTriggerSearch = coerceNumberProperty(value, 0);
  }
  get lengthToTriggerSearch() {
    return this._lengthToTriggerSearch;
  }
  constructor(@Optional() @Self() private controlDir: NgControl, private changeDetectorRef: ChangeDetectorRef) {
    // this.inputControl = new FormControl('', Validators.required);
    this.inputControl = new FormControl('');

    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }
  ngOnDestroy(): void {}

  ngOnInit() {
    if (this.controlDir) {
      // Set validators for the outer ngControl equals to the inner
      const control = this.controlDir.control;

      const validators = control.validator ? [control.validator, this.inputControl.validator] : this.inputControl.validator;
      control.setValidators(validators);
      // Update outer ngControl status
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dirty && changes.dirty.currentValue === true) {
      this.inputControl.markAsDirty();
    }
    if (changes.options) {
      if (this.isSearching) {
        this.isSearching = false;

        if (!changes.options.firstChange && !changes.options.currentValue.length) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      }
    }
  }

  openPanel(evt): void {
    evt.stopPropagation();
    this.inputControl.openPanel();
  }
  /**
   * Allows Angular to update the inputControl.
   * Update the model and changes needed for the view here.
   */
  writeValue(obj: any): void {
    obj && this.inputControl.setValue(obj);
  }

  /**
   * Allows Angular to register a function to call when the inputControl changes.
   */
  registerOnChange(fn: any): void {
    // Pass the value to the outer ngControl if it has an id otherwise pass null
    this.inputControl.valueChanges.pipe(debounceTime(300), untilDestroyed(this)).subscribe({
      next: (value) => {
        if (typeof value === 'string') {
          if (this.isMinLength(value)) {
            this.isSearching = true;
            /**
             * Fire change detection to display the searching status option
             */
            this.changeDetectorRef.detectChanges();
            fn(value.toUpperCase());
          } else {
            this.isSearching = false;
            this.noResults = false;

            fn(null);
          }
        } else {
          fn(value);
        }
      },
    });
  }

  /**
   * Allows Angular to register a function to call when the input has been touched.
   * Save the function as a property to call later here.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Allows Angular to disable the input.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
  }

  /**
   * Function to call when the input is touched.
   */
  onTouched() {}

  /**
   * Method linked to the mat-autocomplete `[displayWith]` input.
   * This is how result name is printed in the input box.
   */
  displayFn = (result: any | Identifiable): string | undefined => {
    // displayFn(result: any | Identifiable): string | undefined {
    return result ? result[this.campoNombre] : undefined;
  };
  /**
   * Validates if the value passed has a code in order to be declared as an
   * object provided by material autocomplete options
   */
  isAutocompleteOption = (value: any | Identifiable): boolean => {
    if (!value || typeof value === 'string') {
      return false;
    }
    return value[this.campoId] > 0;
  };

  /**
   * Validates the control value to have an `id` attribute. It is expected
   * control value to be an object.
   */
  containsIdValidation = (control: AbstractControl): ValidationErrors => {
    // function containsIdValidation(control: AbstractControl): ValidationErrors {
    return this.isAutocompleteOption(control.value) ? null : { required: true };
  };
  isMinLength(value: string) {
    return value.length >= this._lengthToTriggerSearch;
  }

  private get validators(): ValidatorFn[] {
    return [Validators.required, this.containsIdValidation];
  }
}
