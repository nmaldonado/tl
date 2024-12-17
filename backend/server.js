// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loginRoute = require('./routes/login'); // Importa la ruta de login
const cookieParser = require('cookie-parser');
const path = require('path');
const Papa = require('papaparse');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitudes solo desde el frontend
  methods: ['GET', 'POST'],        // Métodos permitidos
  credentials: true                // Habilita el uso de credenciales si es necesario
}));
app.use(express.json());


// Usar la ruta de login
app.use('/login', loginRoute); // El prefijo '/login' se agregará automáticamente
app.use(cookieParser());

app.get('/csv/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'updates_productos_csv', fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send({ error: 'Archivo no encontrado' });
    }

    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        res.setHeader('Content-Type', 'application/json');  // Establecer el encabezado correctamente
        res.json(result.data);
      },
      error: (parseError) => {
        res.status(500).send({ error: 'Error al procesar el archivo CSV' });
      }
    });
  });
});
