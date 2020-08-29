import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { ChatListComponent } from './components/chatlist/chatlist.component';
import { EmojiPickerComponent } from './components/emoji-picker/emoji-picker.component';
import { MessageComponent } from './components/message/message.component';
import { ChatService } from './services/chat.service';
import { ChatlistItemComponent } from './components/chatlist-item/chatlist-item.component';

@NgModule({
  declarations: [ChatComponent, MessageComponent, EmojiPickerComponent, ChatListComponent, ChatlistItemComponent],
  imports: [
    SharedModule,
    CommonModule,
    ChatRoutingModule
  ],
  providers: [
    ChatService
  ]
})
export class ChatModule { }