// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
  origin: 'http://localhost:3000', // Ajustar según la URL del frontend
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ---------- RUTAS DE LOGIN ----------
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const storedUsername = process.env.ADMIN_USERNAME;
  const storedPassword = process.env.ADMIN_PASSWORD;

  if (username === storedUsername && password === storedPassword) {
    res.cookie('auth_token', 'some_unique_token', { 
      httpOnly: true, 
      maxAge: 4 * 60 * 60 * 1000, // 4 horas
      secure: false,
    });
    res.status(200).send('Login exitoso');
  } else {
    res.status(401).send('Credenciales incorrectas');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Logged out successfully' });
});

// ---------- RUTA PARA DEVOLVER CSV COMO JSON ----------
app.get('/csv/:filename', (req, res) => {
  const fileName = req.params.filename; // ej: "17_12_2024.csv"
  const filePath = path.join(__dirname, '..', 'updates_productos_csv', fileName);
  console.log('Buscando archivo en:', filePath);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log('Datos parseados:', result.data);
        res.json(result.data);
      },
      error: (parseError) => {
        console.error('Error al parsear el CSV:', parseError);
        res.status(500).json({ error: 'Error al procesar el archivo CSV' });
      }
    });
  });
});

// Iniciar el servidor una sola vez
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
