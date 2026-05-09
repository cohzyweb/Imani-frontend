// customer-service.js - Admin tickets view (replaces Firebase)
import { apiRequest, pollData } from "./api.js";

const tableBody = document.getElementById("ticketsTableBody");
const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const resolvedTickets = document.getElementById("resolvedTickets");
const aiEscalations = document.getElementById("aiEscalations");

pollData(
  () => apiRequest("/tickets"),
  (tickets) => {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    let total = 0, open = 0, resolved = 0, escalations = 0;

    tickets.forEach((data) => {
      total++;
      if (data.status === "Open") open++;
      if (data.status === "Resolved") resolved++;
      if (data.aiEscalation) escalations++;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.ticket_id || "-"}</td>
        <td>${data.customer_name || "-"}</td>
        <td>${data.subject || "-"}</td>
        <td>
          <span class="badge ${getSentimentClass(data.sentiment)}">
            ${data.sentiment || "Neutral"}
          </span>
        </td>
        <td>
          <span class="badge ${getPriorityClass(data.priority)}">
            ${data.priority || "Medium"}
          </span>
        </td>
        <td>
          <span class="badge ${getStatusClass(data.status)}">
            ${data.status || "Open"}
          </span>
        </td>
        <td>
          <button class="btn btn-primary"
            onclick="window.location='ticket-details.html?id=${data.id}'">
            View
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    if (totalTickets) totalTickets.textContent = total;
    if (openTickets) openTickets.textContent = open;
    if (resolvedTickets) resolvedTickets.textContent = resolved;
    if (aiEscalations) aiEscalations.textContent = escalations;
  },
  7000
);

function getSentimentClass(value) {
  switch ((value || "").toLowerCase()) {
    case "angry": return "delayed";
    case "neutral": return "transit";
    case "positive": return "delivered";
    default: return "transit";
  }
}

function getPriorityClass(value) {
  switch ((value || "").toLowerCase()) {
    case "high": return "delayed";
    case "medium": return "transit";
    case "low": return "delivered";
    default: return "transit";
  }
}

function getStatusClass(value) {
  switch ((value || "").toLowerCase()) {
    case "resolved": return "delivered";
    case "open": return "pending";
    default: return "pending";
  }
}
