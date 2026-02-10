using InkopstodApp.Domain.Entities;

namespace InkopstodApp.Application.Interfaces
{
    public interface IShoppingListRepository
    {
        Task<IEnumerable<ShoppingList>> GetAllAsync();
        Task<ShoppingList?> GetByIdAsync(int id);
        Task CreateAsync(ShoppingList list);
        Task UpdateAsync(ShoppingList list);
        Task DeleteAsync(int id);
    }
}