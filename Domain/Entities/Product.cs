namespace InkopstodApp.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public int CategoryId { get; set; }

        public Category Category { get; set; } = null!;

        public ICollection<ShoppingListProduct> ListProducts { get; set; } = new List<ShoppingListProduct>();
    }
}