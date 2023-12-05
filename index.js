const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

const url = 'https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp';



const port = 3001;

app.get('/scrape', async (req, res) => {
  // Asegúrate de obtener los parámetros correctos de la solicitud
  const { tipoIdentificacion, identificacion } = req.query;

  console.log(req.query);
  
  // Utiliza la función scrapeData para obtener los datos
  try {
    const data = await scrapeData(tipoIdentificacion, identificacion);
    res.json(data);
  } catch (error) {
    res.status(500).send('Error al realizar el web scraping');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


// Función para realizar el web scraping
const scrapeData = async (tipoIdentificacion, identificacion) => {
  try {
    // Realizar la petición GET con los parámetros necesarios
    const response = await axios.get(url, {
      params: {
        ps_tipo_identificacion: tipoIdentificacion,
        ps_identificacion: identificacion
      }
    });

    // Cargar el HTML en Cheerio
    const $ = cheerio.load(response.data);

    // Extraer la información necesaria
    const nombre = $('body > table > tbody > tr:nth-child(1) > td:nth-child(1)').text();
    const puntos = $('body > table > tbody > tr:nth-child(1) > td:nth-child(3)').text();

    // Retornar los datos extraídos
    return { nombre, puntos };
  } catch (error) {
    console.error('Error al realizar el web scraping:', error);
  }
};
