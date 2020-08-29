import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounce } from '@app/shared/decorators/debounce';
import { JobProposal } from '@app/shared/models/job-proposal';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProposalComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ProposalComponent),
    multi: true
  }],
})
export class ProposalComponent implements ControlValueAccessor {
  @ViewChild('proposalEditForm') proposalEditForm: ElementRef<HTMLFormElement>;
  private onChange = (val: JobProposal) => { };
  private onTouch = (val: JobProposal) => { };

  @Input() proposal: JobProposal;
  @Input() removable: boolean = false;
  @Input() editable: boolean = false;
  @Input() disabled: boolean = false;
  @Output() removed: EventEmitter<JobProposal> = new EventEmitter<JobProposal>();

  writeValue(obj: any): void {
    this.proposal = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  remove(): void {
    this.removed.next(this.proposal);
    this.proposal = null;
    this.onChange(null);
  }

  @debounce()
  modelChange(): void {
    this.onChange(this.proposal);
  }

  validate({ value }: FormControl) {
    return !(this.proposalEditForm?.nativeElement.checkValidity() ?? true) && {
      invalid: true
    }
  }
}