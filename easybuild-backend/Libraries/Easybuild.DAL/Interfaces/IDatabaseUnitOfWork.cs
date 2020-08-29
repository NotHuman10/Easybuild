using Easybuild.DAL.Interfaces;
using System;

namespace Easybuild.DAL
{
    public interface IDatabaseUnitOfWork : IDisposable
    {
        public string ConnectionString { get; }

        IUserRepository Users { get; }

        IAdvertRepository Adverts { get; }

        IProposalRepository Proposals { get; }

        IJobCategoryRepository JobCategories { get; }

        IFileMetadataRepository FileMetadata { get; }

        IContractRepository Contracts { get; }

        IChatRepository Chats { get; }

        IMessageRepository Messages { get; }

        void StartTransaction();

        void Commit();

        void Rollback();
    }
}