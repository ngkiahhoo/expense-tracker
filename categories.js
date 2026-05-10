const API = "https://expense-tracker-api-pgdr.onrender.com/api";

let categories = [];

async function loadCategories() {
  const res = await fetch(`${API}/Category`);
  categories = await res.json();
  render();
}

function render() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  categories.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.type} - ${c.name}`;
    ul.appendChild(li);
  });
}

async function addCategory() {
  const name = document.getElementById("name").value;
  const type = document.getElementById("type").value;

  if (!name) return alert("Enter name");

  await fetch(`${API}/Category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, type })
  });

  document.getElementById("name").value = "";

  await loadCategories();
}

loadCategories();