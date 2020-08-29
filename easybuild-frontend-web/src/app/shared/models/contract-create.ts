import { JobProposal } from './job-proposal';

export class ContractCreateModel {
    userId: number;
    proposals: JobProposal[];
    expirationDate: string;
    constructionSiteAddress?: string;
}