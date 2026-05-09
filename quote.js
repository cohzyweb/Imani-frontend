// quote.js - Public quote form submission
import { apiRequest } from "./api.js";

const form = document.getElementById("quoteForm");
const messageBox = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

    const payload = {
      fullName: document.getElementById("fullname")?.value || "",
      email: document.getElementById("email")?.value || "",
      company: document.getElementById("company")?.value || "",
      phone: document.getElementById("phone")?.value || "",
      shipmentType: document.getElementById("service")?.value || "",
      service: document.getElementById("service")?.value || "",
      pickupLocation: document.getElementById("origin")?.value || "",
      deliveryLocation: document.getElementById("destination")?.value || "",
      weight: document.getElementById("weight")?.value || "",
      dimensions: document.getElementById("dimensions")?.value || "",
      cargo: document.getElementById("cargo")?.value || "",
      additionalServices: [],
      packingResponsibility: document.getElementById("packing")?.value || "",
      materialsNeeded: document.getElementById("materials")?.value || "",
      furnitureDisassembly: document.getElementById("furniture")?.value || "",
      fragileItems: document.getElementById("fragile")?.value || "",
      floorLevels: document.getElementById("floors")?.value || "",
      elevator: document.getElementById("elevator")?.value || "",
      parking: document.getElementById("parking")?.value || "",
      walkingDistance: document.getElementById("distance")?.value || "",
      accessIssues: document.getElementById("access")?.value || "",
      onSiteSupervisor: document.getElementById("supervisor")?.value || "",
      extraHelp: document.getElementById("help")?.value || "",
      applianceHelp: document.getElementById("appliances")?.value || "",
      boxCount: document.getElementById("boxes")?.value || "",
      bulkyItems: document.getElementById("bulky")?.value || "",
      timing: document.getElementById("timing")?.value || "",
      storage: document.getElementById("storage")?.value || ""
    };

    console.log("Submitting payload:", payload);

    try {
      await apiRequest("/quotes", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      messageBox.style.display = "block";
      messageBox.innerHTML = "✅ Quote submitted successfully! We'll respond within 2 hours.";
      messageBox.className = "form-message success";
      form.reset();

    } catch (error) {
      console.error(error);
      messageBox.style.display = "block";
      messageBox.innerHTML = "❌ Something went wrong. Please try again.";
      messageBox.className = "form-message error";
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-calculator"></i> Get My Quote`;
  });
}