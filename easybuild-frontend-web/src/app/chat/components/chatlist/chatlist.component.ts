import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChatService } from '@app/chat/services/chat.service';
import { ChatInfo } from '@app/shared/models/chat-info';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent implements OnInit {
  $chatList$: Observable<ChatInfo[]>;

  constructor(private chatService: ChatService) {
    this.$chatList$ = chatService.getList();
  }

  ngOnInit(): void {
  }
}