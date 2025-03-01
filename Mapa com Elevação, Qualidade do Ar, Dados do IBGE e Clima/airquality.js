// Função para consultar a qualidade do ar para uma coordenada
async function getAirQuality(lat, lng) {
  const apiKey = "AIzaSyBDeLlEa_PZ0mJ2DivU0uYAjoWKvYhBPgM";
  const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: { latitude: lat, longitude: lng },
    }),
  });

  const data = await response.json();

  const aqi = data.indexes[0].aqi;
  const category = data.indexes[0].category || "";
  const pollutant = data.indexes[0].dominantPollutant || "";

  // Tradução das categorias de qualidade do ar
  const categoryTranslations = {
    "Good air quality": "Boa qualidade do ar",
    "Moderate air quality": "Qualidade do ar moderada",
    "Unhealthy for Sensitive Groups": "Não saudável para grupos sensíveis",
    "Unhealthy air quality": "Qualidade do ar não saudável",
    "Very unhealthy air quality": "Qualidade do ar muito não saudável",
    "Hazardous air quality": "Qualidade do ar perigosa",
  };

  // Tradução dos principais poluentes
  const pollutantTranslations = {
    pm25: "Material Particulado Fino (PM2.5)",
    pm10: "Material Particulado Grosso (PM10)",
    o3: "Ozônio (O₃)",
    no2: "Dióxido de Nitrogênio (NO₂)",
    so2: "Dióxido de Enxofre (SO₂)",
    co: "Monóxido de Carbono (CO)",
  };

  // Aplicar tradução correta ou manter original se não encontrado
  const translatedCategory = categoryTranslations[category] || "Desconhecido";
  const translatedPollutant = pollutantTranslations[pollutant] || pollutant;

  let resultClass = "";
  if (category.toLowerCase().includes("good")) {
    resultClass = "good";
  } else if (category.toLowerCase().includes("moderate")) {
    resultClass = "moderate";
  } else if (category.toLowerCase().includes("unhealthy")) {
    resultClass = "unhealthy";
  } else if (category.toLowerCase().includes("hazardous")) {
    resultClass = "very-unhealthy";
  }

  document.getElementById("air-quality-result").innerHTML = `
          <div class="result ${resultClass}">
              <h3>Qualidade do Ar: ${translatedCategory}</h3>
              <p><strong>AQI Universal:</strong> ${aqi}</p>
              <p><strong>Poluente Dominante:</strong> ${translatedPollutant}</p>
          </div>
      `;
}
