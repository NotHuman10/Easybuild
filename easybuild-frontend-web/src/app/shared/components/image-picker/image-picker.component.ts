import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImagePickerComponent),
    multi: true
  }],
})
export class ImagePickerComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('imgInput') imgInput: ElementRef;
  @Input() defaultImgSrc: string;
  imgSrc: string;
  disabled: boolean = false;
  
  private onChange = (val: File) => { };

  writeValue(obj: string): void {
    this.imgSrc = obj;
  }

  registerOnTouched(fn: any): void { }

  registerOnChange(fn: (val: File) => any): void {
    this.onChange = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  imageSelected(event: Event): void {
    let files = (event.target as HTMLInputElement).files;
    if(files && files[0]) {
      URL.revokeObjectURL(this.imgSrc);
      this.imgSrc = URL.createObjectURL(files[0]);
      this.onChange(files[0]);
    }
  }

  removeImage(): void {
    URL.revokeObjectURL(this.imgSrc);
    this.imgSrc = null;
    this.imgInput.nativeElement.value = null;
    this.onChange(null);
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.imgSrc);
    URL.revokeObjectURL(this.defaultImgSrc);
  }
}