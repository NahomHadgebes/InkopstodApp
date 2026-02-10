using InkopstodApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InkopstodApp.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ShoppingList> ShoppingLists { get; set; }
        public DbSet<ShoppingListProduct> ShoppingListProducts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ShoppingListProduct>()
                .HasKey(slp => new { slp.ShoppingListId, slp.ProductId });

            modelBuilder.Entity<ShoppingListProduct>()
                .HasOne(slp => slp.ShoppingList)
                .WithMany(sl => sl.ListProducts)
                .HasForeignKey(slp => slp.ShoppingListId);

            modelBuilder.Entity<ShoppingListProduct>()
                .HasOne(slp => slp.Product)
                .WithMany(p => p.ListProducts)
                .HasForeignKey(slp => slp.ProductId);
        }
    }
}