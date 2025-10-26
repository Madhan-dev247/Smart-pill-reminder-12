const medName = document.getElementById("medName");
const dosage = document.getElementById("dosage");
const time = document.getElementById("time");
const addBtn = document.getElementById("addBtn");
const voiceBtn = document.getElementById("voiceBtn");
const reminderList = document.getElementById("reminderList");
const historyList = document.getElementById("historyList");
const takenList = document.getElementById("takenList");
const medList = document.getElementById("medicines");
const alarmSound = document.getElementById("alarmSound");

// Preload Medicines
const preload = [
  "Paracetamol", "Dolo 650", "Azithromycin", "Cetirizine", "Cough Syrup",
  "Amoxicillin", "Vitamin C", "B-Complex", "Crocin", "Ibuprofen", "Metformin",
  "Pantoprazole", "Omeprazole", "Zincovit", "Losartan", "Amlodipine",
  "Prednisolone", "Insulin", "Aspirin", "Clopidogrel", "Levothyroxine",
  "Atorvastatin", "Dexamethasone", "Calcium Tablet", "Iron Supplement"
];

preload.forEach(med => {
  const opt = document.createElement("option");
  opt.value = med;
  medList.appendChild(opt);
});

// Add Reminder
addBtn.addEventListener("click", () => {
  const name = medName.value.trim();
  const dose = dosage.value.trim();
  const t = time.value;

  if (!name || !t) return alert("Please fill all fields!");

  const item = { name, dose, t };
  addToList(item);
  scheduleReminder(item);

  historyList.innerHTML += `<li>${name} - ${dose} at ${t}</li>`;
  medName.value = dosage.value = time.value = "";
});

function addToList(item) {
  const li = document.createElement("li");
  li.textContent = `${item.name} (${item.dose}) at ${item.t}`;
  reminderList.appendChild(li);
}

function scheduleReminder(item) {
  const now = new Date();
  const [hours, minutes] = item.t.split(":").map(Number);
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);
  if (reminderTime < now) reminderTime.setDate(reminderTime.getDate() + 1);

  const delay = reminderTime - now;
  setTimeout(() => {
    showNotification(item.name, item.dose);
  }, delay);
}

function showNotification(name, dose) {
  if (Notification.permission === "granted") {
    new Notification("💊 Pill Care Reminder", {
      body: `${name} - ${dose}`,
      icon: "icon-192.png"
    });
  } else {
    Notification.requestPermission();
  }
  alarmSound.play();
}

// Voice Input
voiceBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice not supported");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = (e) => {
    const speech = e.results[0][0].transcript;
    medName.value = speech;
  };
});

// Navigation
const navBtns = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    navBtns.forEach((b) => b.classList.remove("active"));
    pages.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  })
);

// Request notification permission
if ("Notification" in window) Notification.requestPermission();
