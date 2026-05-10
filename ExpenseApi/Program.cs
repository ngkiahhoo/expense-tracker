using ExpenseApi.Models;
using ExpenseApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 数据库
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("ExpenseDb"));

// Controller
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        p => p.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Categories.Any())
    {
        db.Categories.AddRange(
            new Category { Name = "Food", Type = "Needs" },
            new Category { Name = "Transport", Type = "Needs" },
            new Category { Name = "Bills", Type = "Needs" },

            new Category { Name = "Entertainment", Type = "Wants" },
            new Category { Name = "Shopping", Type = "Wants" },

            new Category { Name = "Savings", Type = "Savings" }
        );

        db.SaveChanges();
    }
}

app.Run("http://0.0.0.0:5233");