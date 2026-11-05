const form = document.querySelector("#share-form");
const phoneInput = document.querySelector("#phone");
const phoneError = document.querySelector("#phone-error");
const regionResult = document.querySelector("#region-result");
const regionName = document.querySelector("#region-name");
const regionCaveat = document.querySelector("#region-caveat");
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

const callingRegions = {
  "1": "North American Numbering Plan (shared by the US, Canada, and other territories)",
  "7": "Russia and Kazakhstan numbering region",
  "20": "Egypt", "27": "South Africa", "30": "Greece", "31": "Netherlands",
  "32": "Belgium", "33": "France", "34": "Spain", "36": "Hungary",
  "39": "Italy and Vatican City", "40": "Romania", "41": "Switzerland",
  "43": "Austria", "44": "United Kingdom and Crown Dependencies", "45": "Denmark",
  "46": "Sweden", "47": "Norway", "48": "Poland", "49": "Germany",
  "51": "Peru", "52": "Mexico", "53": "Cuba", "54": "Argentina", "55": "Brazil",
  "56": "Chile", "57": "Colombia", "58": "Venezuela", "60": "Malaysia",
  "61": "Australia and external territories", "62": "Indonesia", "63": "Philippines",
  "64": "New Zealand", "65": "Singapore", "66": "Thailand", "81": "Japan",
  "82": "South Korea", "84": "Vietnam", "86": "China", "90": "Turkey",
  "91": "India", "92": "Pakistan", "93": "Afghanistan", "94": "Sri Lanka",
  "95": "Myanmar", "98": "Iran",
  "211": "South Sudan", "212": "Morocco", "213": "Algeria", "216": "Tunisia",
  "218": "Libya", "220": "Gambia", "221": "Senegal", "222": "Mauritania",
  "223": "Mali", "224": "Guinea", "225": "Cote d'Ivoire", "226": "Burkina Faso",
  "227": "Niger", "228": "Togo", "229": "Benin", "230": "Mauritius",
  "231": "Liberia", "232": "Sierra Leone", "233": "Ghana", "234": "Nigeria",
  "235": "Chad", "236": "Central African Republic", "237": "Cameroon",
  "238": "Cabo Verde", "239": "Sao Tome and Principe", "240": "Equatorial Guinea",
  "241": "Gabon", "242": "Republic of the Congo",
  "243": "Democratic Republic of the Congo", "244": "Angola",
  "245": "Guinea-Bissau", "246": "British Indian Ocean Territory", "247": "Ascension Island",
  "248": "Seychelles", "249": "Sudan", "250": "Rwanda", "251": "Ethiopia",
  "252": "Somalia", "253": "Djibouti", "254": "Kenya", "255": "Tanzania",
  "256": "Uganda", "257": "Burundi", "258": "Mozambique", "260": "Zambia",
  "261": "Madagascar", "262": "Reunion and Mayotte", "263": "Zimbabwe",
  "264": "Namibia", "265": "Malawi", "266": "Lesotho", "267": "Botswana",
  "268": "Eswatini", "269": "Comoros", "290": "Saint Helena and Tristan da Cunha",
  "291": "Eritrea", "297": "Aruba", "298": "Faroe Islands", "299": "Greenland",
  "350": "Gibraltar", "351": "Portugal", "352": "Luxembourg", "353": "Ireland",
  "354": "Iceland", "355": "Albania", "356": "Malta", "357": "Cyprus",
  "358": "Finland and Aland Islands", "359": "Bulgaria", "370": "Lithuania",
  "371": "Latvia", "372": "Estonia", "373": "Moldova", "374": "Armenia",
  "375": "Belarus", "376": "Andorra", "377": "Monaco", "378": "San Marino",
  "380": "Ukraine", "381": "Serbia", "382": "Montenegro", "383": "Kosovo",
  "385": "Croatia", "386": "Slovenia", "387": "Bosnia and Herzegovina",
  "389": "North Macedonia", "420": "Czechia", "421": "Slovakia",
  "423": "Liechtenstein", "500": "Falkland Islands", "501": "Belize",
  "502": "Guatemala", "503": "El Salvador", "504": "Honduras", "505": "Nicaragua",
  "506": "Costa Rica", "507": "Panama", "508": "Saint Pierre and Miquelon",
  "509": "Haiti", "590": "Guadeloupe, Saint Barthelemy, and Saint Martin",
  "591": "Bolivia", "592": "Guyana", "593": "Ecuador", "594": "French Guiana",
  "595": "Paraguay", "596": "Martinique", "597": "Suriname", "598": "Uruguay",
  "599": "Curacao and Caribbean Netherlands",
  "670": "Timor-Leste", "672": "Australian external territories", "673": "Brunei",
  "674": "Nauru", "675": "Papua New Guinea", "676": "Tonga",
  "677": "Solomon Islands", "678": "Vanuatu", "679": "Fiji", "680": "Palau",
  "681": "Wallis and Futuna", "682": "Cook Islands", "683": "Niue",
  "685": "Samoa", "686": "Kiribati", "687": "New Caledonia", "688": "Tuvalu",
  "689": "French Polynesia", "690": "Tokelau", "691": "Micronesia",
  "692": "Marshall Islands", "850": "North Korea", "852": "Hong Kong",
  "853": "Macau", "855": "Cambodia", "856": "Laos", "880": "Bangladesh",
  "886": "Taiwan", "960": "Maldives", "961": "Lebanon", "962": "Jordan",
  "963": "Syria", "964": "Iraq", "965": "Kuwait", "966": "Saudi Arabia",
  "967": "Yemen", "968": "Oman", "970": "Palestine",
  "971": "United Arab Emirates", "972": "Israel", "973": "Bahrain", "974": "Qatar",
  "975": "Bhutan", "976": "Mongolia", "977": "Nepal", "992": "Tajikistan",
  "993": "Turkmenistan", "994": "Azerbaijan", "995": "Georgia",
  "996": "Kyrgyzstan", "998": "Uzbekistan"
};
const callingCodes = Object.keys(callingRegions).sort((a, b) => b.length - a.length);

function getInternationalNumber(number) {
  let normalized = number.trim().replace(/[\s().-]/g, "");
  if (normalized.startsWith("00")) normalized = `+${normalized.slice(2)}`;
  if (!normalized.startsWith("+") || !/^\+\d+$/.test(normalized)) return null;

  const digits = normalized.slice(1);
  if (digits.length < 7 || digits.length > 15) return null;
  const callingCode = callingCodes.find((code) => digits.startsWith(code));
  if (!callingCode) return null;

  return { callingCode, region: callingRegions[callingCode] };
}

function updateRegionResult() {
  const number = getInternationalNumber(phoneInput.value);
  regionResult.hidden = !number;
  if (!number) return;

  regionName.textContent = number.region;
  regionCaveat.textContent = `Calling code +${number.callingCode}. This is not a live location and may not identify the subscriber's country.`;
}

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
  buttonLabel.textContent = "Share my live location";
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
  updateRegionResult();
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
      buttonLabel.textContent = "Share my live location";
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

  if (!getInternationalNumber(phoneInput.value)) {
    phoneInput.setAttribute("aria-invalid", "true");
    phoneError.textContent = "Enter an international number with + and a supported country calling code (7–15 digits total).";
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
  updateRegionResult();
});

consentInput.addEventListener("change", () => {
  if (consentInput.checked) phoneError.textContent = "";
});

stopButton.addEventListener("click", stopSharing);
