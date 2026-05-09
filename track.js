// track.js - Public shipment tracking (replaces Firebase queries)
import { apiRequest, pollData } from "./api.js";

const form = document.getElementById("trackingForm");
const trackingInput = document.getElementById("trackingNumber");
const resultBox = document.getElementById("trackingResult");

const statusBadge = document.getElementById("statusBadge");
const displayTrackingId = document.getElementById("displayTrackingId");
const displayOrigin = document.getElementById("displayOrigin");
const displayDestination = document.getElementById("displayDestination");
const displayETA = document.getElementById("displayETA");
const displayTotal = document.getElementById("displayTotal");

let stopPolling = null;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const trackingNumber = trackingInput.value.trim();
  if (!trackingNumber) return;

  // Stop previous polling
  if (stopPolling) stopPolling();

  // Initial fetch to validate
  try {
    const data = await apiRequest(`/quotes/track/${trackingNumber}`);
    showResult(data);

    // Start live polling for status updates
    stopPolling = pollData(
      () => apiRequest(`/quotes/track/${trackingNumber}`),
      showResult,
      8000
    );
  } catch (error) {
    alert("Tracking number not found.");
  }
});

function showResult(data) {
  if (!resultBox) return;
  resultBox.style.display = "block";

  if (displayTrackingId) displayTrackingId.textContent = data.trackingNumber || "";
  if (displayOrigin) displayOrigin.textContent = data.pickupLocation || "-";
  if (displayDestination) displayDestination.textContent = data.deliveryLocation || "-";
  if (displayETA) displayETA.textContent = data.estimatedTime || "Pending update";
  if (displayTotal) displayTotal.textContent = data.total ? `£${Number(data.total).toFixed(2)}` : "0";

  if (statusBadge) {
    statusBadge.textContent = (data.status || "PENDING").toUpperCase();

    if (data.status === "approved") {
      statusBadge.style.background = "green";
    } else if (data.status === "rejected") {
      statusBadge.style.background = "red";
    } else {
      statusBadge.style.background = "orange";
    }
  }
}
