const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const { initialize, checkAuthenticated } = require('./auth.js');
const db = require('./db.js');




class BaazarBackend {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));

    initialize(app); // Aca hacemos referencia al método initialize de auth.js

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
        res.redirect('/index.html');        // Redirige a index.html en caso de éxito
    });

    app.get('/login/failure', (req, res) => {
      res.send('Inicio de sesión fallido');
    });

    app.get('/', this._goHome);

    app.post("/logout", (req, res) => {
      req.logOut(err => console.log(err));
      res.redirect("/login");

    app.post("/logout", (req, res) => {
      req.logOut();
      res.redirect("/login");
    });

    });


    //Parte del código en la que se especifica en traer el evento
    app.post("/search-events", async (req, res) => {
      const { query } = req.body;
    
      try {
       console.log("hola")
        const events = await db
        .collection("Event")
        .find({ nombre: { $regex: query, $options: "i" } })
        .toArray();

        res.json(events);
      } catch (error) {
        console.error("Error al buscar eventos en la base de datos:", error);
        res.status(500).json({ message: "Error al buscar eventos" });
      }
    });
    


    app.listen(3000, () => console.log('CORRIENDO en http://localhost:3000'));
  }



  _goHome(req, res) {
    if (req.isAuthenticated()) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
      res.redirect('/login');
    }
  }
}

new BaazarBackend();
