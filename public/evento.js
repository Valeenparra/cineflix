document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded funciona");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const eventResults = document.getElementById("event-results");

  searchBtn.addEventListener("click", () => {
    const searchQuery = searchInput.value;
    searchEvents(searchQuery);
  });

  async function searchEvents(query) {
    try {
   
      const response = await fetch("/search-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

     
      if (response.ok) {
        const events = await response.json();

        // Limpiar los resultados anteriores
        eventResults.innerHTML = "";

        events.forEach((event) => {
          const eventCard = createEventCard(event);
          eventResults.appendChild(eventCard);
        });
      } else {
        console.error("Error al buscar eventos:", response.status);
      }
    } catch (error) {
      console.error("Error al buscar eventos:", error);
    }
  }

  function createEventCard(event) {
    const eventCard = document.createElement("div");
    eventCard.className = "event-card";

    const eventImage = document.createElement("img");
    eventImage.src = event.imagen; // Actualiza la propiedad 'photo' a 'imagen'
    eventCard.appendChild(eventImage);

    const eventName = document.createElement("h3");
    eventName.textContent = event.nombre; // Actualiza la propiedad 'name' a 'nombre'
    eventCard.appendChild(eventName);

    const eventLocation = document.createElement("p");
    eventLocation.textContent = event.ubicacion; // Actualiza la propiedad 'location' a 'ubicacion'
    eventCard.appendChild(eventLocation);

    const eventDate = document.createElement("p");
    eventDate.textContent = event.fecha; // Actualiza la propiedad 'date' a 'fecha'
    eventCard.appendChild(eventDate);

    return eventCard;
  }

  const userIcon = document.getElementById("user-icon");
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