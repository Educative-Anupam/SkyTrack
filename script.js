

// function getWeather() {
//   const city = document.getElementById("cityInput").value;
//   const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

//   fetch(url)
//     .then(response => {
//       if (!response.ok) throw new Error("City not found");
//       return response.json();
//     })
//     .then(data => {
//       const airQuality = data.current.air_quality.pm2_5;
//       const resultDiv = document.getElementById("weatherResult");
//        resultDiv.innerHTML = `
//    <h2 class="city-name">${data.location.name}, ${data.location.country}</h2>
//    <img src="https:${data.current.condition.icon}" alt="Weather Icon" />
//    <h2 class="temperature">🌡️ ${data.current.temp_c}°C</h2>
//    <h2><strong>${data.current.condition.text}</strong></h2>
  
//    <p class="humidity">💧 Humidity: ${data.current.humidity}%</p>
//    <p class="wind">🌬️ Wind: ${data.current.wind_kph} km/h</p>
//    <p class="air-quality">🫁 Air Quality: ${data.current.air_quality.pm2_5.toFixed(2)}</p>

//  `;

//     })
//     .catch(error => {
//       document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
//     });
// }


const apiKey = "8fbbe720dfb240ba94e143600251005";
function getWeather(auto = false) {
  if (auto && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(`${lat},${lon}`);
    }, () => {
      alert("Location access denied. Please enter city manually.");
    });
  } else {
    const city = document.getElementById("cityInput").value;
    if (city) {
      fetchWeatherData(city);
    }
  }
}

function fetchWeatherData(query) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3&aqi=yes`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      
      const resultDiv = document.getElementById("weatherResult");
      resultDiv.innerHTML = `
        <h2 class="city-name">${data.location.name}, ${data.location.country}</h2>
        <img src="https:${data.current.condition.icon}" alt="Weather Icon" />
        <h2><strong>${data.current.condition.text}</strong></h2>
        <h2 class="temperature">🌡️ ${data.current.temp_c}°C</h2>
        <p class="humidity">💧 Humidity: ${data.current.humidity}%</p>
        <p class="wind">🌬️ Wind: ${data.current.wind_kph} kph</p>
        <p class="air-quality">🫁 Air Quality: ${data.current.air_quality.pm2_5.toFixed(2)}</p>
       <p>🌅 Sunrise: ${data.forecast.forecastday[0].astro.sunrise}</p>
       <p>🌇 Sunset: ${data.forecast.forecastday[0].astro.sunset}</p>

      `;
      document.querySelector(".forecast-section").style.display = "block";
      document.body.classList.toggle('night-theme', !data.current.is_day);

      setWeatherVideo(data.current.condition.text, data.current.is_day);
      
      const forecastContainer = document.getElementById("forecastContainer");
      forecastContainer.innerHTML = ""; 

      data.forecast.forecastday.slice(0,3).forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        forecastContainer.innerHTML += `
          <div class="forecast-day">
            <div><strong>${dayName}</strong></div>
            <img src="https:${day.day.condition.icon}" alt="Weather Icon">
            <div>${day.day.avgtemp_c}°C</div>
            <small>${day.day.condition.text}</small>
          </div>
        `;
      });
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}
// const saveBtn = document.getElementById("saveCityBtn");
// const favoritesList = document.getElementById("favoriteCitiesList");

// // Load favorites from localStorage
// let favoriteCities = JSON.parse(localStorage.getItem("favoriteCities")) || [];
// renderFavorites();

// saveBtn.addEventListener("click", () => {
//   const city = document.getElementById("cityInput").value.trim();
//   if (city && !favoriteCities.includes(city)) {
//     favoriteCities.push(city);
//     localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
//     renderFavorites();
//   }
// });

// function renderFavorites() {
//   favoritesList.innerHTML = "";
//   favoriteCities.forEach(city => {
//     const li = document.createElement("li");
//     li.textContent = city;
//     li.style.cursor = "pointer";
//     li.addEventListener("click", () => {
//       fetchWeatherData(city);
//     });
//     favoritesList.appendChild(li);
//   });
// }


// function setWeatherVideo(conditionText) {
//   const video = document.getElementById("bg-video");
//   if (!video) return;

//   let src = "videos/default.mp4";
//   const condition = conditionText.toLowerCase();

//   if (condition.includes("sun")) src = "videos/sunny.mp4";
//   else if (condition.includes("cloud")) src = "videos/cloudy.mp4";
//   else if (condition.includes("rain")) src = "videos/rainy.mp4";
//   else if (condition.includes("snow")) src = "videos/snow.mp4";
//   else if(condition.includes("mist")) src="videos/mist.mp4";
//   video.querySelector("source").src = src;
//   video.load();
//<p>🌅 Sunrise: ${data.forecast.forecastday[0].astro.sunrise}</p>
    //    <p>🌇 Sunset: ${data.forecast.forecastday[0].astro.sunset}</p>
// }
function setWeatherVideo(conditionText, isDay) {
  const video = document.getElementById("bg-video");
  if (!video) return;

  const condition = conditionText.toLowerCase();
  const time = isDay ? "day" : "night";

  let src = `videos/default-${time}.mp4`;

  if (condition.includes("sun")) src = `videos/sunny-${time}.mp4`;
  else if (condition.includes("cloud")) src = `videos/cloudy-${time}.mp4`;
  else if (condition.includes("rain")) src = `videos/rainy-${time}.mp4`;
  else if (condition.includes("snow")) src = `videos/snow-${time}.mp4`;
  else if (condition.includes("mist")) src = `videos/mist-${time}.mp4`;
  video.querySelector("source").src = src;
  video.load();
}

window.onload = () => {
  getWeather(true);
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(error => console.error("❌ Service Worker Registration Failed:", error));
}