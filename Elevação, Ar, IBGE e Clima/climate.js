async function getWeatherData(lat, lng) {
  const apiKey = "Sua Chave";
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}&aqi=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados climáticos");
    }
    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error);
    document.getElementById("weather-result").innerHTML =
      "Erro ao buscar dados climáticos.";
  }
}

function displayWeatherData(data) {
  const weatherResult = document.getElementById("weather-result");
  if (data.error) {
    weatherResult.innerHTML = `<p>Erro: ${data.error.message}</p>`;
    return;
  }

  const location = data.location;
  const current = data.current;

  weatherResult.innerHTML = `
<h3>Dados Climáticos</h3>
<p><strong>Localização:</strong> ${location.name}, ${location.region}, ${location.country}</p>
<p><strong>Temperatura:</strong> ${current.temp_c}°C (${current.temp_f}°F)</p>
<p><strong>Sensação Térmica:</strong> ${current.feelslike_c}°C (${current.feelslike_f}°F)</p>
<p><strong>Condição:</strong> ${current.condition.text}</p>
<p><strong>Vento:</strong> ${current.wind_kph} km/h, direção ${current.wind_dir}</p>
<p><strong>Umidade:</strong> ${current.humidity}%</p>
<p><strong>Precipitação:</strong> ${current.precip_mm} mm</p>
<p><strong>UV:</strong> ${current.uv}</p>
<p><strong>Visibilidade:</strong> ${current.vis_km} km</p>
`;
}
