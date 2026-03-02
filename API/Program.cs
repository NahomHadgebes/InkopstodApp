using InkopstodApp.API.Middleware;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Application.Mapping;
using InkopstodApp.Domain.Entities;
using InkopstodApp.Infrastructure.Persistence;
using InkopstodApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InkopstodApp.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Repositories (Kopplar Interface till Implementation)
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IShoppingListRepository, ShoppingListRepository>();

            // Registrera AutoMapper och sök efter profiler i Application-projektet
            builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            var app = builder.Build();

            app.UseMiddleware<ExceptionMiddleware>();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowReact");

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            // Skapa en "Scope" för att komma åt databasen vid uppstart
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<ApplicationDbContext>();

                if (!context.Users.Any())
                {
                    context.Users.Add(new User
                    {
                        Username = "admin",
                        PasswordHash = "admin123",
                        Role = "Admin"
                    });

                    context.Users.Add(new User
                    {
                        Username = "personal",
                        PasswordHash = "user123",
                        Role = "Personal"
                    });

                    context.SaveChanges();
                }
            }

            app.Run();
        }
    }
}
