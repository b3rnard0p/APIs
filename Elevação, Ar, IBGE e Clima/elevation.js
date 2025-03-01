function fetchElevation(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  elevationService.getElevationForLocations(
    {
      locations: [location],
    },
    (results, status) => {
      if (status === google.maps.ElevationStatus.OK) {
        if (results[0]) {
          const elevation = results[0].elevation;
          document.getElementById("elevation-result").innerHTML = `
                      <h3>Elevação: ${elevation.toFixed(2)} metros</h3>
                  `;
        } else {
          document.getElementById("elevation-result").innerHTML =
            "Não foi possível obter a elevação.";
        }
      } else {
        document.getElementById("elevation-result").innerHTML =
          "Erro ao buscar elevação.";
      }
    }
  );
}
