import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: RatingComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() starsNumber: number = 5;
  @Input() size: string = 'medium';
  @Input() displayValue: boolean = true;
  @Input() value: number = 0;

  private onChange = (val: any) => { };

  get stars() {
    return [...Array(this.starsNumber).keys()];
  }

  constructor() { }

  writeValue(obj: any): void {
    this.value = coerceNumberProperty(obj);
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.onChange(this.value);
  }

  clickOnStar(i: number): void {
    if (!this.disabled) {
      this.value = (i + 1) / this.starsNumber * 100;
      this.onChange(this.value);
    }
  }
}