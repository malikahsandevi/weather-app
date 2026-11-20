// Weather App — modern v13 design
// Live data from WeatherAPI.com; the page theme follows the actual sky
// (condition + day/night), and all values come from the API response.
//
// NOTE: this is a free-tier WeatherAPI key used in a client-side app.
// Keep it restricted to this app's domain in the WeatherAPI dashboard.
const CONFIG = {
  apiKey: "eeb541fd91aa460ab32152001250304",
  apiBase: "https://api.weatherapi.com/v1/current.json",
  defaultCity: "Rahim Yar Khan",
};

const state = { data: null, unit: "C" };

const $ = (id) => document.getElementById(id);
const els = {
  form: $("searchForm"),
  input: $("cityInput"),
  btn: $("searchBtn"),
  error: $("errorBanner"),
  card: $("weatherCard"),
  cityName: $("cityName"),
  localTime: $("localTime"),
  icon: $("conditionIcon"),
  temp: $("tempValue"),
  tempUnit: $("tempUnit"),
  condition: $("conditionText"),
  feels: $("feelsLike"),
  dayNight: $("dayNightPill"),
  updated: $("lastUpdated"),
  windSpeed: $("windSpeed"),
  windGust: $("windGust"),
  windArrow: $("windArrow"),
  windDir: $("windDir"),
  windDegree: $("windDegree"),
  humidity: $("humidity"),
  humidityMeter: $("humidityMeter"),
  visibility: $("visibility"),
  visibilityNote: $("visibilityNote"),
  uv: $("uvIndex"),
  uvDot: $("uvDot"),
  uvLevel: $("uvLevel"),
  pressure: $("pressure"),
  precip: $("precip"),
};

/* ---------------- theme ---------------- */
// WeatherAPI condition codes grouped into sky themes.
const THEME_CODES = {
  clear: [1000],
  cloudy: [1003, 1006, 1009],
  fog: [1030, 1135, 1147],
  rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246],
  snow: [1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264],
  storm: [1087, 1273, 1276, 1279, 1282],
};

function themeFor(code, isDay) {
  for (const [theme, codes] of Object.entries(THEME_CODES)) {
    if (codes.includes(code)) {
      if (theme === "clear") return isDay ? "theme-clear-day" : "theme-clear-night";
      if (theme === "cloudy") return isDay ? "theme-cloudy-day" : "theme-cloudy-night";
      return "theme-" + theme;
    }
  }
  return isDay ? "theme-cloudy-day" : "theme-cloudy-night";
}

/* ---------------- helpers ---------------- */
function formatLocalTime(localtime) {
  // "2026-11-20 15:53" -> "Friday, 20 Nov · 3:53 PM"
  const [datePart, timePart] = localtime.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.toLocaleDateString("en-GB", { weekday: "long" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${day}, ${d} ${month} · ${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function formatClock(datetime) {
  const time = datetime.split(" ")[1];
  const [hh, mm] = time.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function uvInfo(uv) {
  if (uv < 3) return { level: "Low", cls: "" };
  if (uv < 6) return { level: "Moderate", cls: "uv-moderate" };
  if (uv < 8) return { level: "High", cls: "uv-high" };
  if (uv < 11) return { level: "Very high", cls: "uv-very-high" };
  return { level: "Extreme", cls: "uv-extreme" };
}

function visibilityNote(km) {
  if (km >= 20) return "Crystal clear view";
  if (km >= 10) return "Clear view";
  if (km >= 5) return "Moderate visibility";
  if (km >= 1) return "Poor visibility";
  return "Very poor — drive carefully";
}

function tempIn(unitValue) {
  // unitValue is an object { c, f } from the API response.
  return state.unit === "C" ? Math.round(unitValue.c) : Math.round(unitValue.f);
}

/* ---------------- render ---------------- */
function render() {
  const data = state.data;
  if (!data) return;
  const { location, current } = data;

  document.body.className = themeFor(current.condition.code, current.is_day === 1);

  els.cityName.textContent = `${location.name}, ${location.country}`;
  els.localTime.textContent = formatLocalTime(location.localtime);
  els.icon.src = "https:" + current.condition.icon.replace("64x64", "128x128");
  els.icon.alt = current.condition.text;

  els.temp.textContent = tempIn({ c: current.temp_c, f: current.temp_f });
  els.tempUnit.textContent = state.unit === "C" ? "°C" : "°F";
  els.condition.textContent = current.condition.text;
  els.feels.textContent = tempIn({ c: current.feelslike_c, f: current.feelslike_f }) + (state.unit === "C" ? "°C" : "°F");
  els.dayNight.textContent = current.is_day === 1 ? "☀️ Daytime" : "🌙 Nighttime";
  els.updated.textContent = "Last updated " + formatClock(current.last_updated) + " (local time)";

  els.windSpeed.textContent = Math.round(current.wind_kph);
  els.windGust.textContent = Math.round(current.gust_kph);
  els.windDir.textContent = current.wind_dir;
  els.windDegree.textContent = current.wind_degree;
  // Arrow points where the wind blows TO (➤ starts pointing east).
  els.windArrow.style.transform = `rotate(${current.wind_degree + 90}deg)`;

  els.humidity.textContent = current.humidity;
  els.humidityMeter.style.width = current.humidity + "%";

  els.visibility.textContent = current.vis_km;
  els.visibilityNote.textContent = visibilityNote(current.vis_km);

  const uv = uvInfo(current.uv);
  els.uv.textContent = current.uv;
  els.uvLevel.textContent = uv.level;
  els.uvDot.className = "uv-dot" + (uv.cls ? " " + uv.cls : "");

  els.pressure.textContent = Math.round(current.pressure_mb);
  els.precip.textContent = current.precip_mm;
}

/* ---------------- search ---------------- */
function showError(message) {
  els.error.textContent = message;
  els.error.hidden = false;
}

function hideError() {
  els.error.hidden = true;
}

function setLoading(loading) {
  els.card.classList.toggle("is-loading", loading);
  els.btn.disabled = loading;
  els.btn.textContent = loading ? "Searching…" : "Search";
}

async function search(city) {
  const place = (city ?? els.input.value).trim();
  if (!place) {
    showError("Please type a city name first.");
    return;
  }
  hideError();
  setLoading(true);
  try {
    const url = `${CONFIG.apiBase}?key=${CONFIG.apiKey}&q=${encodeURIComponent(place)}&aqi=no`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      showError(
        data.error.message === "No matching location found."
          ? `No place found for “${place}”. Check the spelling and try again.`
          : data.error.message
      );
      return;
    }
    state.data = data;
    els.input.value = "";
    render();
  } catch (err) {
    console.error(err);
    showError("Network error — please check your connection and try again.");
  } finally {
    setLoading(false);
  }
}

/* ---------------- events ---------------- */
els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  search();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => search(chip.dataset.city));
});

document.querySelectorAll(".unit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.unit = btn.dataset.unit;
    document
      .querySelectorAll(".unit-btn")
      .forEach((b) => b.classList.toggle("is-active", b === btn));
    render();
  });
});

/* ---------------- start ---------------- */
search(CONFIG.defaultCity);
