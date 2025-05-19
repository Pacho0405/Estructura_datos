const API = "http://localhost:5000"; // La URL de mi backend (el servidor en Python)

let rutaOptima = []; // Aquí guardo la última ruta óptima que se calculó, para poder dibujarla

// Esta función muestra mensajes de éxito o error arriba de la página
function mostrarMensaje(texto, tipo = "success") {
  const div = document.getElementById("mensaje");
  div.textContent = texto;
  div.className =
    "mb-4 p-2 rounded text-center " +
    (tipo === "success"
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300");
  // El mensaje desaparece después de 3 segundos
  setTimeout(() => {
    div.textContent = "";
    div.className = "mb-4";
  }, 3000);
}

// Limpio los campos del formulario de agregar nodo después de agregar uno
function limpiarCamposAgregarNodo() {
  document.getElementById("nombre").value = "";
  document.getElementById("lat").value = "";
  document.getElementById("lon").value = "";
}

// Pido la lista de nodos al backend (me devuelve un array de objetos)
async function fetchNodos() {
  const res = await fetch(API + "/nodos");
  return await res.json();
}

// Cuando agrego un nodo, tomo los valores del formulario y los mando al backend
async function agregarNodo() {
  const nombre = document.getElementById("nombre").value;
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  if (!nombre || !lat || !lon) {
    mostrarMensaje("Completa todos los campos.", "error");
    return;
  }
  try {
    const res = await fetch(API + "/nodo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, lat, lon }),
    });
    const data = await res.json();
    if (data.ok) {
      mostrarMensaje("Nodo agregado exitosamente.", "success");
      limpiarCamposAgregarNodo();
    } else {
      mostrarMensaje(data.error || "Error: El nodo ya existe.", "error");
    }
  } catch (e) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
  render(); // Actualizo la visualización
}

// Para editar un nodo, tomo los valores del formulario y los mando al backend
async function editarNodo() {
  const nombre = document.getElementById("nombre_edit").value;
  const nuevo_nombre = document.getElementById("nuevo_nombre").value;
  const lat = document.getElementById("lat_edit").value;
  const lon = document.getElementById("lon_edit").value;
  if (!nombre || !nuevo_nombre || !lat || !lon)
    return mostrarMensaje("Completa todos los campos.", "error");
  try {
    const res = await fetch(API + "/nodo/" + encodeURIComponent(nombre), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nuevo_nombre, lat, lon }),
    });
    const data = await res.json();
    if (!data.ok)
      mostrarMensaje(
        "Error: Nodo no encontrado o nuevo nombre ya existe.",
        "error"
      );
    else mostrarMensaje("Nodo editado exitosamente.", "success");
  } catch (e) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
  render();
}

// Para eliminar un nodo, solo necesito el nombre
async function eliminarNodo() {
  const nombre = document.getElementById("nombre_del").value;
  if (!nombre) return mostrarMensaje("Indica el nombre.", "error");
  try {
    const res = await fetch(API + "/nodo/" + encodeURIComponent(nombre), {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.ok) mostrarMensaje("Error: Nodo no encontrado.", "error");
    else mostrarMensaje("Nodo eliminado exitosamente.", "success");
  } catch (e) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
  render();
}

// Para conectar dos nodos, tomo los nombres y los mando al backend
async function conectarNodos() {
  const nodo1 = document.getElementById("nodo1").value;
  const nodo2 = document.getElementById("nodo2").value;
  if (!nodo1 || !nodo2)
    return mostrarMensaje("Completa ambos campos.", "error");
  try {
    const res = await fetch(API + "/conectar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodo1, nodo2 }),
    });
    const data = await res.json();
    if (!data.ok)
      mostrarMensaje("Error: Nodos inválidos o ya conectados.", "error");
    else mostrarMensaje("Nodos conectados exitosamente.", "success");
  } catch (e) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
  render();
}

// Para desconectar dos nodos, igual que conectar pero llamo a otra ruta
async function desconectarNodos() {
  const nodo1 = document.getElementById("nodo1").value;
  const nodo2 = document.getElementById("nodo2").value;
  if (!nodo1 || !nodo2)
    return mostrarMensaje("Completa ambos campos.", "error");
  try {
    await fetch(API + "/desconectar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodo1, nodo2 }),
    });
    mostrarMensaje("Nodos desconectados exitosamente.", "success");
  } catch (e) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
  }
  render();
}

// Para calcular la ruta más corta, mando los nombres de inicio y fin al backend
async function calcularRuta() {
  const inicio = document.getElementById("inicio").value;
  const fin = document.getElementById("fin").value;
  if (!inicio || !fin) return mostrarMensaje("Completa ambos campos.", "error");
  try {
    const res = await fetch(API + "/ruta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inicio, fin }),
    });
    const data = await res.json();
    if (!data.camino || data.camino.length === 0) {
      mostrarMensaje("No hay ruta disponible.", "error");
      rutaOptima = [];
    } else {
      mostrarMensaje(
        `Ruta: ${data.camino.join(
          " -> "
        )} | Distancia: ${data.distancia.toFixed(2)}`,
        "success"
      );
      rutaOptima = data.camino;
    }
  } catch (e) {
    mostrarMensaje("Error de conexión con el servidor.", "error");
    rutaOptima = [];
  }
  render();
}

// Esta función dibuja todo el grafo y la ruta óptima en el canvas
async function render() {
  const nodos = await fetchNodos();
  const canvas = document.getElementById("mapa");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Escalo las coordenadas para que todo quepa bien en el canvas
  if (nodos.length === 0) return;
  const lats = nodos.map((n) => n.lat);
  const lons = nodos.map((n) => n.lon);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  const minLon = Math.min(...lons),
    maxLon = Math.max(...lons);
  function escalar(lat, lon) {
    const x = 50 + (600 * (lon - minLon)) / (maxLon - minLon || 1);
    const y = 350 - (300 * (lat - minLat)) / (maxLat - minLat || 1);
    return [x, y];
  }

  // Dibujo las conexiones normales (aristas)
  nodos.forEach((nodo) => {
    const [x1, y1] = escalar(nodo.lat, nodo.lon);
    if (nodo.vecinos) {
      nodo.vecinos.forEach((vecino) => {
        const n2 = nodos.find((n) => n.nombre === vecino);
        if (n2 && nodo.nombre < n2.nombre) {
          // Solo dibujo una vez cada línea (para no repetir)
          const [x2, y2] = escalar(n2.lat, n2.lon);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "#aaa";
          ctx.lineWidth = 2;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      });
    }
  });

  // Si hay una ruta óptima, la dibujo más gruesa y de color azul violeta
  if (rutaOptima && rutaOptima.length > 1) {
    ctx.save();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#6366f1";
    ctx.shadowBlur = 12;
    for (let i = 0; i < rutaOptima.length - 1; i++) {
      const n1 = nodos.find((n) => n.nombre === rutaOptima[i]);
      const n2 = nodos.find((n) => n.nombre === rutaOptima[i + 1]);
      if (n1 && n2) {
        const [x1, y1] = escalar(n1.lat, n1.lon);
        const [x2, y2] = escalar(n2.lat, n2.lon);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Dibujo los nodos como círculos naranjas y les pongo el nombre arriba
  nodos.forEach((nodo) => {
    const [x, y] = escalar(nodo.lat, nodo.lon);
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "bold 13px Arial";
    ctx.fillText(nodo.nombre, x - 10, y - 15);
  });

  // Actualizo la lista de nodos con sus coordenadas
  const ul = document.getElementById("lista-nodos");
  ul.innerHTML = "";
  nodos.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = `${n.nombre} (${n.lat}, ${n.lon})`;
    ul.appendChild(li);
  });
}

// Este es el clásico Insertion Sort, pero hecho a mano para ordenar los nombres de los nodos
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j].toLowerCase() > key.toLowerCase()) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Cuando quiero ver los nodos ordenados alfabéticamente, uso esta función
async function mostrarNodosOrdenados() {
  const nodos = await fetchNodos();
  const nombres = nodos.map((n) => n.nombre);
  const ordenados = insertionSort([...nombres]);
  const ul = document.getElementById("lista-nodos-ordenados");
  ul.innerHTML = "";
  ordenados.forEach((nombre) => {
    const li = document.createElement("li");
    li.textContent = nombre;
    ul.appendChild(li);
  });
}

// Esta función limpia todos los campos, mensajes, listas y el canvas (como si reiniciara la página)
function limpiarTodo() {
  // Limpio todos los inputs
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  // Limpio el mensaje de arriba
  document.getElementById("mensaje").textContent = "";
  // Limpio las listas de nodos
  document.getElementById("lista-nodos").innerHTML = "";
  const listaOrdenados = document.getElementById("lista-nodos-ordenados");
  if (listaOrdenados) listaOrdenados.innerHTML = "";
  // Limpio el canvas (borro el grafo)
  const canvas = document.getElementById("mapa");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  // Borro la ruta óptima guardada
  rutaOptima = [];
}

// Cuando la página termina de cargar, asigno las funciones a los botones y dibujo el grafo inicial
window.addEventListener("DOMContentLoaded", () => {
  render();
  document.getElementById("btn-agregar-nodo").onclick = agregarNodo;
  document.getElementById("btn-editar-nodo").onclick = editarNodo;
  document.getElementById("btn-eliminar-nodo").onclick = eliminarNodo;
  document.getElementById("btn-conectar").onclick = conectarNodos;
  document.getElementById("btn-desconectar").onclick = desconectarNodos;
  document.getElementById("btn-calcular-ruta").onclick = calcularRuta;
  document.getElementById("btn-ordenar-nodos").onclick = mostrarNodosOrdenados;
  document.getElementById("btn-limpiar-todo").onclick = limpiarTodo;
});
