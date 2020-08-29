import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChatInfo } from '@app/shared/models/chat-info';

@Component({
  selector: 'app-chatlist-item',
  templateUrl: './chatlist-item.component.html',
  styleUrls: ['./chatlist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatlistItemComponent implements OnInit {
  @Input() item: ChatInfo;
  
  constructor() { }

  ngOnInit(): void {
  }
}