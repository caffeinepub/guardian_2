# She Safe

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- SOS emergency alert feature: large press-and-hold button that triggers an alert saved to backend with timestamp and location
- Trusted contacts management: add/remove contacts (name + phone number)
- Live location sharing: browser Geolocation API captures coordinates and sends them to backend
- Location tracker: view a log of recorded location check-ins on a map (Leaflet.js embedded in iframe or via CDN)
- Alert history log: list of past SOS events with time and location
- Pink-themed UI matching the She Safe brand

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: store trusted contacts, SOS alerts (with timestamp + coordinates), and location check-ins per user
2. Backend: expose APIs — addContact, removeContact, getContacts, triggerSOS, getAlerts, recordLocation, getLocations
3. Frontend: pink design system, landing/home page with large SOS button
4. Frontend: Trusted Contacts page — list, add, remove
5. Frontend: Location Tracker page — record current location, view history on embedded OpenStreetMap
6. Frontend: Alert History page — list of SOS events
7. Authorization component for user identity
