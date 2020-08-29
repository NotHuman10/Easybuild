import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { Message } from '@app/shared/models/message';
import { debounce } from '@shared/decorators/debounce';
import { Observable } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { ChatService, ChatStats, ChatUpdatedSide } from '../../services/chat.service';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private initialLoad: boolean = true;
  @ViewChild('msgFlow') private messageFlow: ElementRef;

  chat$: Observable<ChatStats>;

  messageForm = new FormGroup({
    'text': new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\r\n]+$/)
    ])
  });

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private notificationService: NotificationService) {
  }

  ngAfterViewChecked(): void {
    if(this.messageFlow && this.initialLoad) {
      this.initialLoad = false;
      this.scrollToBottom();
    }
  }

  ngOnInit(): void {
    this.chat$ = this.chatService.onChatUpdated$.pipe(
      tap(stats => this.recalculateScrollPosition(stats)),
      catchError(err => {
        this.notificationService.showError(err);
        throw err;
      })
    );
    
    let chatId = this.activatedRoute.snapshot.paramMap.get('id');
    if (chatId) {
      this.chatService.connectToTheChat(Number(chatId)).subscribe();
    } else {
      let userId = this.activatedRoute.snapshot.queryParamMap.get('userId');
      this.chatService.connectToThePrivateChat(Number(userId)).subscribe();
    }
  }

  keypress($event: KeyboardEvent) {
    let ctrl = this.messageForm.get("text");
    ctrl.markAsTouched();
    if (!$event.shiftKey && $event.charCode == 13) {
      $event.preventDefault();
      if (ctrl.valid) {
        this.submit();
      }
    }
  }

  @debounce()
  onScroll(allHistoryFetched: boolean): void {
    if (this.messageFlow.nativeElement.scrollTop == 0 && !allHistoryFetched) {
      this.chatService.fetchNextHistory().subscribe();
    }

    let oldScroll = this.messageFlow?.nativeElement.scrollTop ?? 0;
    let oldHeight = this.messageFlow?.nativeElement.scrollHeight ?? 0;
    let clientHeight = this.messageFlow?.nativeElement.clientHeight ?? 0;
    let focusedBottom = oldHeight == oldScroll + clientHeight;

    if (focusedBottom) {
      this.chatService.resetLastSeenCounter().subscribe();
    }
  }

  submit(): void {
    let message = new Message();
    message.text = this.messageForm.get('text').value;
    this.messageForm.get('text').reset();

    if (this.chatService.stats == null) {
      this.activatedRoute.queryParamMap.pipe(
        map(p => Number(p.get('userId'))),
        concatMap(userId => this.chatService.startPrivateChat(userId))
      ).subscribe(() =>
        this.chatService.sendMessage(message).subscribe()
      );
    } else {
      this.chatService.sendMessage(message).subscribe();
    }
  }

  pickEmoji() {
    const dialogRef = this.dialog.open(EmojiPickerComponent, {
      width: '400px',
      backdropClass: 'backdrop-transparent'
    });

    dialogRef.componentInstance.emoji.subscribe((emoji: string) => {
      let value = this.messageForm.get("text").value ?? '';
      this.messageForm.get("text").setValue(value + emoji);
    });
  }

  scrollToBottom(): void {
    if (this.messageFlow) {
      this.messageFlow.nativeElement.scrollTop = this.messageFlow.nativeElement.scrollHeight;
    }
  }

  private recalculateScrollPosition(stats: ChatStats): void {
    let oldScroll = this.messageFlow?.nativeElement.scrollTop ?? 0;
    let oldHeight = this.messageFlow?.nativeElement.scrollHeight ?? 0;
    let clientHeight = this.messageFlow?.nativeElement.clientHeight ?? 0;
    let focusedBottom = oldHeight == oldScroll + clientHeight;
    let firstMessageElement = this.messageFlow?.nativeElement.childNodes[0];
    this.cdr.detectChanges();

    if (stats.updatedSide == ChatUpdatedSide.Up && firstMessageElement) {
      firstMessageElement.scrollIntoView();
    }
    else if (focusedBottom || stats.history[stats.history.length - 1].isMine) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    this.chatService.closeChat().subscribe();
  }
}