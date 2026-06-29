// ======================================
// STALA'S GAS ORDER SYSTEM
// ======================================

const supabase = window.supabase.createClient(
    "https://prgyyylrwxkzelydtaaw.supabase.co",
    "sb_publishable_FK3b49UnfyeMxKpcL0v92w_p0Lf5brf"
);

let currentPrice = 0;

const orderType = document.getElementById("orderType");
const cylinderSize = document.getElementById("cylinderSize");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");

orderType.addEventListener("change", calculatePrice);
cylinderSize.addEventListener("change", calculatePrice);
quantity.addEventListener("input", calculatePrice);

async function calculatePrice() {

    if (!orderType.value || !cylinderSize.value) return;

    const { data, error } = await supabase
        .from("prices")
        .select("*")
        .eq("order_type", orderType.value)
        .eq("cylinder_size", cylinderSize.value)
        .single();

    if (error) {
        console.log(error);
        return;
    }

    currentPrice = Number(data.price);

    let total = currentPrice * Number(quantity.value);

    totalPrice.innerHTML = "Total: R" + total.toFixed(2);

}

document.getElementById("saveBtn").addEventListener("click", saveOrder);

async function saveOrder() {

    if (currentPrice === 0) {
        alert("Please select a valid Order Type and Cylinder Size first.");
        return;
    }

    const order = {
        customer_name: document.getElementById("customerName").value.trim(),
        customer_phone: document.getElementById("customerPhone").value.trim(),
        customer_address: document.getElementById("customerAddress").value.trim(),
        order_type: orderType.value,
        cylinder_size: cylinderSize.value,
        quantity: Number(quantity.value),
        amount: currentPrice * Number(quantity.value),
        payment_method: document.getElementById("paymentMethod").value,
        status: "Pending"
    };

    console.log("Saving order:", order);

    const { data, error } = await supabase
        .from("orders")
        .insert([order])
        .select();

    if (error) {
        console.error("Insert Error:", error);
        alert("Error: " + error.message);
        return;
    }

    console.log("Order saved:", data);

    alert("Order Saved Successfully!");

    window.location.href = "index.html";
}
