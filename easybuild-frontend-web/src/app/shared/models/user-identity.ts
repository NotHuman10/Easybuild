import { UserRole } from './enums';

export class UserIdentity {
    id: number;
    username: string;
    roleId: UserRole;
    createDate: Date;
    name: string;
    lastName: string;
    mobile: string;
    rating: number;
    avatarId: string;
    bio: string;
}