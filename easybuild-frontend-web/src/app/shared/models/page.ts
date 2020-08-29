export class Page<T> {
    public items: T[];
    public totalItems: number;
    public pageSize: number;
    public pageCount: number;
    public pageIndex: number;
}