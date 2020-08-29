import { UserIdentity } from '@shared/models/user-identity';
import { JobProposal } from './job-proposal';

export class Advert {
    id: number;
    userId: number;
    user?: UserIdentity;
    jobProposals: JobProposal[];
    title: string;
    description: string;
    createdDate: string;
    closed: boolean;
    imageId?: string;
    address: string;
}