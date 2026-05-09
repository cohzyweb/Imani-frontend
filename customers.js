// customers.js - Admin customers management (replaces Firebase)
import { apiRequest, pollData } from "./api.js";

const tableBody = document.getElementById("customersTableBody");
const totalCustomers = document.getElementById("totalCustomers");
const activeCustomers = document.getElementById("activeCustomers");
const inactiveCustomers = document.getElementById("inactiveCustomers");
const vipCustomers = document.getElementById("vipCustomers");
const saveBtn = document.getElementById("saveCustomerBtn");
const openModalBtn = document.getElementById("openAddCustomer");
const closeModalBtn = document.getElementById("closeCustomerModal");
const modal = document.getElementById("addCustomerModal");
const searchInput = document.getElementById("searchCustomer");

let allCustomers = [];

/* ================= POLLING ================= */
pollData(
  () => apiRequest("/customers"),
  (customers) => {
    allCustomers = customers;

    let active = 0, inactive = 0, vip = 0;
    customers.forEach((c) => {
      if (c.status === "Active") active++;
      if (c.status === "Inactive") inactive++;
      if (c.status === "VIP") vip++;
    });

    if (totalCustomers) totalCustomers.textContent = customers.length;
    if (activeCustomers) activeCustomers.textContent = active;
    if (inactiveCustomers) inactiveCustomers.textContent = inactive;
    if (vipCustomers) vipCustomers.textContent = vip;

    renderTable(allCustomers);
  },
  7000
);

/* ================= RENDER TABLE ================= */
function renderTable(data) {
  if (!tableBody) return;
  tableBody.innerHTML = "";

  data.forEach((customer) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${customer.name || "-"}</td>
      <td>${customer.email || "-"}</td>
      <td>${customer.phone || "-"}</td>
      <td>${customer.shipments || 0}</td>
      <td>
        <select onchange="updateCustomerStatus('${customer.id}', this.value)">
          <option ${customer.status === "Active" ? "selected" : ""}>Active</option>
          <option ${customer.status === "Inactive" ? "selected" : ""}>Inactive</option>
          <option ${customer.status === "VIP" ? "selected" : ""}>VIP</option>
        </select>
      </td>
      <td>
        <button onclick="deleteCustomer('${customer.id}')" class="btn btn-danger">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

/* ================= ADD CUSTOMER ================= */
saveBtn?.addEventListener("click", async () => {
  const name = document.getElementById("customerName")?.value.trim();
  const email = document.getElementById("customerEmail")?.value.trim();
  const phone = document.getElementById("customerPhone")?.value.trim();
  const status = document.getElementById("customerStatus")?.value;

  if (!name || !email) {
    alert("Name and Email required");
    return;
  }

  try {
    const customer = await apiRequest("/customers", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, status })
    });

    allCustomers.unshift(customer);
    renderTable(allCustomers);

    document.getElementById("customerName").value = "";
    document.getElementById("customerEmail").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerStatus").value = "Active";

    if (modal) modal.style.display = "none";
  } catch (error) {
    console.error("Error adding customer:", error);
    alert("Failed to add customer: " + error.message);
  }
});

/* ================= UPDATE STATUS ================= */
window.updateCustomerStatus = async (id, newStatus) => {
  try {
    await apiRequest(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus })
    });
  } catch (error) {
    console.error("Status update failed:", error);
  }
};

/* ================= DELETE ================= */
window.deleteCustomer = async (id) => {
  if (!confirm("Delete this customer?")) return;

  try {
    await apiRequest(`/customers/${id}`, { method: "DELETE" });
    allCustomers = allCustomers.filter((c) => c.id !== id);
    renderTable(allCustomers);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

/* ================= MODAL ================= */
openModalBtn?.addEventListener("click", () => {
  if (modal) modal.style.display = "flex";
});

closeModalBtn?.addEventListener("click", () => {
  if (modal) modal.style.display = "none";
});

/* ================= SEARCH ================= */
searchInput?.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = allCustomers.filter(
    (c) =>
      c.name?.toLowerCase().includes(value) ||
      c.email?.toLowerCase().includes(value)
  );
  renderTable(filtered);
});
