using ExpenseApi.Models;
using ExpenseApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

// 自动 Migration
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();

    // 默认分类
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

var port = Environment.GetEnvironmentVariable("PORT") ?? "5233";

app.Run($"http://0.0.0.0:{port}");