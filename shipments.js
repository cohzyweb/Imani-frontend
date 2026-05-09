// shipments.js - Admin shipments management (replaces Firebase)
import { apiRequest, pollData } from "./api.js";

const tableBody = document.getElementById("shipmentsTableBody");
const totalShipmentsCard = document.getElementById("totalShipments");
const inTransitCard = document.getElementById("inTransit");
const deliveredCard = document.getElementById("delivered");
const delayedCard = document.getElementById("delayed");
const searchInput = document.getElementById("searchInput");

const createShipmentBtn = document.getElementById("createShipmentBtn");
const newCustomer = document.getElementById("newCustomer");
const newRoute = document.getElementById("newRoute");
const newType = document.getElementById("newType");
const newDate = document.getElementById("newDate");

const rowsPerPage = 5;
let currentPage = 1;
let allShipments = [];
let filteredShipments = [];

/* ================= POLLING ================= */
pollData(
  () => apiRequest("/shipments"),
  (shipments) => {
    allShipments = shipments;
    filteredShipments = [...shipments];

    let inTransit = 0, delivered = 0, delayed = 0;
    shipments.forEach((s) => {
      const st = (s.status || "").toLowerCase();
      if (st === "in transit") inTransit++;
      if (st === "delivered") delivered++;
      if (st === "delayed") delayed++;
    });

    if (totalShipmentsCard) totalShipmentsCard.textContent = shipments.length;
    if (inTransitCard) inTransitCard.textContent = inTransit;
    if (deliveredCard) deliveredCard.textContent = delivered;
    if (delayedCard) delayedCard.textContent = delayed;

    renderPage(currentPage);
  },
  6000
);

/* ================= CREATE SHIPMENT ================= */
createShipmentBtn?.addEventListener("click", async () => {
  const customerName = newCustomer?.value.trim();
  const route = newRoute?.value.trim();
  const shipmentType = newType?.value;
  const estimatedDelivery = newDate?.value;

  if (!customerName || !route || !estimatedDelivery) {
    alert("Please fill all fields");
    return;
  }

  try {
    const shipment = await apiRequest("/shipments", {
      method: "POST",
      body: JSON.stringify({ customerName, route, shipmentType, estimatedDelivery })
    });

    allShipments.unshift(shipment);
    filteredShipments = [...allShipments];

    if (newCustomer) newCustomer.value = "";
    if (newRoute) newRoute.value = "";
    if (newDate) newDate.value = "";

    const modal = document.getElementById("shipmentModal");
    if (modal) modal.style.display = "none";

    renderPage(1);
  } catch (error) {
    console.error("Error creating shipment:", error);
    alert("Failed to create shipment: " + error.message);
  }
});

/* ================= RENDER PAGE ================= */
function renderPage(page) {
  tableBody.innerHTML = "";

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredShipments.slice(start, end);

  paginatedItems.forEach((shipment) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${shipment.tracking_id}</td>
      <td>${shipment.customer_name}</td>
      <td>${shipment.route}</td>
      <td>${shipment.shipment_type}</td>
      <td>
        <select onchange="updateStatus('${shipment.id}', this.value)" class="status-select">
          <option ${shipment.status === "In Transit" ? "selected" : ""}>In Transit</option>
          <option ${shipment.status === "Delivered" ? "selected" : ""}>Delivered</option>
          <option ${shipment.status === "Delayed" ? "selected" : ""}>Delayed</option>
        </select>
      </td>
      <td>${shipment.estimated_delivery}</td>
      <td>
        <button onclick="deleteShipment('${shipment.id}')" class="btn btn-danger">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  renderPagination();
}

/* ================= UPDATE STATUS ================= */
window.updateStatus = async (id, newStatus) => {
  try {
    await apiRequest(`/shipments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus })
    });
  } catch (error) {
    console.error("Update failed:", error);
  }
};

/* ================= DELETE ================= */
window.deleteShipment = async (id) => {
  if (!confirm("Delete this shipment?")) return;

  try {
    await apiRequest(`/shipments/${id}`, { method: "DELETE" });
    allShipments = allShipments.filter((s) => s.id !== id);
    filteredShipments = filteredShipments.filter((s) => s.id !== id);
    renderPage(currentPage);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

/* ================= SEARCH ================= */
searchInput?.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  filteredShipments = allShipments.filter(
    (s) =>
      s.tracking_id?.toLowerCase().includes(value) ||
      s.customer_name?.toLowerCase().includes(value) ||
      s.route?.toLowerCase().includes(value)
  );
  currentPage = 1;
  renderPage(currentPage);
});

/* ================= PAGINATION ================= */
function renderPagination() {
  const pageCount = Math.ceil(filteredShipments.length / rowsPerPage);
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-btn");
    if (i === currentPage) btn.classList.add("active-page");
    btn.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
    };
    paginationContainer.appendChild(btn);
  }
}
