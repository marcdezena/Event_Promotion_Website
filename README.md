# EventSpark

EventSpark is a front-end event discovery and promotion prototype built with static HTML, CSS, and JavaScript. It is designed to show the user flows for organizers, attendees, and administrators in a simple event platform.

## System overview

EventSpark is a static multi-page system with these main views:
- `pages/login.html` — login page with sign-in / sign-up mode switching.
- `pages/signup.html` — account creation page and plan selection.
- `pages/dashboard.html` — organizer dashboard with event stats, empty state, and Create Event modal.
- `pages/discover.html` — event discovery page with filters, event cards, search bar, and event calendar.
- `pages/profile.html` — user profile and account settings page.
- `pages/settings.html` — full settings application with tabbed panels for general, notifications, security, admin access, integrations, and danger actions.
- `pages/admin.html` — admin gate, admin dashboard, event moderation table, and admin-only actions.

Shared resources:
- `css/style.css` — global and component styles.
- `js/app.js` — shared front-end logic for navigation, modals, calendar rendering, theme, and event interactions.

The current app is static, so page changes use full HTML navigation via `window.location.href`. The backend should instead provide data services and user session flows while retaining this UI structure.

## Detailed system behavior

### User roles

The system should support at least three roles:
- `organizer` — can create / manage events, view dashboard stats, and promote events.
- `attendee` — can discover events, view event details, and register/express interest.
- `admin` — can moderate, approve, reject, and remove events.

### Login / signup flow

Current front-end behavior:
- `pages/login.html` toggles between sign-in and sign-up in one UI.
- sign in and sign up are mock screen states; no backend exists yet.
- social buttons and forgot password links are present but currently navigate to dashboard.

Backend requirements:
- `POST /api/auth/signup` should create a user record and return a JWT or session token.
- `POST /api/auth/login` should validate credentials and return auth details.
- `GET /api/auth/me` should return the currently authenticated user.
- `POST /api/auth/logout` should clear the session or token.

### Dashboard page

`pages/dashboard.html` is the organizer home:
- top stats: total events, attendees, active/live events, promotion days.
- empty state when no events exist.
- Create Event modal allows event submission.

Required backend features:
- event creation endpoint
- event count and metrics for the organizer
- event status and empty state management

### Discover page

`pages/discover.html` shows public events:
- search bar and topbar tabs (`All`, `Upcoming`, `Near Me`).
- filter chips for categories: `All`, `Design`, `Music`, `Social`, `Tech`, `Sports`, `Food`.
- event cards with category badge, title, date/time, location, host, and attendance.
- calendar widget with highlighted event dates and a side panel for chosen day events.
- event detail modal for card click.

Required backend features:
- list events with category, location, date/time, organizer, and attendance data
- support filtering by category, `upcoming`, and `near me`
- support full-text search for event title / organizer / location
- calendar endpoint or data structure to paint event days
- event detail endpoint for modal display

### Profile page

`pages/profile.html` is the user account page:
- profile header with avatar, name, email
- stats for events created and attended
- account settings toggles and appearance controls
- edit profile modal for personal info changes
- sign out button

Backend requirements:
- user profile endpoint
- update profile endpoint
- persist notification, language, theme, and other settings
- secure logout action

### Settings page

`pages/settings.html` contains detailed user settings:
- general account information and appearance
- notification preferences
- security actions, password updates, and active sessions
- admin access panel that links to admin page
- integrations panel for Google Calendar, Stripe, Zapier, Slack
- danger zone for export, deactivate, and delete account

Backend requirements:
- user settings endpoint(s)
- password change endpoint
- admin availability and permissions endpoint
- integrations state management
- account deletion and export endpoints

### Admin page

`pages/admin.html` is the admin moderation screen:
- admin gate unlocking the dashboard
- moderation stats: pending, approved, users, removed
- event table with approve/reject/remove actions
- add event button opens the shared promote modal

Backend requirements:
- admin authorization checks
- endpoints for fetching events pending moderation
- approve / reject / delete actions
- analytics/stats endpoint

### Promote modal

The promote modal is now consistent across pages. It should allow event submission with fields:
- title
- type
- date/time
- location
- cover image URL
- Facebook URL
- ticket URL
- description
- terms agreement checkbox

Backend should persist these event details and return status.

### Event detail modal

The event detail modal should show the selected event's:
- title
- category
- organizer
- date/time
- location
- admission type
- description

Backend should provide full event metadata for this modal.

## Data models for backend developers

### User model

Fields:
- `id`
- `firstName`
- `lastName`
- `email`
- `passwordHash`
- `role` (`organizer`, `attendee`, `admin`)
- `organization` or `teamName`
- `bio`
- `avatarInitials`
- `memberSince`
- `themePreference` (`light`, `dark`)
- `notifications` object:
  - `newBookings`
  - `eventReminders`
  - `weeklyDigest`
  - `marketingEmails`
  - `pushBrowser`
  - `smsReminders`
- `settings` object:
  - `language`
  - `timezone`
  - `emailDigest`
  - `accountType`
- `activeSessions` array

### Event model

Fields:
- `id`
- `title`
- `description`
- `type` (`Conference`, `Workshop`, `Networking`, `Concert`, `Sports`, `Other`)
- `category` (`Design`, `Music`, `Social`, `Tech`, `Food`, `Sports`)
- `dateTime`
- `endDateTime`
- `location`
- `venue`
- `coverImageUrl`
- `facebookUrl`
- `ticketUrl`
- `organizerId`
- `organizerName`
- `status` (`pending`, `approved`, `rejected`)
- `attendeeCount`
- `isLive`
- `createdAt`
- `updatedAt`
- `city`
- `geoLocation` (for `Near Me` filtering)
- `admissionType`

### Admin / moderation model

If needed, use an audit or moderation log:
- `adminActionId`
- `eventId`
- `adminId`
- `action` (`approve`, `reject`, `remove`)
- `reason`
- `timestamp`

## Backend API contract

### Authentication

#### `POST /api/auth/signup`
Request body:
```json
{
  "firstName": "Mario",
  "lastName": "Derama",
  "email": "mario@eventspark.io",
  "password": "securepassword",
  "role": "organizer"
}
```
Response:
```json
{
  "user": { "id": "...", "email": "mario@eventspark.io", "role": "organizer" },
  "token": "jwt-token"
}
```

#### `POST /api/auth/login`
Request body:
```json
{ "email": "mario@eventspark.io", "password": "securepassword" }
```
Response:
```json
{ "token": "jwt-token", "user": { "id": "...", "role": "organizer" } }
```

#### `GET /api/auth/me`
Response:
```json
{
  "id": "...",
  "email": "mario@eventspark.io",
  "firstName": "Mario",
  "lastName": "Derama",
  "role": "organizer",
  "settings": { ... }
}
```

### Events

#### `GET /api/events`
Supports query parameters:
- `category`
- `status` (`approved`, `pending`, `rejected`)
- `search`
- `dateFrom`
- `dateTo`
- `nearMe`

Response:
```json
[{
  "id": "...",
  "title": "Design Leadership Summit 2026",
  "category": "Design",
  "type": "Conference",
  "dateTime": "2026-10-12T13:00:00.000Z",
  "location": "Innovate Center, San Francisco",
  "organizerName": "Design Leadership Network",
  "attendeeCount": 124,
  "status": "approved",
  "coverImageUrl": "..."
}]
```

#### `GET /api/events/:id`
Response includes full event details for the detail modal.

#### `POST /api/events`
Request body should match the event model and set `status: pending` by default.

#### `PUT /api/events/:id`
Update event data by owner or admin.

#### `DELETE /api/events/:id`
Remove an event.

### User/Profile

#### `GET /api/users/me`
Returns profile and preference data.

#### `PUT /api/users/me`
Update personal information.

#### `PUT /api/users/me/password`
Change password.

#### `PUT /api/users/me/settings`
Update notification and appearance preferences.

### Admin

#### `GET /api/admin/events`
Return moderation list and admin event table.

#### `PUT /api/admin/events/:id/approve`
Mark event approved.

#### `PUT /api/admin/events/:id/reject`
Mark event rejected.

#### `DELETE /api/admin/events/:id`
Remove event from the platform.

#### `GET /api/admin/stats`
Return counts for pending/approved/users/removed.

## Front-end integration guidelines

### Shared event fields
Use the following field names consistently across the UI:
- `title`
- `type`
- `category`
- `description`
- `dateTime`
- `location`
- `coverImageUrl`
- `facebookUrl`
- `ticketUrl`
- `organizerId`
- `status`
- `attendeeCount`
- `admissionType`

### Search and filter
The discover page UI has this behavior:
- filter chips set `category`
- topbar tabs can set `filter=upcoming` or `filter=nearMe`
- search bar should send `search` query text to the backend
- calendar selection should show events for the selected day

### Event detail modal
When the user clicks an event card or calendar-day event, the frontend should request full event details and display:
- event title
- category label
- organizer name
- date/time
- location
- admission description
- full event description

### Admin flow
Admin pages should only load for `admin` role users.
- `pages/admin.html` is the moderation UI
- approval updates event status
- rejection updates event status and may send a reason
- removing an event deletes it from the public list

## Recommended backend setup

1. create `server/` folder.
2. initialize Node and install dependencies.
3. define models for `User`, `Event`, and optionally `ModerationLog`.
4. build routes with authentication and authorization.
5. add data validation and error handling.
6. connect the front-end forms and event listing to the API.

## Suggested folder structure

```
server/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
  package.json
  .env
```

## Notes for backend developers

- This front-end is a prototype; the backend should provide data and state.
- The current UI assumes `event.status` can be `pending`, `approved`, or `rejected`.
- The dashboard and profile pages need persisted user settings.
- The discover page needs event listing and filtering by category, date, and location.
- The admin page needs protected routes and approval workflows.

---

