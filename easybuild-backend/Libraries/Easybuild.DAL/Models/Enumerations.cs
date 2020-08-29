namespace Easybuild.DAL
{
    public enum Role
    {
        Customer = 1,
        Performer = 2,
        Admin = 3,
        IOT = 4
    }

    public enum FileType
    {
        Image = 1,
        Pdf = 2
    }

    public enum AdvertSortingOption
    {
        DateAdded = 1,
        AccountRating = 2,
        CompletedContracts = 3
    }

    public enum SortOrder
    {
        ASC = 1,
        DESC = 2
    }

    public enum ContractStatus
    {
        Proposed = 0,
        Completed = 1,
        Terminated = 2,
        Paused = 3
    }
}