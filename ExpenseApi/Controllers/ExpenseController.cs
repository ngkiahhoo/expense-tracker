using Microsoft.AspNetCore.Mvc;
using ExpenseApi.Data;
using ExpenseApi.Models;

namespace ExpenseApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpenseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Expenses.ToList());
    }

    [HttpPost]
    public IActionResult Add(Expense expense)
    {
        _context.Expenses.Add(expense);
        _context.SaveChanges();
        return Ok(expense);
    }
}