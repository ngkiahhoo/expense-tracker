using Microsoft.EntityFrameworkCore;
using ExpenseApi.Models;

namespace ExpenseApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<Category> Categories { get; set; }
    public DbSet<Expense> Expenses { get; set; }
}