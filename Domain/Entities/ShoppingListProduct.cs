namespace InkopstodApp.Domain.Entities
{
    public class ShoppingListProduct
    {
        public int ShoppingListId { get; set; }
        public ShoppingList ShoppingList { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; } 
    }
}