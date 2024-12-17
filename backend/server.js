// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loginRoute = require('./routes/login'); // Importa la ruta de login
const cookieParser = require('cookie-parser');


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
