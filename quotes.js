import { apiRequest, pollData } from "./api.js";

const tableBody = document.getElementById("quotesTableBody");
const searchInput = document.getElementById("searchInput");
const badge = document.getElementById("pendingBadge");

let allQuotes = [];

pollData(
  () => apiRequest("/quotes"),
  (quotes) => {
    allQuotes = quotes;
    updateBadge();
    renderTable(allQuotes);
  },
  6000
);

function updateBadge() {
  const pendingCount = allQuotes.filter((q) => q.status === "pending").length;
  if (pendingCount > 0) {
    badge.style.display = "inline-block";
    badge.textContent = pendingCount;
  } else {
    badge.style.display = "none";
  }
}

function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No quote requests found.</td></tr>`;
    return;
  }

  data.forEach((quote) => {
    const tr = document.createElement("tr");
    const formattedDate = quote.created_at
      ? new Date(quote.created_at).toLocaleDateString("en-GB")
      : "—";

    tr.innerHTML = `
      <td>
        <strong>${quote.full_name || "—"}</strong><br>
        <small>${quote.email || ""}</small>
      </td>
      <td>${quote.pickup_location || "—"} → ${quote.delivery_location || "—"}</td>
      <td>${quote.shipment_type || "—"}</td>
      <td>
        <select class="status-select" data-id="${quote.id}">
          <option value="pending" ${quote.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="quoted" ${quote.status === "quoted" ? "selected" : ""}>Quoted</option>
          <option value="approved" ${quote.status === "approved" ? "selected" : ""}>Approved</option>
          <option value="rejected" ${quote.status === "rejected" ? "selected" : ""}>Rejected</option>
          <option value="completed" ${quote.status === "completed" ? "selected" : ""}>Completed</option>
        </select>
      </td>
      <td>${formattedDate}</td>
      <td><a href="review-quotes.html?id=${quote.id}" class="view-btn">View</a></td>
    `;
    tableBody.appendChild(tr);
  });

  attachStatusListeners();
}

function attachStatusListeners() {
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", async (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      try {
        await apiRequest(`/quotes/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus })
        });
      } catch (error) {
        console.error("Status update failed:", error);
      }
    });
  });
}

searchInput?.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allQuotes.filter(
    (q) =>
      q.full_name?.toLowerCase().includes(value) ||
      q.email?.toLowerCase().includes(value) ||
      q.pickup_location?.toLowerCase().includes(value) ||
      q.delivery_location?.toLowerCase().includes(value)
  );
  renderTable(filtered);
});