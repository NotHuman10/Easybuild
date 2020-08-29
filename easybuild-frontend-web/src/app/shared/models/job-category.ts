export interface JobCategory {
    id: number
    name : string
    subCategories: JobCategory[]
    active: boolean
}