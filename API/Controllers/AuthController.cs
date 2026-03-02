using InkopstodApp.Domain.Entities;
using InkopstodApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new { u.Id, u.Username, u.Role })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User newUser)
    {
        if (await _context.Users.AnyAsync(u => u.Username == newUser.Username))
        {
            return BadRequest("Användarnamnet är upptaget.");
        }

        // Säkerställ att lösenordet sparas i rätt fält
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Personal tillagd!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // 1. Hitta användaren baserat på användarnamn
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        // 2. Kontrollera om användaren finns och om lösenordet matchar PasswordHash
        // (Eftersom du skickar 'password' från frontend i LoginDto)
        if (user == null || user.PasswordHash != loginDto.Password)
        {
            return Unauthorized(new { message = "Fel användarnamn eller lösenord" });
        }

        // 3. Returnera användardata till frontend
        return Ok(new
        {
            id = user.Id,
            username = user.Username,
            role = user.Role
        });
    }

    // UPPDATERAD DELETE-ROUTE FÖR ATT MATCHA App.jsx: api/Auth/users/{id}
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "Användaren hittades inte." });
            }

            // Säkerhetsspärr: Förhindra radering av huvudkontot 'admin'
            if (user.Username.ToLower() == "admin")
            {
                return BadRequest(new { message = "Du kan inte radera huvudkontot för admin." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Användaren har raderats framgångsrikt." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ett serverfel uppstod vid radering.", error = ex.Message });
        }
    }
}

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}