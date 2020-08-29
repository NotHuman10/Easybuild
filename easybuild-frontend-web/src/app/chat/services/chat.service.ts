import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Config } from '@app/app.config';
import { AuthService } from '@app/auth/auth.service';
import { Chat } from '@app/shared/models/chat';
import { Message } from '@app/shared/models/message';
import { UserIdentity } from '@app/shared/models/user-identity';
import { environment } from '@env/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatInfo } from '@shared/models/chat-info';
import { from, Observable, Subject } from "rxjs";
import { concatMap, filter, map, tap } from 'rxjs/operators';

export enum ChatUpdatedSide {
  Up,
  Down
}

export class ChatStats {
  updatedSide: ChatUpdatedSide;
  chat: Chat;
  history: Message[];
  allHistoryFetched: boolean;
  isPrivate: boolean;
  privateChatUser: UserIdentity;
}

@Injectable()
export class ChatService {
  private chatUpdates: Subject<ChatStats> = new Subject<ChatStats>();
  private hubConnection: HubConnection;
  
  public stats: ChatStats;
  public onChatUpdated$ = this.chatUpdates.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  connectToTheChat(chatId: number): Observable<ChatStats> {
    return this.getChat(chatId).pipe(
      filter(c => c != null),
      concatMap(() => this.startConnection()),
      concatMap(() => this.enterChat()),
      concatMap(() => this.fetchNextHistory()),
      map(() => this.stats));
  }

  connectToThePrivateChat(userId: number): Observable<ChatStats> {
    return this.getPrivateChat(userId).pipe(
      filter(c => c != null),
      concatMap(() => this.startConnection()),
      concatMap(() => this.enterChat()),
      concatMap(() => this.fetchNextHistory()),
      map(() => this.stats));
  }

  startPrivateChat(userId: number): Observable<ChatStats> {
    let chat = new Chat();
    let user = new UserIdentity();
    user.id = userId;
    chat.participants = [];
    chat.participants.push(user, this.authService.identity);
    return this.createChat(chat).pipe(
      filter(c => c != null),
      concatMap(() => this.startConnection()),
      concatMap(() => this.enterChat()));
  }

  closeChat(): Observable<void> {
    return from(this.hubConnection?.stop());
  }

  resetLastSeenCounter(): Observable<void> {
    return from(this.hubConnection.send("ResetLastSeen", this.stats.chat.id));
  }

  sendMessage(msg: Message): Observable<void> {
    msg.chatId = this.stats.chat.id;
    msg.creatorId = this.authService.identity.id;
    return from(this.hubConnection.send("Send", msg));
  }

  fetchNextHistory(count: number = 50): Observable<Message[]> {
    let headers = new HttpHeaders();
    headers = headers.set(Config.Settings.BYPASS_LOADING_INDICATOR_HTTPHEADER, 'true');
    let url = `${environment.apiUrl}chat/${this.stats.chat.id}/history?count=${count}&offset=${this.stats.history.length}`;
    return this.http.get(url, { headers: headers }).pipe(
      tap((m: Message[]) => this.processHistory(m))
    );
  }

  getChat(id: number): Observable<Chat> {
    return this.http.get(environment.apiUrl + `chat/${id}`)
      .pipe(tap((chat: Chat) => this.initChatStats(chat)));
  }

  getPrivateChat(userId: number): Observable<Chat> {
    return this.http.get(environment.apiUrl + `chat/private?userId=${userId}`)
      .pipe(tap((chat: Chat) => this.initChatStats(chat)));
  }

  getList(): Observable<ChatInfo[]> {
    return this.http.get(environment.apiUrl + 'chat/list')
      .pipe(map(res => res as ChatInfo[]));
  }

  createChat(chat: Chat): Observable<Chat> {
    let headers = new HttpHeaders();
    headers = headers.set(Config.Settings.BYPASS_LOADING_INDICATOR_HTTPHEADER, 'true');
    return this.http.post(environment.apiUrl + 'chat', chat, { headers: headers })
      .pipe(tap((chat: Chat) => this.initChatStats(chat)));
  }

  private processHistory(messages: Message[]): void {
    if (!messages?.length) {
      this.stats.allHistoryFetched = true;
      return;
    }

    messages = messages.sort((m1, m2) => Date.parse(m1.createdDate) - Date.parse(m2.createdDate));
    messages.forEach(m => m.isMine = m.creatorId == this.authService.identity.id);
    this.stats.history.unshift(...messages);
    this.stats.updatedSide = ChatUpdatedSide.Up;
    this.chatUpdates.next(this.stats);
  }

  private initChatStats(chat: Chat): void {
    if (!chat) {
      return;
    }
    
    this.stats = new ChatStats();
    this.stats.chat = chat;
    this.stats.history = [];
    this.stats.isPrivate = chat.participants.length == 2;
    this.stats.privateChatUser = this.stats.isPrivate
      ? chat.participants.find(p => p.id != this.authService.identity.id)
      : null;
  }

  private startConnection(): Observable<any> {    
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'chathub', { accessTokenFactory: () => this.authService.jwt })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(() => this.stats = null);

    return from(this.hubConnection.start())
      .pipe(tap(() => this.registerOnReceive()));
  }

  private enterChat(): Observable<any> {
    return from(this.hubConnection.send("Enter", this.stats.chat.id));
  }

  private registerOnReceive(): void {
    this.hubConnection.on('receiveMessage', (message: Message) => {
      message.isMine = message.creatorId == this.authService.identity.id;
      this.stats.history.push(message);
      this.stats.updatedSide = ChatUpdatedSide.Down;
      this.chatUpdates.next(this.stats);
    });
  }
}