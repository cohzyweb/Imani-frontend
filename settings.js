// settings.js - Admin settings (replaces Firebase setDoc/onSnapshot)
import { apiRequest, pollData } from "./api.js";

// ================= ELEMENT REFERENCES =================
const companyName = document.getElementById("companyName");
const supportEmail = document.getElementById("supportEmail");
const contactNumber = document.getElementById("contactNumber");
const companyAddress = document.getElementById("companyAddress");

const notifyQuotes = document.getElementById("notifyQuotes");
const notifyTickets = document.getElementById("notifyTickets");
const notifySMS = document.getElementById("notifySMS");

const aiEnabled = document.getElementById("aiEnabled");
const aiTone = document.getElementById("aiTone");
const aiEscalation = document.getElementById("aiEscalation");
const aiApiKey = document.getElementById("aiApiKey");

const saveCompanyBtn = document.getElementById("saveCompanyBtn");
const saveNotificationsBtn = document.getElementById("saveNotificationsBtn");
const saveAiBtn = document.getElementById("saveAiBtn");

// ================= LOAD SETTINGS =================
pollData(
  () => apiRequest("/settings"),
  (data) => {
    if (companyName) companyName.value = data.companyName || "";
    if (supportEmail) supportEmail.value = data.supportEmail || "";
    if (contactNumber) contactNumber.value = data.contactNumber || "";
    if (companyAddress) companyAddress.value = data.companyAddress || "";

    if (notifyQuotes) notifyQuotes.checked = !!data.notifyQuotes;
    if (notifyTickets) notifyTickets.checked = !!data.notifyTickets;
    if (notifySMS) notifySMS.checked = !!data.notifySMS;

    if (aiEnabled) aiEnabled.value = data.aiEnabled || "Enabled";
    if (aiTone) aiTone.value = data.aiTone || "Professional";
    if (aiEscalation) aiEscalation.value = data.aiEscalation || "High & Angry Sentiment";
    if (aiApiKey) aiApiKey.value = data.aiApiKey || "";
  },
  30000 // Settings don't need frequent polling
);

// ================= SAVE COMPANY =================
saveCompanyBtn?.addEventListener("click", async () => {
  await apiRequest("/settings", {
    method: "PATCH",
    body: JSON.stringify({
      companyName: companyName?.value,
      supportEmail: supportEmail?.value,
      contactNumber: contactNumber?.value,
      companyAddress: companyAddress?.value
    })
  });
  alert("Company settings saved!");
});

// ================= SAVE NOTIFICATIONS =================
saveNotificationsBtn?.addEventListener("click", async () => {
  await apiRequest("/settings", {
    method: "PATCH",
    body: JSON.stringify({
      notifyQuotes: notifyQuotes?.checked,
      notifyTickets: notifyTickets?.checked,
      notifySMS: notifySMS?.checked
    })
  });
  alert("Notification settings saved!");
});

// ================= SAVE AI =================
saveAiBtn?.addEventListener("click", async () => {
  await apiRequest("/settings", {
    method: "PATCH",
    body: JSON.stringify({
      aiEnabled: aiEnabled?.value,
      aiTone: aiTone?.value,
      aiEscalation: aiEscalation?.value,
      aiApiKey: aiApiKey?.value
    })
  });
  alert("AI settings saved!");
});
