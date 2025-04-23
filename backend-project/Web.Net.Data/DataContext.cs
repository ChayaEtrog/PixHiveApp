using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.Entity;

namespace Web.Net.Data
{
    public class DataContext : DbContext
    {
        public DbSet<UserEntity> Users { get; set; }

        public DbSet<AlbumEntity> Albums { get; set; }

        public DbSet<FileEntity> Files { get; set; }

        public DbSet<TagEntity> Tags { get; set; }

        public DbSet<MessageEntity> Messages { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<UserMessageReads> UserMessageReads { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserMessageReads>()
                .HasKey(umr => new { umr.UserId, umr.MessageId }); // הגדרת מפתח משולב


            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AlbumEntity>()
                .HasMany(a => a.Files)
                .WithMany(f => f.Albums)
                .UsingEntity<Dictionary<string, object>>(
                    "AlbumFile",
                    j => j.HasOne<FileEntity>().WithMany().HasForeignKey("FilesId").OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<AlbumEntity>().WithMany().HasForeignKey("AlbumsId").OnDelete(DeleteBehavior.Restrict)
                );

            modelBuilder.Entity<TagEntity>()
               .HasMany(a => a.Files)
               .WithMany(f => f.Tags)
               .UsingEntity<Dictionary<string, object>>(
                   "FileEntityTagEntity",
                   j => j.HasOne<FileEntity>().WithMany().HasForeignKey("FilesId").OnDelete(DeleteBehavior.Restrict),
                   j => j.HasOne<TagEntity>().WithMany().HasForeignKey("TagsId").OnDelete(DeleteBehavior.Restrict)
               );

            modelBuilder.Entity<AlbumEntity>()
                .HasOne(a => a.User)
                .WithMany(u => u.Albums)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MessageEntity>()
                 .HasOne(m => m.User)
                 .WithMany(u => u.Messages)
                 .HasForeignKey(m => m.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileEntity>()
                .HasOne(f => f.User)
                .WithMany(u => u.Files)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.LogTo(mesege => Console.Write(mesege));
        }
    }
}
