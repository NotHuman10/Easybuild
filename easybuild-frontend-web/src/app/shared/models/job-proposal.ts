import { JobCategory } from './job-category';

export class JobProposal
{
    id: number;
    name: string;
    pricingUnit: string;
    amount: number;
    jobCategoryId: number;
    jobCategory: JobCategory;
    advertId: number;
    price: number;
}