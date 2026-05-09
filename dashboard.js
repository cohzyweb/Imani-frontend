// dashboard.js - Admin dashboard (replaces Firebase onSnapshot)
import { apiRequest, pollData } from "./api.js";

const totalShipmentsEl = document.getElementById("totalShipments");
const pendingQuotesEl = document.getElementById("pendingQuotes");
const activeCustomersEl = document.getElementById("activeCustomers");
const monthlyRevenueEl = document.getElementById("monthlyRevenue");
const recentQuotesBody = document.getElementById("recentQuotesBody");

/* ================= POLLING STATS ================= */
pollData(
  () => apiRequest("/dashboard/stats"),
  (stats) => {
    if (totalShipmentsEl) totalShipmentsEl.textContent = stats.totalShipments;
    if (pendingQuotesEl) pendingQuotesEl.textContent = stats.pendingQuotes;
    if (activeCustomersEl) activeCustomersEl.textContent = stats.activeCustomers;
    if (monthlyRevenueEl)
      monthlyRevenueEl.textContent = "£" + Number(stats.monthlyRevenue).toLocaleString();

    if (recentQuotesBody) {
      recentQuotesBody.innerHTML = "";

      (stats.recentQuotes || []).forEach((data) => {
        const row = `
          <tr>
            <td>
              ${data.full_name || "-"} <br>
              <small>${data.email || "-"}</small>
            </td>
            <td>${data.pickup_location || "-"} → ${data.delivery_location || "-"}</td>
            <td>${data.shipment_type || "-"}</td>
            <td>
              <span class="badge pending">
                ${data.status || "Pending"}
              </span>
            </td>
            <td>
              <a href="review-quotes.html?id=${data.id}" class="btn btn-primary">
                Review
              </a>
            </td>
          </tr>
        `;
        recentQuotesBody.innerHTML += row;
      });
    }
  },
  8000
);
