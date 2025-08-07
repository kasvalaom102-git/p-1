// Constants
const API_KEY = "55bd2eaa51d3feff5d8ea9e3c83f441f";
const DEFAULT_CITY = "Surat";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Utility
const formatDateTime = () => {
  const now = new Date();
  return {
    dayName: DAYS[now.getDay()],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  };
};

const formatTime = unix => new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Section 3 - City Cards
function loadSection3Weather(cities) {
  const cards = document.querySelectorAll(".sec3-card");

  cities.forEach((city, index) => {
    if (!cards[index]) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        const card = cards[index];
        const { dayName } = formatDateTime();
        const rain = data.rain ? (data.rain["1h"] || data.rain["3h"] || 0) : 0;

        card.querySelector(".city").textContent = data.name;
        card.querySelector(".temp").textContent = `${data.main.temp.toFixed(1)}°C`;
        card.querySelector(".day-name").textContent = dayName;
        card.querySelector(".desc").textContent = data.weather[0].description;
        card.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        card.querySelector(".rain").textContent = `${rain}%`;
        card.querySelector(".wind").textContent = `${data.wind.speed} Km/h`;
      })
      .catch(err => console.error(`Weather error for ${city}:`, err));
  });
}

// Section 4 - Today's Details
function loadSection4Weather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const { dayName, time, date } = formatDateTime();
      const rain = data.rain ? (data.rain["1h"] || data.rain["3h"] || 0) : 0;

      document.getElementById("sec4-city").textContent = data.name;
      document.getElementById("sec4-day").textContent = `${dayName}, ${date}`;
      document.getElementById("sec4-time").textContent = `Update As Of ${time}`;
      ["sec4-wind-1", "sec4-wind-2"].forEach(id => document.getElementById(id).textContent = `Wind ${data.wind.speed} km/h`);
      ["sec4-rain-1", "sec4-rain-2"].forEach(id => document.getElementById(id).textContent = `Rain ${rain}%`);
      document.getElementById("sec4-temp").textContent = `${data.main.temp.toFixed(0)}°C`;
      document.getElementById("sec4-range").textContent = `${data.main.temp_min.toFixed(0)}°C - ${data.main.temp_max.toFixed(0)}°C`;
    })
    .catch(err => console.error("Section 4 Weather Error:", err));
}

// Section 5 - 4 Day Forecast
function loadSection5Forecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const sec5cards = document.getElementById("sec5cards");
      sec5cards.innerHTML = "";

      const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 4);
      dailyData.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const dayName = SHORT_DAYS[date.getDay()];
        const cardHTML = `
          <div class="sec5card">
            <img class="img1sec5" src="../assets/img${(index % 3) + 1}sec5.png" alt="">
            <span class="sec5sp1">${dayName}</span>
            <span class="sec5sp2">12:00PM</span>
            <span class="sec5sp3">${Math.round(item.main.temp_min)}℃</span>
            <span class="sec5sp4">${Math.round(item.main.temp_max)}℃</span>
            <img class="sec4we" src="../assets/sec4wether.svg" alt="wind icon">
            <span class="sec5sp5">${Math.round(item.wind.speed)}Km/h</span>
            <img class="sec5sun" src="../assets/sec4sun.svg" alt="sun icon">
            <span class="sec5sp6">${item.main.humidity}%</span>
            <span class="sec5sp7">${item.weather[0].main}</span>
          </div>`;
        sec5cards.innerHTML += cardHTML;
      });
    })
    .catch(err => {
      console.error("Forecast API Error:", err);
      document.getElementById("sec5cards").innerHTML = '<p>Could not load weather data.</p>';
    });
}

// Mini Temps
function loadMiniTemps(cityData) {
  cityData.forEach(({ name, tempId }) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        document.getElementById(tempId).textContent = `${data.main.temp.toFixed(1)}℃`;
      })
      .catch(err => console.error(`Mini temp error for ${name}:`, err));
  });
}

// Section 7 - Forecast Cards
function loadHourlyForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const current = data.list[0];
      const rainPercent = current.pop ? Math.round(current.pop * 100) : 0;

      document.getElementById("currentTemp").innerHTML = `${Math.round(current.main.temp)}°C <span class="fw-normal fs-4">${Math.round(current.main.feels_like)}°C</span>`;
      ["windSpeed1", "windSpeed2"].forEach(id => document.getElementById(id).textContent = Math.round(current.wind.speed));
      ["rainPercent1", "rainPercent2"].forEach(id => document.getElementById(id).textContent = rainPercent);

      const sunrise = 1691386920, sunset = 1691433360;
      document.getElementById("sunriseTime").textContent = formatTime(sunrise);
      document.getElementById("sunsetTime").textContent = formatTime(sunset);

      const forecastCards = document.getElementById("forecastCards");
      forecastCards.innerHTML = "";

      const icons = ["sec4wether.svg", "ba+sun.svg", "ba+cha.svg", "ba.svg"];
      data.list.slice(0, 5).forEach((item, index) => {
        const icon = icons[index % icons.length];
        const card = `
          <div class="d-flex flex-column align-items-center gap-2 text-center forecast-card">
            <img src="../assets/${icon}" alt="${item.weather[0].main}" width="32">
            <div>${Math.round(item.main.temp)}°C</div>
            <div>${formatTime(item.dt)}</div>
            <div class="small">${item.weather[0].main}</div>
          </div>`;
        forecastCards.innerHTML += card;
      });

      const forecastImages = forecastCards.querySelectorAll("img");
      if (forecastImages.length) {
        forecastImages[0].style.filter = "invert(1)";
        forecastImages[forecastImages.length - 1].style.filter = "invert(1)";
      }
    })
    .catch(err => console.error("Hourly Forecast Error:", err));
}

// Init
function initWeatherApp() {
  loadSection3Weather(["Surat", "Surat"]);
  loadSection4Weather(DEFAULT_CITY);
  loadSection5Forecast(DEFAULT_CITY);
  loadMiniTemps([
    { name: "Surat", tempId: "temp1" },
    { name: "Surat", tempId: "temp2" }
  ]);
  loadHourlyForecast(DEFAULT_CITY);
}

document.addEventListener("DOMContentLoaded", initWeatherApp);