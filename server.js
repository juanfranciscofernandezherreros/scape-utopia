const express = require('express');
const path = require('path');
const app = express();

// Toma el puerto que Heroku nos da (Variable de entorno PORT)
const port = process.env.PORT || 8080;

// Sirve los archivos estáticos de la carpeta 'dist' (donde Vite construye la app)
app.use(express.static(path.join(__dirname, 'dist')));

// Para cualquier otra ruta, devuelve el index.html (necesario para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
