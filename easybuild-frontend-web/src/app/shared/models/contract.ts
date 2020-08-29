import { UserIdentity } from './user-identity';
import { JobProposal } from './job-proposal';
import { ContractStatus } from './contract-status';

export class Contract {
    id: number;
    customerId: number;
    customer: UserIdentity;
    performerId: number;
    performer: UserIdentity;
    jobProposals: JobProposal[];
    createdDate: string;
    effectiveDate: string;
    expirationDate: string;
    signOffDate: string;
    reportId: number;
    status: ContractStatus;
    constructionSiteAddress: string;
}