namespace InkopstodApp.Domain.Entities
{
    public class ShoppingList
    {
        public int Id { get; set; }
        public string ResidentName { get; set; } = string.Empty; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsCompleted { get; set; }

        public ICollection<ShoppingListProduct> ListProducts { get; set; } = new List<ShoppingListProduct>();
    }
}