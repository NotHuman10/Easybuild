import { AdvertSortingOption, UserRole } from './enums';
import { PageRequest } from './page-request';

export class AdvertPageRequest extends PageRequest {
    advertSortingOption: AdvertSortingOption;
    searchKeywords: string;
    searchInDescription: boolean;
    jobCategoriesId?: number[];
    role?: UserRole;
    userId?: number;
}