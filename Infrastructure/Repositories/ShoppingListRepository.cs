using InkopstodApp.Application.Interfaces;
using InkopstodApp.Domain.Entities;
using InkopstodApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InkopstodApp.Infrastructure.Repositories
{
    public class ShoppingListRepository : IShoppingListRepository
    {
        private readonly ApplicationDbContext _context;

        public ShoppingListRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShoppingList>> GetAllAsync()
        {
            return await _context.ShoppingLists
                .Include(l => l.ListProducts)
                    .ThenInclude(lp => lp.Product)
                .ToListAsync();
        }

        public async Task<ShoppingList?> GetByIdAsync(int id)
        {
            return await _context.ShoppingLists
                .Include(sl => sl.ListProducts)
                    .ThenInclude(lp => lp.Product)
                .FirstOrDefaultAsync(sl => sl.Id == id);
        }

        public async Task CreateAsync(ShoppingList list)
        {
            await _context.ShoppingLists.AddAsync(list);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ShoppingList list)
        {
            _context.Entry(list).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var list = await _context.ShoppingLists.FindAsync(id);
            if (list != null)
            {
                _context.ShoppingLists.Remove(list);
                await _context.SaveChangesAsync();
            }
        }
    }
}