using InkopstodApp.Domain.Entities;
using InkopstodApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace InkopstodApp.Tests
{
    public class AuthControllerTests
    {
        private ApplicationDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new ApplicationDbContext(options);
        }

        private IConfiguration CreateFakeConfig()
        {
            var inMemorySettings = new Dictionary<string, string>
            {
                { "Jwt:Key", "test-superhemlig-nyckel-som-ar-tillrackligt-lang-32chars" },
                { "Jwt:Issuer", "InkopstodApp" },
                { "Jwt:Audience", "InkopstodApp" }
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();
        }

        [Fact]
        public async Task Login_WithCorrectPassword_ReturnsOkWithToken()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var config = CreateFakeConfig();

            context.Users.Add(new User
            {
                Id = 1,
                Username = "testuser",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("rätt-lösenord"),
                Role = "Personal"
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(context, config);

            // Act
            var result = await controller.Login(new LoginDto
            {
                Username = "testuser",
                Password = "rätt-lösenord"
            });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = okResult.Value!.ToString()!;
            Assert.Contains("token", value.ToLower());
        }

        [Fact]
        public async Task Login_WithWrongPassword_ReturnsUnauthorized()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var config = CreateFakeConfig();

            context.Users.Add(new User
            {
                Id = 1,
                Username = "testuser",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("rätt-lösenord"),
                Role = "Personal"
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(context, config);

            // Act
            var result = await controller.Login(new LoginDto
            {
                Username = "testuser",
                Password = "fel-lösenord"
            });

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_WithNonExistentUser_ReturnsUnauthorized()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var config = CreateFakeConfig();
            var controller = new AuthController(context, config);

            // Act
            var result = await controller.Login(new LoginDto
            {
                Username = "finns-inte",
                Password = "spelar-ingen-roll"
            });

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Register_WithDuplicateUsername_ReturnsBadRequest()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var config = CreateFakeConfig();

            context.Users.Add(new User
            {
                Id = 1,
                Username = "befintlig",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("lösenord"),
                Role = "Personal"
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(context, config);

            // Act
            var result = await controller.Register(new RegisterDto
            {
                Username = "befintlig",
                Password = "nytt-lösenord"
            });

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Register_WithNewUsername_ReturnsOkAndHashesPassword()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var config = CreateFakeConfig();
            var controller = new AuthController(context, config);

            // Act
            var result = await controller.Register(new RegisterDto
            {
                Username = "ny-personal",
                Password = "lösenord123"
            });

            // Assert
            Assert.IsType<OkObjectResult>(result);

            // Verifiera att lösenordet faktiskt hashades i databasen
            var savedUser = await context.Users.FirstAsync(u => u.Username == "ny-personal");
            Assert.NotEqual("lösenord123", savedUser.PasswordHash); // Inte klartext
            Assert.True(BCrypt.Net.BCrypt.Verify("lösenord123", savedUser.PasswordHash)); // Men korrekt hash
        }
    }
}