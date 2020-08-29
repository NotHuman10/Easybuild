import { SortOrder } from '@app/shared/models/enums';

export abstract class PageRequest {
    pageIndex: number;
    pageSize: number;
    sortOrder?: SortOrder;
    orderBy?: string;
}