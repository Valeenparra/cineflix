const { MongoClient } = require("mongodb");

const connectionString = "mongodb+srv://apitest:RJ6w4XKmYJb5BwCc@apitest.qsbyhnm.mongodb.net/";

const client = new MongoClient(connectionString);

let db; // Variable para almacenar la referencia a la base de datos

async function connect() {
  try {
    const conn = await client.connect(); // Esperamos a que se establezca la conexión
    db = conn.db("Cineflix"); // referencia al nombre a la base de datos
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error; // Lanza el error para que pueda ser capturado en server.js
  }
}

async function getDB() {
  if (!db) {
    await connect();
  }
  return db;
}

module.exports = getDB; // Exporta la función getDB en lugar de la variable db
