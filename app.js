const API = "http://192.168.0.157:5233/api";

let categories = [];
let expenses = [];

// ===== 初始化 =====
async function init() {
  await loadCategories();
  await loadExpenses();

  renderCategories();
  renderList();

  document.getElementById("type").addEventListener("change", renderCategories);
}

init();

// ===== 加载数据 =====
async function loadCategories() {
  const res = await fetch(`${API}/Category`);
  categories = await res.json();
}

async function loadExpenses() {
  const res = await fetch(`${API}/Expense`);
  expenses = await res.json();
}

// ===== 渲染分类 =====
function renderCategories() {
  const type = document.getElementById("type").value;
  const select = document.getElementById("category");

  select.innerHTML = "";

  const filtered = categories.filter(c => c.type === type);

  console.log("filtered:", filtered);

  filtered.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    select.appendChild(option);
  });
}

// ===== 添加记录 =====
async function addExpense() {
  const amount = parseFloat(document.getElementById("amount").value);
  const note = document.getElementById("note").value;
  const categoryId = parseInt(document.getElementById("category").value);

  const expense = {
    amount,
    note,
    date: new Date().toISOString(),
    categoryId
  };

  await fetch(`${API}/Expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expense)
  });

  await loadExpenses();
  renderList();
}

// ===== 渲染记录 =====
function renderList() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  expenses.forEach(e => {
    const cat = categories.find(c => c.id === e.categoryId);

    const li = document.createElement("li");

    li.textContent = `${e.date} - RM${e.amount} - ${cat?.type}/${cat?.name} - ${e.note}`;

    ul.appendChild(li);
  });
}

// ===== 导出 Excel =====
function exportExcel() {
  const data = expenses.map(e => {
    const cat = categories.find(c => c.id === e.categoryId);

    return {
      Date: e.date,
      Amount: e.amount,
      Type: cat?.type,
      Category: cat?.name,
      Note: e.note
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");

  XLSX.writeFile(wb, "expenses.xlsx");
}