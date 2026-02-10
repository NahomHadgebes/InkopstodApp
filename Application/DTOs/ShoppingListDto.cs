namespace InkopstodApp.Application.DTOs
{
    public class ShoppingListDto
    {
        public int Id { get; set; }
        public string ResidentName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsCompleted { get; set; }
        public List<ProductDto> Products { get; set; } = new();
    }
}