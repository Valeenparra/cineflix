document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded funciona");
  

//Codigo para salir de la sesion al apretar el icono
  const userIcon = document.getElementById("logout");
  userIcon.addEventListener("click", logout);

  async function logout() {
    try {
      const response = await fetch("/logout", {
        method: "POST"
      });

      if (response.ok) {
        window.location.href = "/login"; // Redirige a la página de inicio de sesión
      } else {
        console.error("Error al cerrar sesión:", response.status);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
});


//botones para pasar de pagina
let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
    if(pagina < 1000){
        pagina += 1;
        cargarPeliculas();
    }
})
btnAnterior.addEventListener('click', () => {
    if(pagina > 1){
        pagina -= 1;
        cargarPeliculas();
    }
})

//peliculas api
const cargarPeliculas = async() => {
    
try {
    const respuesta =  await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=ef58448505468ce466166e5b3cccd861&language=es-ES&page=${pagina}`);
    console.log(respuesta);

//si la respuesta es correcta
    if(respuesta.status === 200){
        const datos = await respuesta.json();
        
        let peliculas = '';
        datos.results.forEach(pelicula => {
            peliculas += `
                <div class="pelicula">
                <br>
                <br>
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                <h1>${pelicula.title}<h1/>
                <br>
                <button class="guardar-button">Guardar</button></div>
            `;
        });

        document.getElementById('contenedor').innerHTML = peliculas;

    }else if(respuesta.status === 401){
        console.log('pusiste la llave mal');
    }else if(respuesta.status === 404){
        console.log('la pelicula no existe');
    }

    }catch(error){
    console.log(error);
}
   
}

cargarPeliculas();


//popup
const contenedor = document.getElementById("contenedor");
contenedor.addEventListener("click", (event) => {
  if (event.target.classList.contains("guardar-button")) {
    mostrarPopup();
  }
});

function mostrarPopup() {
  const popup = document.getElementById("popup");
  popup.innerHTML = `
   <div class="popup-form">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" placeholder="Ingrese su nombre" required>
            <label for="pelicula">Película:</label>
            <input type="text" id="pelicula" name="pelicula" placeholder="Ingrese el nombre de la película" required>
            <button id="guardarForm">Guardar</button>
        </div>
    `;
  popup.style.display = "block";

  // Agregar evento al botón "Guardar" del formulario emergente
  const guardarFormButton = document.getElementById("guardarForm");
  guardarFormButton.addEventListener("click", guardarFormulario);
}

function ocultarPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

function guardarFormulario() {
  const nombre = document.getElementById("nombre").value;
  const pelicula = document.getElementById("pelicula").value;
  const formData = {
    nombre: nombre,
    pelicula: pelicula
  };

  fetch("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (response.ok) {
        // Datos guardados exitosamente
        console.log("Datos guardados correctamente");
      } else {
        console.error("Error al guardar los datos:", response.status);
      }
      ocultarPopup();
    })
    .catch(error => {
      console.error("Error al guardar los datos:", error);
      ocultarPopup();
    });
}