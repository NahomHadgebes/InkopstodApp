using Moq;
using Xunit;
using InkopstodApp.API.Controllers;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace InkopstodApp.Tests
{
    public class ShoppingListTests
    {
        [Fact]
        public async Task CreateShoppingList_ShouldCallRepositoryAndReturnCreated()
        {
            // Arrange
            var mockRepo = new Mock<IShoppingListRepository>();
            var mockMapper = new Mock<IMapper>();
            var controller = new ShoppingListsController(mockRepo.Object, mockMapper.Object);
            string residentName = "Karl Karlsson";

            // Act
            var result = await controller.CreateShoppingList(residentName);

            // Assert
            mockRepo.Verify(r => r.CreateAsync(It.Is<ShoppingList>(l => l.ResidentName == residentName)), Times.Once);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }
    }
}