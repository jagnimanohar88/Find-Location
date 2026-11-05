const form = document.querySelector("#share-form");
const phoneInput = document.querySelector("#phone");
const phoneError = document.querySelector("#phone-error");
const consentInput = document.querySelector("#consent");
const shareButton = document.querySelector("#share-button");
const buttonLabel = shareButton.querySelector(".button-label");
const locationResult = document.querySelector("#location-result");
const locationDetails = document.querySelector("#location-details");
const updatedAt = document.querySelector("#updated-at");
const locationError = document.querySelector("#location-error");
const statusPill = document.querySelector("#status-pill");
const statusText = document.querySelector("#status-text");
const stopButton = document.querySelector("#stop-button");

let watchId = null;
let sessionActive = false;

function setSharingStatus(isSharing) {
  statusPill.classList.toggle("is-active", isSharing);
  statusText.textContent = isSharing ? "Session active" : "Not sharing";
  locationResult.hidden = !isSharing;
  form.hidden = isSharing;
}

function showError(message) {
  locationError.textContent = message;
  locationError.hidden = false;
  locationResult.hidden = true;
  form.hidden = false;
  setSharingStatus(false);
  shareButton.disabled = false;
  buttonLabel.textContent = "Share my location";
}

function formatCoordinates(position) {
  const { latitude, longitude, accuracy } = position.coords;
  locationDetails.textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)} · accuracy ±${Math.round(accuracy)} m`;
  updatedAt.textContent = `Updated ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(position.timestamp)}`;
}

function stopSharing() {
  sessionActive = false;
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  setSharingStatus(false);
  locationError.hidden = true;
  locationDetails.textContent = "Sharing has ended.";
  updatedAt.textContent = "";
  consentInput.checked = false;
  phoneInput.value = "";
}

function startSharing() {
  if (!("geolocation" in navigator)) {
    showError("Location access is not available in this browser. Try a current browser on HTTPS or localhost.");
    return;
  }

  sessionActive = true;
  locationError.hidden = true;
  locationDetails.textContent = "Requesting your permission…";
  updatedAt.textContent = "";
  setSharingStatus(true);
  shareButton.disabled = true;
  buttonLabel.textContent = "Waiting for permission…";

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (!sessionActive) return;
      formatCoordinates(position);
      shareButton.disabled = false;
      buttonLabel.textContent = "Share my location";
    },
    (error) => {
      if (!sessionActive) return;
      const messages = {
        1: "Location permission was denied. Allow location access in your browser settings if you want to share.",
        2: "Your location could not be determined. Check your device's location settings and try again.",
        3: "The location request timed out. Check your connection and try again."
      };
      sessionActive = false;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      showError(messages[error.code] || "We couldn't access your location. Please try again.");
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  phoneError.textContent = "";
  phoneInput.removeAttribute("aria-invalid");

  const digits = phoneInput.value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    phoneInput.setAttribute("aria-invalid", "true");
    phoneError.textContent = "Enter a valid phone number (7–15 digits).";
    phoneInput.focus();
    return;
  }

  if (!consentInput.checked) {
    phoneError.textContent = "Confirm that you're sharing your own location to continue.";
    consentInput.focus();
    return;
  }

  startSharing();
});

phoneInput.addEventListener("input", () => {
  phoneError.textContent = "";
  phoneInput.removeAttribute("aria-invalid");
});

consentInput.addEventListener("change", () => {
  if (consentInput.checked) phoneError.textContent = "";
});

stopButton.addEventListener("click", stopSharing);
