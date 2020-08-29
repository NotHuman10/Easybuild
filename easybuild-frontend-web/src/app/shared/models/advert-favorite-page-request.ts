import { PageRequest } from './page-request';

export class AdvertFavoritePageRequest extends PageRequest {
    userId?: number;
    showOnlyMy: boolean;
}