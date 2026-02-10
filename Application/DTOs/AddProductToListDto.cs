using System.ComponentModel.DataAnnotations;

namespace InkopstodApp.Application.DTOs
{
    public class AddProductToListDto
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, 100, ErrorMessage = "Antalet måste vara mellan 1 och 100")]
        public int Quantity { get; set; }
    }
}