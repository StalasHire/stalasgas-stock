// =====================================
// STALA'S GAS BUSINESS MANAGEMENT SYSTEM
// app.js
// =====================================

// Supabase Connection
const supabase = window.supabase.createClient(
  "https://prgyyylrwxkzelydtaaw.supabase.co",
  "sb_publishable_FK3b49UnfyeMxKpcL0v92w_p0Lf5brf"
);

// Start the dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  subscribeRealtime();
});

// -------------------------
// Load Dashboard
// -------------------------
async function loadDashboard() {
  await loadStats();
  await loadOrders();
}

// -------------------------
// Dashboard Statistics
// -------------------------
async function loadStats() {

  const { data, error } = await supabase
    .from("orders")
    .select("amount");

  if (error) {
    console.error(error);
    return;
  }

  let revenue = 0;

  data.forEach(order => {
    revenue += Number(order.amount);
  });

  const totalOrders = document.getElementById("totalOrders");
  const totalRevenue = document.getElementById("totalRevenue");

  if (totalOrders)
    totalOrders.textContent = data.length;

  if (totalRevenue)
    totalRevenue.textContent = "R" + revenue.toFixed(2);

}

// -------------------------
// Load Orders Table
// -------------------------
async function loadOrders() {

  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    console.error("Supabase Error:", error);
    alert(error.message);
    return;
  }

  console.log("Orders:", data);

  const tbody = document.getElementById("ordersTable");
  tbody.innerHTML = "";

  data.forEach(order => {

    tbody.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer_name}</td>
        <td>${order.customer_phone}</td>
        <td>${order.order_type}</td>
        <td>${order.cylinder_size}</td>
        <td>${order.quantity}</td>
        <td>R${order.amount}</td>
        <td>${order.status}</td>
        <td>
          <button onclick="markDelivered(${order.id})">
            Deliver
          </button>
        </td>
      </tr>
    `;

  });

}
