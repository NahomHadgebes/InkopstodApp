using AutoMapper;
using InkopstodApp.API.Controllers;
using InkopstodApp.Application.DTOs;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Domain.Entities;
using InkopstodApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace InkopstodApp.Tests
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductRepository> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ProductsController _controller;
        private readonly ApplicationDbContext _context;

        public ProductsControllerTests()
        {
            _mockRepo = new Mock<IProductRepository>();
            _mockMapper = new Mock<IMapper>();

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _controller = new ProductsController(_mockRepo.Object, _mockMapper.Object, _context);
        }

        [Fact]
        public async Task GetProduct_WhenProductExists_ReturnsOkAndProduct()
        {
            // Arrange
            int productId = 1;
            var product = new Product { Id = productId, Name = "Mjölk" };
            var productDto = new ProductDto { Id = productId, Name = "Mjölk" };

            _mockRepo.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync(product);
            _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

            // Act
            var result = await _controller.GetProduct(productId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProduct = Assert.IsType<ProductDto>(okResult.Value);
            Assert.Equal(productId, returnedProduct.Id);
        }

        [Fact]
        public async Task GetProduct_WhenProductDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Product)null);

            // Act
            var result = await _controller.GetProduct(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetProducts_ReturnsAllProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Mjölk" },
                new Product { Id = 2, Name = "Bröd" }
            };
            var productDtos = new List<ProductDto>
            {
                new ProductDto { Id = 1, Name = "Mjölk" },
                new ProductDto { Id = 2, Name = "Bröd" }
            };

            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(products);
            _mockMapper.Setup(m => m.Map<IEnumerable<ProductDto>>(products)).Returns(productDtos);

            // Act
            var result = await _controller.GetProducts();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(okResult.Value);
            Assert.Equal(2, returned.Count());
        }

        [Fact]
        public async Task DeleteProduct_CallsRepositoryDelete()
        {
            // Arrange
            int productId = 1;
            _mockRepo.Setup(repo => repo.DeleteAsync(productId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteProduct(productId);

            // Assert
            _mockRepo.Verify(r => r.DeleteAsync(productId), Times.Once);
            Assert.IsType<NoContentResult>(result);
        }
    }
}