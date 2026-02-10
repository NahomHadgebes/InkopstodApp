using Moq;
using Xunit;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using InkopstodApp.API.Controllers;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Application.DTOs;
using InkopstodApp.Domain.Entities;

namespace InkopstodApp.Tests
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductRepository> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _mockRepo = new Mock<IProductRepository>();
            _mockMapper = new Mock<IMapper>();
            _controller = new ProductsController(_mockRepo.Object, _mockMapper.Object);
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
            int productId = 99;
            _mockRepo.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync((Product)null);

            // Act
            var result = await _controller.GetProduct(productId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}