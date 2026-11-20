/* =========================================================
   Campus Life Super App - main script
   One file is shared by every page. Each feature first checks
   whether its HTML element exists, so it only runs on the page
   that needs it.
   ========================================================= */

/* ---------------------------------------------------------
   1. DATA
   For the MVP the events, menu and clubs are stored in arrays.
   Later they could come from an API or a JSON file.
   --------------------------------------------------------- */

// Campus location used by the weather API (Blue Mountain, Mississippi)
const CAMPUS = { name: "Blue Mountain, MS", lat: 34.67, lon: -89.03 };

// Sample events (dates are relative to today so the list never looks old)
const events = [
  { id: 1, title: "Golf Team Home Tournament", category: "sports", daysFromNow: 1, time: "8:00 AM", place: "Tippah Hills Golf Course" },
  { id: 2, title: "Chapel Service", category: "faith", daysFromNow: 2, time: "10:00 AM", place: "Chapel" },
  { id: 3, title: "Coding Study Night", category: "academic", daysFromNow: 2, time: "7:00 PM", place: "Library, Room 104" },
  { id: 4, title: "Movie Night on the Lawn", category: "social", daysFromNow: 3, time: "8:30 PM", place: "Main Lawn" },
  { id: 5, title: "Basketball vs. Rival College", category: "sports", daysFromNow: 4, time: "6:00 PM", place: "Gym" },
  { id: 6, title: "Resume Workshop", category: "academic", daysFromNow: 5, time: "3:00 PM", place: "Career Center" },
  { id: 7, title: "Student Worship Night", category: "faith", daysFromNow: 6, time: "7:30 PM", place: "Student Center" },
  { id: 8, title: "Game Night & Pizza", category: "social", daysFromNow: 7, time: "7:00 PM", place: "Student Center" }
];

// Weekly menu: one object per day with three meals
const menu = {
  monday:    { breakfast: ["Scrambled eggs", "Bacon", "Fresh fruit"], lunch: ["Chicken sandwich", "Fries", "Garden salad"], dinner: ["Spaghetti & meatballs", "Garlic bread", "Steamed broccoli"] },
  tuesday:   { breakfast: ["Pancakes", "Sausage", "Yogurt"], lunch: ["Taco bar", "Rice & beans", "Chips & salsa"], dinner: ["BBQ chicken", "Mac & cheese", "Green beans"] },
  wednesday: { breakfast: ["Biscuits & gravy", "Hash browns", "Fruit cup"], lunch: ["Burgers", "Sweet potato fries", "Coleslaw"], dinner: ["Fried catfish", "Hush puppies", "Collard greens"] },
  thursday:  { breakfast: ["Waffles", "Turkey bacon", "Oatmeal"], lunch: ["Grilled cheese", "Tomato soup", "Caesar salad"], dinner: ["Pot roast", "Mashed potatoes", "Carrots"] },
  friday:    { breakfast: ["Breakfast burritos", "Salsa", "Fresh fruit"], lunch: ["Pizza", "Wings", "Veggie tray"], dinner: ["Fish tacos", "Mexican rice", "Corn"] },
  saturday:  { breakfast: ["French toast", "Scrambled eggs", "Fruit"], lunch: ["Deli sandwiches", "Chips", "Pasta salad"], dinner: ["Fried chicken", "Corn on the cob", "Rolls"] },
  sunday:    { breakfast: ["Brunch: omelet station", "Grits", "Biscuits"], lunch: ["Brunch: omelet station", "Fruit", "Pastries"], dinner: ["Roast turkey", "Stuffing", "Green beans"] }
};

// Student clubs and organizations
const clubs = [
  { name: "Golf Club", description: "Casual rounds and lessons for every level." },
  { name: "Coding Club", description: "Build projects, practice interviews and join hackathons." },
  { name: "Business Society", description: "Guest speakers, case competitions and networking." },
  { name: "Campus Ministry", description: "Bible studies, worship and service projects." },
  { name: "Outdoor Adventure Club", description: "Hiking, camping and kayaking trips." },
  { name: "Music Ensemble", description: "Choir and band for singers and players." },
  { name: "International Students Association", description: "Culture nights and support for students from abroad." }
];

/* ---------------------------------------------------------
   2. HELPER FUNCTIONS
   --------------------------------------------------------- */

// Returns a readable date like "Fri, Nov 21" for an event X days from now
function formatEventDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// Converts Open-Meteo weather codes into text and an emoji
// Codes list: https://open-meteo.com/en/docs (WMO weather interpretation codes)
function describeWeather(code) {
  if (code === 0) return { text: "Clear sky", icon: "☀️" };
  if (code <= 3) return { text: "Partly cloudy", icon: "⛅" };
  if (code <= 48) return { text: "Fog", icon: "🌫️" };
  if (code <= 57) return { text: "Drizzle", icon: "🌦️" };
  if (code <= 67) return { text: "Rain", icon: "🌧️" };
  if (code <= 77) return { text: "Snow", icon: "❄️" };
  if (code <= 82) return { text: "Rain showers", icon: "🌧️" };
  if (code <= 86) return { text: "Snow showers", icon: "🌨️" };
  return { text: "Thunderstorm", icon: "⛈️" };
}

/* ---------------------------------------------------------
   3. SHARED FEATURES (run on every page)
   --------------------------------------------------------- */

// Put the current year in the footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   4. HOME PAGE
   --------------------------------------------------------- */

// 4a. Greeting that changes with the time of day
const greeting = document.getElementById("greeting");
if (greeting) {
  const hour = new Date().getHours();
  if (hour < 12) {
    greeting.textContent = "Good morning, campus!";
  } else if (hour < 18) {
    greeting.textContent = "Good afternoon, campus!";
  } else {
    greeting.textContent = "Good evening, campus!";
  }
}

// 4b. API INTEGRATION: live weather from Open-Meteo (free, no API key needed)
const weatherOutput = document.getElementById("weather-output");

async function loadWeather() {
  weatherOutput.innerHTML = '<p class="text-muted">Loading weather…</p>';

  // Build the request URL with the data we want
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${CAMPUS.lat}&longitude=${CAMPUS.lon}` +
    "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m" +
    "&daily=temperature_2m_max,temperature_2m_min" +
    "&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago&forecast_days=1";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();

    // Pull out the values we need from the JSON response
    const current = data.current;
    const weather = describeWeather(current.weather_code);
    const high = Math.round(data.daily.temperature_2m_max[0]);
    const low = Math.round(data.daily.temperature_2m_min[0]);

    // Render the result into the card
    weatherOutput.innerHTML = `
      <div class="d-flex align-items-center gap-3 mb-2">
        <span class="fs-1" aria-hidden="true">${weather.icon}</span>
        <span class="weather-temp">${Math.round(current.temperature_2m)}°F</span>
      </div>
      <p class="mb-1 fw-semibold">${weather.text}</p>
      <ul class="list-unstyled small text-muted mb-0">
        <li>Feels like ${Math.round(current.apparent_temperature)}°F</li>
        <li>High ${high}°F · Low ${low}°F</li>
        <li>Wind ${Math.round(current.wind_speed_10m)} mph</li>
      </ul>`;
  } catch (error) {
    // If the request fails, show a friendly message instead of breaking the page
    console.error("Weather request failed:", error);
    weatherOutput.innerHTML =
      '<p class="text-danger mb-0">Sorry, the weather could not be loaded. Please try again.</p>';
  }
}

if (weatherOutput) {
  loadWeather(); // load once when the page opens
  // Event: clicking "Refresh" requests fresh data from the API
  document.getElementById("refresh-weather").addEventListener("click", loadWeather);
}

// 4c. "Next up" preview: shows the soonest event from the events array
const nextEvent = document.getElementById("next-event");
if (nextEvent) {
  const soonest = [...events].sort((a, b) => a.daysFromNow - b.daysFromNow)[0];
  nextEvent.innerHTML = `
    <p class="fw-semibold mb-1">${soonest.title}</p>
    <p class="small text-muted mb-2">${formatEventDate(soonest.daysFromNow)} · ${soonest.time} · ${soonest.place}</p>
    <a href="events.html" class="small">See all events →</a>`;
}

/* ---------------------------------------------------------
   5. EVENTS PAGE
   --------------------------------------------------------- */
const eventList = document.getElementById("event-list");

// Keeps track of which events the user has RSVP'd to (by id)
const rsvps = new Set();

// Draws the event cards; "category" decides which events are shown
function renderEvents(category) {
  const filtered = category === "all" ? events : events.filter((e) => e.category === category);

  eventList.innerHTML = filtered
    .map((event) => {
      const going = rsvps.has(event.id);
      return `
        <div class="col-md-6 col-lg-4">
          <article class="card event-card h-100 shadow-sm" data-category="${event.category}">
            <div class="card-body d-flex flex-column">
              <span class="badge bg-light text-dark align-self-start mb-2">${event.category}</span>
              <h2 class="h5 card-title">${event.title}</h2>
              <p class="small text-muted mb-3">
                ${formatEventDate(event.daysFromNow)} · ${event.time}<br>${event.place}
              </p>
              <button type="button" class="btn ${going ? "btn-success" : "btn-outline-brand"} mt-auto rsvp-btn"
                      data-id="${event.id}" aria-pressed="${going}">
                ${going ? "✓ Going" : "RSVP"}
              </button>
            </div>
          </article>
        </div>`;
    })
    .join("");
}

if (eventList) {
  let currentCategory = "all";
  renderEvents(currentCategory);

  // Event: clicking a filter button changes which category is visible
  const filterButtons = document.querySelectorAll("#event-filters button");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentCategory = button.dataset.category;

      // Update button styles so the active filter is highlighted
      filterButtons.forEach((b) => {
        const isActive = b === button;
        b.classList.toggle("btn-brand", isActive);
        b.classList.toggle("btn-outline-brand", !isActive);
        b.setAttribute("aria-pressed", isActive);
      });

      renderEvents(currentCategory);
    });
  });

  // Event delegation: one listener on the list handles every RSVP button,
  // even the ones created later when the filter changes
  eventList.addEventListener("click", (e) => {
    const button = e.target.closest(".rsvp-btn");
    if (!button) return;

    const id = Number(button.dataset.id);
    if (rsvps.has(id)) {
      rsvps.delete(id);
    } else {
      rsvps.add(id);
    }
    document.getElementById("rsvp-count").textContent = rsvps.size;
    renderEvents(currentCategory);
  });
}

/* ---------------------------------------------------------
   6. DINING PAGE
   --------------------------------------------------------- */
const daySelect = document.getElementById("day-select");

// Shows breakfast, lunch and dinner for the chosen day
function renderMenu(day) {
  const meals = menu[day];
  const output = document.getElementById("menu-output");

  output.innerHTML = Object.entries(meals)
    .map(
      ([mealName, items]) => `
        <div class="col-md-4">
          <div class="meal-box">
            <h3 class="h6 text-capitalize">${mealName}</h3>
            <ul class="small">${items.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>`
    )
    .join("");
}

// Checks the current time against the weekday hours and updates the badge
function updateOpenStatus() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  // Opening windows in minutes since midnight [start, end]
  const hours = isWeekend
    ? [[540, 630], [690, 810], [1020, 1110]]   // 9:00-10:30, 11:30-1:30, 5:00-6:30
    : [[420, 570], [660, 810], [1020, 1140]];  // 7:00-9:30, 11:00-1:30, 5:00-7:00

  const isOpen = hours.some(([start, end]) => minutes >= start && minutes <= end);
  const badge = document.getElementById("open-status");
  badge.textContent = isOpen ? "Open" : "Closed";
  badge.className = `badge ${isOpen ? "bg-success" : "bg-danger"}`;
}

if (daySelect) {
  // Select today's day by default
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  daySelect.value = dayNames[new Date().getDay()];
  renderMenu(daySelect.value);
  updateOpenStatus();

  // Event: choosing another day re-renders the menu
  daySelect.addEventListener("change", () => renderMenu(daySelect.value));
}

/* ---------------------------------------------------------
   7. CLUBS PAGE
   --------------------------------------------------------- */
const clubList = document.getElementById("club-list");

// Shows only the clubs whose name or description contains the search text
function renderClubs(searchText) {
  const text = searchText.trim().toLowerCase();
  const matches = clubs.filter(
    (club) => club.name.toLowerCase().includes(text) || club.description.toLowerCase().includes(text)
  );

  clubList.innerHTML = matches.length
    ? matches
        .map(
          (club) => `
          <li class="list-group-item">
            <h3 class="h6 mb-1">${club.name}</h3>
            <p class="small text-muted mb-0">${club.description}</p>
          </li>`
        )
        .join("")
    : '<li class="list-group-item text-muted">No clubs match your search.</li>';

  document.getElementById("club-count").textContent = `${matches.length} club(s) found`;
}

if (clubList) {
  renderClubs("");

  // Event: filter the list on every keystroke
  document.getElementById("club-search").addEventListener("input", (e) => renderClubs(e.target.value));

  // Fill the form's dropdown with the same club names
  const clubChoice = document.getElementById("club-choice");
  clubs.forEach((club) => {
    const option = document.createElement("option");
    option.value = club.name;
    option.textContent = club.name;
    clubChoice.appendChild(option);
  });

  // Event: validate the join form when it is submitted
  const form = document.getElementById("join-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the page from reloading

    // Bootstrap shows red/green feedback when "was-validated" is added
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const name = document.getElementById("student-name").value.trim();
    const club = clubChoice.value;

    // MVP: no backend yet, so we just confirm on screen.
    // TODO (final version): send this data to a form service or API.
    // textContent (not innerHTML) is used because the name is typed by the user
    const message = document.getElementById("form-message");
    const alertBox = document.createElement("div");
    alertBox.className = "alert alert-success mb-0";
    alertBox.textContent = `Thanks, ${name}! Your request to join the ${club} was sent.`;
    message.replaceChildren(alertBox);

    form.reset();
    form.classList.remove("was-validated");
  });
}
