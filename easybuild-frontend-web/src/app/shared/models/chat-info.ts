import { Message } from './message';
import { UserIdentity } from './user-identity';

export class ChatInfo {
  id: number;
  name: string;
  imageId: string;
  participantsCount: number;
  privateChatUser: UserIdentity;
  lastMessage: Message;
  messagesCount: number;
  lastSeenCount: number;
}