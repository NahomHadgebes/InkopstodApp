using AutoMapper;
using InkopstodApp.Application.DTOs;
using InkopstodApp.Application.Interfaces;
using InkopstodApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InkopstodApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShoppingListsController : ControllerBase
    {
        private readonly IShoppingListRepository _repository;
        private readonly IMapper _mapper;

        public ShoppingListsController(IShoppingListRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShoppingList>>> GetShoppingLists()
        {
            var lists = await _repository.GetAllAsync();
            return Ok(lists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ShoppingListDto>> GetShoppingList(int id)
        {
            var list = await _repository.GetByIdAsync(id);
            if (list == null) return NotFound();
            return Ok(_mapper.Map<ShoppingListDto>(list));
        }

        [HttpPost]
        public async Task<ActionResult<ShoppingListDto>> CreateShoppingList(string residentName)
        {
            var newList = new ShoppingList
            {
                ResidentName = residentName,
                CreatedAt = DateTime.UtcNow,
                IsCompleted = false
            };
            await _repository.CreateAsync(newList);
            return CreatedAtAction(nameof(GetShoppingList), new { id = newList.Id }, _mapper.Map<ShoppingListDto>(newList));
        }

        [HttpPost("{listId}/products")]
        public async Task<IActionResult> AddProductToList(int listId, AddProductToListDto dto)
        {
            var list = await _repository.GetByIdAsync(listId);
            if (list == null) return NotFound("Listan hittades inte");

            var listProduct = new ShoppingListProduct
            {
                ShoppingListId = listId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };

            list.ListProducts.Add(listProduct);
            await _repository.UpdateAsync(list);
            return NoContent();
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var allLists = await _repository.GetAllAsync();
            return Ok(new
            {
                TotalLists = allLists.Count(),
                ActiveLists = allLists.Count(l => !l.IsCompleted),
                CompletedLists = allLists.Count(l => l.IsCompleted)
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShoppingList(int id)
        {
            var list = await _repository.GetByIdAsync(id);
            if (list == null) return NotFound();
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}