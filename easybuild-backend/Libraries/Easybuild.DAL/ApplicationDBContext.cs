using Easybuild.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Easybuild.DAL
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options)
        {
            Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<AdvertFavorite>()
                .HasKey(f => new { f.AdvertId, f.UserId });

            modelBuilder
                .Entity<AdvertFavorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.FavoriteAdverts)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<AdvertFavorite>()
                .HasOne(f => f.Advert)
                .WithMany(u => u.FavoriteUsers)
                .HasForeignKey(f => f.AdvertId);

            modelBuilder
                .Entity<Contract>()
                .HasOne(c => c.Customer)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Contract>()
                .HasOne(c => c.Performer)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique(true);

            modelBuilder
                .Entity<User>()
                .Property(u => u.RoleId)
                .HasConversion<int>();

            modelBuilder
                .Entity<ChatUser>()
                .HasOne(d => d.User)
                .WithMany(u => u.Chats);

            modelBuilder
                .Entity<ChatUser>()
                .HasOne(d => d.Chat)
                .WithMany(d => d.Participants);

            modelBuilder
                .Entity<ChatUser>()
                .HasKey(d => new { d.UserId, d.ChatId });

            MapTables(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        private void MapTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Advert>().ToTable("Adverts");
            modelBuilder.Entity<AdvertFavorite>().ToTable("AdvertFavorites");
            modelBuilder.Entity<Chat>().ToTable("Chats");
            modelBuilder.Entity<ChatUser>().ToTable("ChatUsers");
            modelBuilder.Entity<Contract>().ToTable("Contracts");
            modelBuilder.Entity<FileMetadata>().ToTable("FilesMetadata");
            modelBuilder.Entity<JobCategory>().ToTable("JobCategories");
            modelBuilder.Entity<JobProposal>().ToTable("JobProposals");
            modelBuilder.Entity<Message>().ToTable("Messages");
            modelBuilder.Entity<User>().ToTable("Users");
        }
    }
}