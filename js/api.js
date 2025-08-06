// WEATHER_API_KEY=55bd2eaa51d3feff5d8ea9e3c83f441f
document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "55bd2eaa51d3feff5d8ea9e3c83f441f";

    const cities = ["Surat", "surat"]; // You can replace with any two cities
    const cards = document.querySelectorAll(".sec3-card");

    cities.forEach((city, index) => {
        if (!cards[index]) return; // skip if no card exists

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then((response) => response.json())
            .then((data) => {
                const currentDay = new Date();
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const dayName = days[currentDay.getDay()];

                const card = cards[index];
                card.querySelector(".city").textContent = data.name;
                card.querySelector(".temp").textContent = `${data.main.temp.toFixed(1)}°C`;
                card.querySelector(".day-name").textContent = dayName;
                card.querySelector(".desc").textContent = data.weather[0].description;
                card.querySelector(".humidity").textContent = `${data.main.humidity}%`;

                const rain = data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0;
                card.querySelector(".rain").textContent = `${rain}%`;

                card.querySelector(".wind").textContent = `${data.wind.speed} Km/h`;
            })
            .catch((error) => {
                console.error(`Weather error for ${city}:`, error);
            });
    });
});





document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "55bd2eaa51d3feff5d8ea9e3c83f441f";
    const city = "surat";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            const now = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayName = days[now.getDay()];
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Inject data into Section 4
            document.getElementById("sec4-city").textContent = data.name;
            document.getElementById("sec4-day").textContent = `${dayName}, ${now.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric'
            })}`;
            document.getElementById("sec4-time").textContent = `Update As Of ${time}`;

            const wind = `${data.wind.speed} km/h`;
            document.getElementById("sec4-wind-1").textContent = `Wind ${wind}`;
            document.getElementById("sec4-wind-2").textContent = `Wind ${wind}`;

            const rain = data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0;
            const rainText = `Rain ${rain}%`;
            document.getElementById("sec4-rain-1").textContent = rainText;
            document.getElementById("sec4-rain-2").textContent = rainText;

            document.getElementById("sec4-temp").textContent = `${data.main.temp.toFixed(0)}°C`;
            document.getElementById("sec4-range").textContent = `${data.main.temp_min.toFixed(0)}°C - ${data.main.temp_max.toFixed(0)}°C`;
        })
        .catch((error) => {
            console.error("Section 4 Weather Error:", error);
        });
});




