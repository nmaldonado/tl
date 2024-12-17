require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser()); // Usa cookie-parser para manejar cookies

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const storedUsername = process.env.ADMIN_USERNAME;
  const storedPassword = process.env.ADMIN_PASSWORD;

  if (username === storedUsername && password === storedPassword) {
    res.status(200).send('Login exitoso');

    res.cookie('auth_token', 'some_unique_token', { 
      httpOnly: true, 
      maxAge: 4 * 60 * 60 * 1000,  // 4 horas en milisegundos
      secure: false,  // Solo en producción con HTTPS
    });

  } else {
    res.status(401).send('Credenciales incorrectas');
  }
});

// Ruta de logout
app.post('/logout', (req, res) => {
  res.clearCookie('auth_token');  // Eliminar la cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});

module.exports = router;