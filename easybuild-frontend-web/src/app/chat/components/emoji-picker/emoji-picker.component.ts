import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiPickerComponent {
  public emoji: EventEmitter<string> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<EmojiPickerComponent>) { }

  public pick(result: string): void {
    this.emoji.next(result);
  }
}