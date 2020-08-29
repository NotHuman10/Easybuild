import { Chat } from './chat';
import { UserIdentity } from './user-identity';

export class Message {
    id: number;
    creatorId: number;
    creator: UserIdentity;
    createdDate: string;
    chatId: number;
    chat: Chat;
    text: string;
    isMine: boolean;
}