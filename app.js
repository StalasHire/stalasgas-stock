// STALA'S GAS MANAGEMENT SYSTEM

const supabase = window.supabase.createClient(
  'https://prgyyylrwxkzelydtaaw.supabase.co',
  'sb_publishable_FK3b49UnfyeMxKpcL0v92w_p0Lf5brf'
);

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setupRealtime();
});

async function loadDashboard() {
  await loadOrders();
  await loadStats();
}

async function loadOrders() {

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const tbody = document.getElementById('ordersTable');

  tbody.innerHTML = '';

  data.forEach(order => {

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer_name}</td>
      <td>${order.customer_phone}</td>
      <td>${order.order_type}</td>
      <td>${order.cylinder_size}</td>
      <td>R${order.amount}</td>
      <td>${order.status}</td>

      <td>
        <button onclick="markDelivered(${order.id})">
          Deliver
        </button>
      </td>
    `;

    tbody.appendChild(row);

  });

}

async function loadStats() {

  const { data } = await supabase
    .from('orders')
    .select('*');

  let revenue = 0;

  data.forEach(order => {
    revenue += Number(order.amount);
  });

  document.getElementById('totalOrders').textContent =
    data.length;

  document.getElementById('totalRevenue').textContent =
    `R${revenue}`;

}

async function createOrder(orderData) {

  const { error } = await supabase
    .from('orders')
    .insert([orderData]);

  if (error) {
    alert(error.message);
    return;
  }

  alert('Order Saved');

}

async function markDelivered(orderId) {

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'Delivered',
      completed_at: new Date()
    })
    .eq('id', orderId);

  if (error) {
    alert(error.message);
    return;
  }

}

async function assignDriver(orderId, driverId) {

  const { error } = await supabase
    .from('orders')
    .update({
      assigned_driver: driverId
    })
    .eq('id', orderId);

  if (error) {
    alert(error.message);
    return;
  }

}

function setupRealtime() {

  supabase
    .channel('orders-channel')

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      payload => {

        console.log('Realtime Update', payload);

        loadDashboard();

      }
    )

    .subscribe();

}
