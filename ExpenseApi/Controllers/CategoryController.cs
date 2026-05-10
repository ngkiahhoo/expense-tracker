using Microsoft.AspNetCore.Mvc;
using ExpenseApi.Data;
using ExpenseApi.Models;

namespace ExpenseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Categories.ToList());
    }

    [HttpPost]
    public IActionResult Add(Category category)
    {
        _context.Categories.Add(category);
        _context.SaveChanges();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var cat = _context.Categories.Find(id);
        if (cat == null) return NotFound();

        _context.Categories.Remove(cat);
        _context.SaveChanges();
        return Ok();
    }
}