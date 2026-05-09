import { apiRequest, pollData } from "./api.js";

const params = new URLSearchParams(window.location.search);
const quoteId = params.get("id");

if (!quoteId) {
  alert("No quote selected.");
  throw new Error("Missing quote ID");
}

const liveIndicator = document.getElementById("liveIndicator");
const form = document.getElementById("quoteForm");
let isUpdating = false;

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

pollData(
  () => apiRequest(`/quotes/${quoteId}`),
  (data) => {
    if (isUpdating) return;

    // Customer details
    setValue("customerName", data.full_name);
    setValue("customerEmail", data.email);
    setValue("customerPhone", data.phone);
    setValue("shipmentType", data.shipment_type);
    setValue("origin", data.pickup_location);
    setValue("destination", data.delivery_location);
    setValue("cargo", data.cargo);

    // Questionnaire
    setValue("packingResponsibility", data.packing_responsibility);
    setValue("materialsNeeded", data.materials_needed);
    setValue("furnitureDisassembly", data.furniture_disassembly);
    setValue("fragileItems", data.fragile_items);
    setValue("floorLevels", data.floor_levels);
    setValue("elevator", data.elevator);
    setValue("parking", data.parking);
    setValue("walkingDistance", data.walking_distance);
    setValue("accessIssues", data.access_issues);
    setValue("onSiteSupervisor", data.on_site_supervisor);
    setValue("extraHelp", data.extra_help);
    setValue("applianceHelp", data.appliance_help);
    setValue("boxCount", data.box_count);
    setValue("bulkyItems", data.bulky_items);
    setValue("timing", data.timing);
    setValue("storage", data.storage);

    // Admin pricing fields
    setValue("base_price", data.base_price);
    setValue("vat_amount", data.vat);
    setValue("total_amount", data.total);
    setValue("estimatedTime", data.estimated_time);
    setValue("notes", data.notes);

    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.value = data.status || "pending";

    if (liveIndicator) liveIndicator.innerHTML = `<i class="fas fa-circle"></i> Live`;
  },
  5000
);

document.getElementById("base_price")?.addEventListener("input", () => {
  const base = parseFloat(document.getElementById("base_price").value) || 0;
  const vat = base * 0.2;
  const total = base + vat;
  setValue("vat_amount", vat.toFixed(2));
  setValue("total_amount", total.toFixed(2));
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  isUpdating = true;
  if (liveIndicator) liveIndicator.innerHTML = `<i class="fas fa-sync-alt fa-spin"></i> Updating...`;

  try {
    await apiRequest(`/quotes/${quoteId}`, {
      method: "PATCH",
      body: JSON.stringify({
        basePrice: parseFloat(document.getElementById("base_price")?.value) || 0,
        vat: parseFloat(document.getElementById("vat_amount")?.value) || 0,
        total: parseFloat(document.getElementById("total_amount")?.value) || 0,
        status: document.getElementById("status")?.value,
        estimatedTime: document.getElementById("estimatedTime")?.value,
        notes: document.getElementById("notes")?.value
      })
    });
    if (liveIndicator) liveIndicator.innerHTML = `<i class="fas fa-check-circle"></i> Saved`;
  } catch (error) {
    console.error(error);
    if (liveIndicator) liveIndicator.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error`;
  }

  isUpdating = false;
});

document.getElementById("downloadInvoice")?.addEventListener("click", () => {
  window.open(`/api/dashboard/invoice/${quoteId}`, "_blank");
});