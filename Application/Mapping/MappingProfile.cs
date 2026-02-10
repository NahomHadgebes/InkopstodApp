using AutoMapper;
using InkopstodApp.Application.DTOs;
using InkopstodApp.Domain.Entities;

namespace InkopstodApp.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // --- ShoppingList ---
            CreateMap<ShoppingList, ShoppingListDto>()
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.ListProducts.Select(lp => lp.Product)));

            // --- Product ---
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<ProductCreateDto, Product>();
            CreateMap<ProductUpdateDto, Product>();

            // --- Category ---
            CreateMap<Category, CategoryDto>();
        }
    }
}