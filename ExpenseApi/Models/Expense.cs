namespace ExpenseApi.Models;

public class Expense
{
    public int Id { get; set; }
    public double Amount { get; set; }
    public string Note { get; set; }
    public DateTime Date { get; set; }

    public int CategoryId { get; set; }
}