import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { ChatListComponent } from './components/chatlist/chatlist.component';

const chatRoutes: Routes = [
  {
    path: '',
    component: ChatComponent
  },
  {
    path: 'list',
    component: ChatListComponent
  },
  {
    path: ':id',
    component: ChatComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(chatRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChatRoutingModule { }