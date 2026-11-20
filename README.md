# Campus Life Super App

A multi-page web app that brings everyday campus life into one place: live weather, upcoming events, the dining hall menu and student clubs.

**Live site:** https://adriansvfc.github.io/campus-life-super-app/

> Status: **MVP (Unit 11)**. Core pages, layout and interactivity are working; more API features and polish are planned for the final version.

## Features

| Page | What it does |
|------|--------------|
| **Home** (`index.html`) | Greeting that changes with the time of day, live campus weather from the Open-Meteo API (with a Refresh button), quick-access cards and a preview of the next event. |
| **Events** (`events.html`) | Event cards generated from JavaScript data, category filter buttons (Sports, Academic, Social, Faith) and RSVP buttons with a running counter. |
| **Dining** (`dining.html`) | Day selector that shows breakfast, lunch and dinner, an hours table and an "Open / Closed" badge based on the current time. |
| **Clubs** (`clubs.html`) | Live search through the club directory and a join form with validation and a confirmation message. |

## Technologies

- HTML5 (semantic elements, ARIA labels, skip link)
- CSS3 (custom properties, Flexbox, media queries)
- [Bootstrap 5.3](https://getbootstrap.com/) (grid, navbar, cards, forms)
- JavaScript (DOM manipulation, event listeners, event delegation, `fetch` with `async/await`)
- [Open-Meteo API](https://open-meteo.com/) for weather data (free, no key required)

## Project Structure

```
campus-life-super-app/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── logo.svg
├── index.html
├── events.html
├── dining.html
├── clubs.html
└── README.md
```

## Accessibility

- Skip-to-content link and visible focus outlines for keyboard users
- `aria-live` regions so screen readers announce weather, RSVP and form updates
- Labels on every form field, table caption and header scopes
- Respects `prefers-reduced-motion`

## How to Run Locally

1. Clone the repository: `git clone https://github.com/AdrianSVFC/campus-life-super-app.git`
2. Open the folder in VS Code.
3. Open `index.html` with the Live Server extension (or double-click it in your browser).

## Planned for the Final Version

- Load events from an external API or JSON file instead of a hard-coded array
- Save RSVPs and club requests with `localStorage`
- Add a multi-day weather forecast
- Add a campus map page
- Dark mode toggle

## Author

Adrian Perez, Computer Science student
