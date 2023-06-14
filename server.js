const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const { initialize, checkAuthenticated } = require('./auth.js');
const db = require('./db.js');
const getDB = require('./db.js');
const setupSwagger = require('./swagger.js');

class BaazarBackend {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));

    initialize(app); // Utilizamos el método initialize de auth.js

//swagger

  /**
 * @swagger
 * /login:
 *   get:
 *     summary: Página de inicio de sesión
 *     responses:
 *       200:
 *         description: Devuelve la página HTML de inicio de sesión.
 */

    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

     /**
 * @swagger
 * /auth/google/:
 *   get:
 *     summary: Autenticación de Google
 *     responses:
 *       200:
 *         description: Inicia el proceso de autenticación con Google y solicita acceso al perfil de usuario y dirección de correo electrónico.
 */

    app.get('/auth/google/', passport.authenticate('google', {
      scope: ['email', 'profile']
    }));

          /**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback de autenticación de Google
 *     responses:
 *       200:
 *         description: Maneja el callback de autenticación de Google y redirige al usuario a la página de inicio de sesión exitosa o fallida.
 */

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/login/success',
      failureRedirect: '/login/failure'
    }));

        /**
 * @swagger
 * /login/success:
 *   get:
 *     summary: Redirección después de inicio de sesión exitoso
 *     responses:
 *       200:
 *         description: Redirige al usuario a la página index.html después de un inicio de sesión exitoso.
 */

    app.get('/login/success', (req, res) => {
        res.redirect('/home.html');        // Redirige a index.html en caso de éxito
    });

     /**
 * @swagger
 * /login/failure:
 *   get:
 *     summary: Inicio de sesión fallido
 *     responses:
 *       200:
 *         description: Devuelve un mensaje de error indicando que el inicio de sesión ha fallado.
 */

    app.get('/login/failure', (req, res) => {
      res.send('Inicio de sesión fallido');
    });

      /**
 * @swagger
 * /:
 *   get:
 *     summary: Página de inicio
 *     responses:
 *       200:
 *         description: Devuelve la página de inicio. 
 */

    app.get('/', this._goHome);

       /**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cierre de sesión
 *     responses:
 *       200:
 *         description:  Cierra la sesión del usuario y redirige a la página de inicio de sesión.
 */

    app.post("/logout", (req, res) => {
      req.logOut(err => console.log(err));
      res.redirect("/login");
    });

         /**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cierre de sesión
 *     responses:
 *       200:
 *         description: Cierra la sesión del usuario y redirige a la página de inicio de sesión.
 */
    
    //Salir de la sesion
        app.post("/logout", (req, res) => {
          req.logOut();
          res.redirect("/login");
        });

          /**
 * @swagger
 * /save:
 *   post:
 *     summary: Guardar información
 *     responses:
 *       200:
 *         description: Guarda la información proporcionada en el cuerpo de la solicitud.
 */
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
        setupSwagger(app);
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