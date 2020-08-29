import { UserIdentity } from './user-identity';

export class Chat {
    id: number;
    createdDate: string;
    ownerId?: number;
    owner?: UserIdentity;
    name: string;
    imageId: string;
    participants: UserIdentity[];
}