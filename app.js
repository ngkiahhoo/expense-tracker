const API = "https://expense-tracker-api-pgdr.onrender.com/api";

let categories = [];
let expenses = [];

// ===== 初始化 =====
async function init() {
  await loadCategories();
  await loadExpenses();

  renderCategories();
  renderList();
  updateSummary();

  document
    .getElementById("type")
    .addEventListener("change", renderCategories);
}

init();

// ===== 加载分类 =====
async function loadCategories() {
  const res = await fetch(`${API}/Category`);
  categories = await res.json();
}

// ===== 加载记录 =====
async function loadExpenses() {
  const res = await fetch(`${API}/Expense`);
  expenses = await res.json();
}

// ===== 渲染分类 =====
function renderCategories() {
  const type = document.getElementById("type").value;
  const select = document.getElementById("category");

  select.innerHTML = "";

  const filtered = categories.filter(
    c => c.type === type
  );

  filtered.forEach(c => {
    const option = document.createElement("option");

    option.value = c.id;
    option.textContent = c.name;

    select.appendChild(option);
  });
}

// ===== 添加记录 =====
async function addExpense() {

  const amount = parseFloat(
    document.getElementById("amount").value
  );

  const note =
    document.getElementById("note").value;

  const categoryId = parseInt(
    document.getElementById("category").value
  );

  // validation
  if (!amount || isNaN(amount)) {
    alert("Please enter amount");
    return;
  }

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
  updateSummary();

  // clear inputs
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
}

// ===== 渲染记录 =====
function renderList() {

  expenses.sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  );

  const ul = document.getElementById("list");

  ul.innerHTML = "";

  expenses.forEach(e => {

    const cat = categories.find(
      c => c.id === e.categoryId
    );

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="expense-top">

        <div class="expense-category">
          ${cat?.name || "Unknown"}
        </div>

        <div class="expense-amount">
          RM${Number(e.amount).toFixed(2)}
        </div>

      </div>

      <div class="expense-note">
        ${e.note || ""}
      </div>

      <div class="expense-date">
        ${new Date(e.date).toLocaleDateString()}
        ·
        ${cat?.type || ""}
      </div>
    `;

    ul.appendChild(li);

  });
}

// ===== Monthly Summary =====
function updateSummary() {

  let needs = 0;
  let wants = 0;
  let savings = 0;

  expenses.forEach(e => {

    const cat = categories.find(
      c => c.id === e.categoryId
    );

    if (!cat) return;

    if (cat.type === "Needs") {
      needs += e.amount;
    }

    if (cat.type === "Wants") {
      wants += e.amount;
    }

    if (cat.type === "Savings") {
      savings += e.amount;
    }

  });

  document.getElementById(
    "needsTotal"
  ).textContent =
    `RM${needs.toFixed(2)}`;

  document.getElementById(
    "wantsTotal"
  ).textContent =
    `RM${wants.toFixed(2)}`;

  document.getElementById(
    "savingsTotal"
  ).textContent =
    `RM${savings.toFixed(2)}`;
}

// ===== 导出 Excel =====
function exportExcel() {

  const data = expenses.map(e => {

    const cat = categories.find(
      c => c.id === e.categoryId
    );

    return {
      Date: e.date,
      Amount: e.amount,
      Type: cat?.type,
      Category: cat?.name,
      Note: e.note
    };

  });

  const ws =
    XLSX.utils.json_to_sheet(data);

  const wb =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Expenses"
  );

  XLSX.writeFile(
    wb,
    "expenses.xlsx"
  );
}
