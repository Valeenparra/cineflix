const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const { initialize, checkAuthenticated } = require('./auth.js');
const db = require('./db.js');
const getDB = require('./db.js');

class BaazarBackend {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));

    initialize(app); // Utilizamos el método initialize de auth.js

//swagger



    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    app.get('/auth/google/', passport.authenticate('google', {
      scope: ['email', 'profile']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/login/success',
      failureRedirect: '/login/failure'
    }));

    app.get('/login/success', (req, res) => {
        res.redirect('/home.html');        // Redirige a index.html en caso de éxito
    });

    app.get('/login/failure', (req, res) => {
      res.send('Inicio de sesión fallido');
    });

    app.get('/', this._goHome);

    app.post("/logout", (req, res) => {
      req.logOut(err => console.log(err));
      res.redirect("/login");
    });
    
    //Salir de la sesion
        app.post("/logout", (req, res) => {
          req.logOut();
          res.redirect("/login");
        });

// Guardar pelicula
app.post("/save", async (req, res) => {
  const { nombre, pelicula } = req.body;

  try {
    const db = await getDB(); // Espera a que la conexión a la base de datos se establezca
    const collection = db.collection("Peliculas");

    // Guardar los datos en la base de datos
    await collection.insertOne({ nombre: nombre, pelicula: pelicula });

    console.log("Datos guardados correctamente en la base de datos");
    res.status(200).json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar los datos en la base de datos:", error);
    res.status(500).json({ message: "Error al guardar los datos" });
  }
});

        app.listen(3000, () => console.log('CORRIENDO en http://localhost:3000'));
      }

  _goHome(req, res) {
    if (req.isAuthenticated()) {
      res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } else {
      res.redirect('/login');
    }
  }
}

new BaazarBackend();
