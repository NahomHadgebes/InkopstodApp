using InkopstodApp.Application.DTOs;
using System.ComponentModel.DataAnnotations;
using Xunit;

namespace InkopstodApp.Tests
{
    public class ProductValidationTests
    {
        [Theory]
        [InlineData("", 1, "namn är obligatoriskt")]
        [InlineData("A", 1, "minimum")]               
        [InlineData("Mjölk", 0, "giltig kategori")]   
        public void ProductCreateDto_InvalidData_ShouldReturnValidationError(string name, int catId, string expectedError)
        {
            // Arrange
            var dto = new ProductCreateDto { Name = name, CategoryId = catId };

            // Act
            var context = new ValidationContext(dto);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(dto, context, results, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(results, v => v.ErrorMessage.ToLower().Contains(expectedError.ToLower()));
        }

        [Fact]
        public void ProductCreateDto_ValidData_ShouldPassValidation()
        {
            // Arrange
            var dto = new ProductCreateDto { Name = "Bröd", CategoryId = 1 };

            // Act
            var context = new ValidationContext(dto);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(dto, context, results, true);

            // Assert
            Assert.True(isValid);
        }
    }
}