# Find-Location

A consent-first location-sharing web prototype. A phone number cannot reveal a person's current location. This demo can estimate a numbering region from an international calling code, and requests live location only from the device owner after they choose to share it.

## Run locally

Open `index.html` in a browser, or serve this directory from `localhost`. Browser geolocation requires a secure context, such as HTTPS or localhost, and the user must grant location permission.

## Prototype scope

- A number entered in international format shows an approximate region locally, without uploading it.
- The user must confirm they are sharing their own device's location and grant browser permission before live coordinates are shown.
- International numbers should include `+` and the country calling code. The displayed region is an estimate from that code, not a verified subscriber location; number portability and shared calling codes can make it inaccurate.
- Location is requested through the browser's Geolocation API only after consent.
- Sharing can be stopped at any time.
- This prototype does not verify phone numbers, send SMS, upload or save location, or let another person look someone up. The form's phone number is for demonstration only. A production multi-user service would need verified identities, explicit sharing invitations, secure backend storage and access controls, and clear retention controls.
