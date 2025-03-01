function checkLocationAndFetchIBGEData(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  geocoder.geocode({ location: location }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        const addressComponents = results[0].address_components;
        const country = addressComponents.find((component) =>
          component.types.includes("country")
        );

        if (country && country.short_name === "BR") {
          const municipio = addressComponents.find((component) =>
            component.types.includes("administrative_area_level_2")
          );

          if (municipio) {
            const nomeMunicipio = municipio.long_name;
            fetchIBGEData(nomeMunicipio);
          } else {
            document.getElementById("ibge-result").innerHTML =
              "Município não encontrado.";
          }
        } else {
          document.getElementById("ibge-result").innerHTML =
            "Localização fora do Brasil.";
        }
      } else {
        document.getElementById("ibge-result").innerHTML =
          "Localização não encontrada.";
      }
    } else {
      document.getElementById("ibge-result").innerHTML =
        "Erro ao buscar localização.";
    }
  });
}

async function fetchIBGEData(nomeMunicipio) {
  try {
    const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`;
    const responseMunicipios = await fetch(urlMunicipios);

    if (!responseMunicipios.ok) {
      throw new Error("Erro ao buscar municípios no IBGE.");
    }

    const municipios = await responseMunicipios.json();

    const municipio = municipios.find(
      (m) => m.nome.toLowerCase() === nomeMunicipio.toLowerCase()
    );

    if (municipio) {
      const codMunicipio = municipio.id;

      const dados = await Promise.all([
        getInformacoesMunicipio(codMunicipio, 29171),
        getInformacoesMunicipio(codMunicipio, 47001),
        getInformacoesMunicipio(codMunicipio, 30255),
      ]);

      const populacao = dados[0]?.[0]?.res?.[0]?.res?.["2021"] || "N/A";
      const pib = dados[1]?.[0]?.res?.[0]?.res?.["2021"] || "N/A";
      const idh = dados[2]?.[0]?.res?.[0]?.res?.["2010"] || "N/A";

      document.getElementById("ibge-result").innerHTML = `
          <h3>Dados do Município: ${municipio.nome}</h3>
          <p><strong>População (2021):</strong> ${populacao}</p>
          <p><strong>PIB (2021):</strong> ${pib}</p>
          <p><strong>IDH (2010):</strong> ${idh}</p>
      `;
    } else {
      document.getElementById("ibge-result").innerHTML =
        "Município não encontrado no IBGE.";
    }
  } catch (error) {
    console.error("Erro ao buscar dados do IBGE:", error);
    document.getElementById("ibge-result").innerHTML =
      "Erro ao buscar dados do IBGE. Verifique o console para mais detalhes.";
  }
}

async function getInformacoesMunicipio(codMunicipio, indicadorId) {
  const url = `https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/${indicadorId}/resultados/${codMunicipio}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do indicador ${indicadorId}.`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do município:", error);
    return null;
  }
}
