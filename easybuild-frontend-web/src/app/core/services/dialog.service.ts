import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Config } from '@app/app.config';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@shared/models/confirmation-dialog-data';
import { Observable } from 'rxjs';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) { }

  public yesNo(question: string): Observable<boolean> {
    const data: ConfirmationDialogData = {
      question: question,
      okBtnText: 'Yes',
      cancelBtnText: 'No'
    }
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: Config.GlobalDefault.DIALOG_WIDTH,
      data: data
    });

    return dialogRef.afterClosed();
  }
}