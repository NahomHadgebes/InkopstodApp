using System.ComponentModel.DataAnnotations;

namespace InkopstodApp.Application.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Produktens namn är obligatoriskt")]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Du måste välja en giltig kategori")]
        public int CategoryId { get; set; }
    }
}