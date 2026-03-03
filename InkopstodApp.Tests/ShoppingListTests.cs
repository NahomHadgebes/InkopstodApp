using AutoMapper;
using InkopstodApp.API.Controllers;
using InkopstodApp.Application.DTOs;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace InkopstodApp.Tests
{
    public class ShoppingListTests
    {
        private readonly Mock<IShoppingListRepository> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ShoppingListsController _controller;

        public ShoppingListTests()
        {
            _mockRepo = new Mock<IShoppingListRepository>();
            _mockMapper = new Mock<IMapper>();
            _controller = new ShoppingListsController(_mockRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task CreateShoppingList_ShouldCallRepositoryAndReturnCreated()
        {
            // Arrange
            string residentName = "Karl Karlsson";
            _mockMapper.Setup(m => m.Map<ShoppingListDto>(It.IsAny<ShoppingList>()))
                .Returns(new ShoppingListDto { ResidentName = residentName });

            // Act
            var result = await _controller.CreateShoppingList(residentName);

            // Assert
            _mockRepo.Verify(r => r.CreateAsync(
                It.Is<ShoppingList>(l => l.ResidentName == residentName)), Times.Once);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }

        [Fact]
        public async Task GetShoppingList_WhenNotFound_ReturnsNotFound()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ShoppingList)null);

            // Act
            var result = await _controller.GetShoppingList(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task DeleteShoppingList_WhenNotFound_ReturnsNotFound()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ShoppingList)null);

            // Act
            var result = await _controller.DeleteShoppingList(99);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteShoppingList_WhenFound_ReturnsNoContent()
        {
            // Arrange
            var list = new ShoppingList { Id = 1, ResidentName = "Anna" };
            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(list);
            _mockRepo.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteShoppingList(1);

            // Assert
            _mockRepo.Verify(r => r.DeleteAsync(1), Times.Once);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task AddProductToList_WhenListNotFound_ReturnsNotFound()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ShoppingList)null);
            var dto = new AddProductToListDto { ProductId = 1, Quantity = 2 };

            // Act
            var result = await _controller.AddProductToList(99, dto);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}