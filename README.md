# Weather App

A modern weather web application — search any city in the world and get its
live weather in a glassmorphism dashboard whose background follows the actual
sky. (UI redesigned from scratch in the v13 design, 2026-11-20; the previous
design is preserved in the project history.)

## Features

- Search any city (button, Enter key, or the quick city chips)
- **Dynamic sky themes** — the page background changes with the live condition
  and day/night: clear day, clear night, cloudy, rain, storm, fog and snow
- Big display temperature with a **°C / °F toggle**
- Live data: feels-like, local time at the searched place, wind speed + gusts,
  wind direction with a rotating compass arrow, humidity meter, visibility
  with a plain-language note, UV index with level indicator, pressure and
  precipitation
- Clear error messages for unknown places or network problems
- Fully responsive — two-column dashboard on desktop, stacked on mobile

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- [WeatherAPI.com](https://www.weatherapi.com/) — current weather API

## Run Locally

No build step needed. Either open `index.html` in a browser, or serve the
folder with any static server, for example:

```bash
npx serve .
```

## Live Demo

_Link will be added after deployment._

## Note on the API Key

The app calls WeatherAPI.com directly from the browser using a free-tier key
(see `CONFIG` at the top of `script.js`). For a public deployment, restrict
the key to the app's domain in the WeatherAPI dashboard.

## Author

**Ahsan Ali** — MERN Stack Developer
- Portfolio: https://ahsan-ali-protfolio.vercel.app
- GitHub: https://github.com/malikahsandevi
- LinkedIn: https://www.linkedin.com/in/ahsan-ali-468453440
