using Easybuild.DAL.Interfaces;
using Easybuild.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;

namespace Easybuild.DAL
{
    public sealed class DatabaseUnitOfWork : IDatabaseUnitOfWork
    {
        private readonly ApplicationDBContext _context;
        private IDbContextTransaction _transaction;

        private IUserRepository _users;
        private IAdvertRepository _adverts;
        private IProposalRepository _proposals;
        private IJobCategoryRepository _jobCategories;
        private IFileMetadataRepository _fileMetadata;
        private IContractRepository _contracts;
        private IChatRepository _chats;
        private IMessageRepository _messages;

        public string ConnectionString { get; private set; }

        public IUserRepository Users
        {
            get => _users ??= new UserRepository(_context);
        }

        public IAdvertRepository Adverts
        {
            get => _adverts ??= new AdvertRepository(_context);
        }

        public IProposalRepository Proposals
        {
            get => _proposals ??= new ProposalRepository(_context);
        }

        public IJobCategoryRepository JobCategories
        {
            get => _jobCategories ??= new JobCategoryRepository(_context);
        }

        public IFileMetadataRepository FileMetadata
        {
            get => _fileMetadata ??= new FileMetadataRepository(_context);
        }

        public IContractRepository Contracts
        {
            get => _contracts ??= new ContractRepository(_context);
        }

        public IChatRepository Chats
        {
            get => _chats ??= new ChatRepository(_context);
        }

        public IMessageRepository Messages
        {
            get => _messages ??= new MessageRepository(_context);
        }

        public DatabaseUnitOfWork(ApplicationDBContext context)
        {
            _context = context;
            ConnectionString = _context.Database.GetDbConnection().ConnectionString;
        }

        public void StartTransaction()
        {
            _transaction ??= _context.Database.BeginTransaction(IsolationLevel.ReadCommitted);
        }

        public void Commit()
        {
            _context.SaveChanges();
            _transaction?.Commit();
            _transaction?.Dispose();
        }

        public void Rollback()
        {
            foreach (var entry in _context.ChangeTracker.Entries())
            {
                entry.State = EntityState.Detached;
            }

            _transaction?.Rollback();
            _transaction?.Dispose();
        }

        public void Dispose()
        {
            _context.Dispose();
            _transaction?.Dispose();
        }
    }
}