using InkopstodApp.API.Middleware;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Application.Mapping;
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

            builder.Services.AddControllers();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseMiddleware<ExceptionMiddleware>();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
