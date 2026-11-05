# Find-Location

A consent-first location-sharing web prototype. A mobile number cannot reveal a person's location: this demo only requests location from the device owner after they choose to share it.

## Run locally

Open `index.html` in a browser, or serve this directory from `localhost`. Browser geolocation requires a secure context, such as HTTPS or localhost, and the user must grant location permission.

## Prototype scope

- The user enters their own mobile number and explicitly starts sharing.
- Location is requested through the browser's Geolocation API only after consent.
- Sharing can be stopped at any time.
- This prototype does not verify phone numbers, send SMS, upload or save location, or let another person look someone up. The form's phone number is for demonstration only. A production multi-user service would need verified identities, explicit sharing invitations, secure backend storage and access controls, and clear retention controls.
