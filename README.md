# Sistema de Navegación Logística
## Francisco Castro y Santiago Avila
## Descripción General

Este proyecto es una aplicación web que simula un sistema de navegación para una agencia de logística (similar a UPS), permitiendo la gestión de nodos (puntos de interés, bodegas, sucursales, etc.) y el cálculo de la ruta más corta y óptima entre ellos para optimizar las entregas. El sistema permite agregar, editar, eliminar y conectar nodos, visualizar el grafo y resaltar la ruta óptima calculada usando el algoritmo de Dijkstra. Además, implementa un algoritmo clásico de ordenamiento (Insertion Sort) para mostrar los nodos ordenados alfabéticamente.

---

## Características Principales

- **CRUD de nodos:** Agregar, editar y eliminar nodos con nombre, latitud y longitud.
- **Gestión de conexiones:** Conectar y desconectar nodos para formar el grafo.
- **Cálculo de ruta óptima:** Utiliza el algoritmo de Dijkstra (implementado manualmente) para encontrar la ruta más corta entre dos nodos.
- **Visualización gráfica:** Muestra el grafo en un canvas y resalta la ruta óptima calculada.
- **Ordenamiento clásico:** Permite ordenar y visualizar los nombres de los nodos alfabéticamente usando Insertion Sort.
- **Limpieza total:** Botón para limpiar todos los campos, mensajes y visualizaciones de la página.

---

## Estructura del Proyecto

```
Taller_AC_Mejorado/
│
├── Taller_AC/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── app.js
│   │   └── styles.css
│   └── backend/
│       ├── app.py
│       └── requirements.txt
│
└── README.md
```

---

## ¿Cómo funciona el sistema?

### 1. **Gestión de Nodos**

- **Agregar nodo:** Ingresa nombre, latitud y longitud. El nodo se añade al grafo.
- **Editar nodo:** Permite cambiar nombre, latitud y longitud de un nodo existente.
- **Eliminar nodo:** Elimina un nodo y sus conexiones.

### 2. **Conexión de Nodos**

- **Conectar:** Une dos nodos mediante una arista (bidireccional).
- **Desconectar:** Elimina la conexión entre dos nodos.

### 3. **Cálculo de Ruta Óptima**

- **Algoritmo de Dijkstra:**  
  Implementado manualmente en el backend (Python), calcula la ruta más corta entre dos nodos considerando las conexiones existentes y la distancia euclidiana entre ellos.
- **Visualización:**  
  La ruta óptima se resalta en el canvas con una línea azul-violeta gruesa y brillante.

### 4. **Ordenamiento de Nodos**

- **Insertion Sort:**  
  Implementado en el frontend (JavaScript), ordena alfabéticamente los nombres de los nodos y los muestra en una lista aparte.

### 5. **Limpieza Total**

- **Botón "Limpiar todo":**  
  Borra todos los campos de entrada, mensajes, listas y limpia el canvas.

---

## Lógica y Algoritmos

### Algoritmo de Dijkstra (Backend)

- **Entrada:** Nodo de inicio y nodo de destino.
- **Funcionamiento:**
  - Se calcula la distancia mínima desde el nodo de inicio a todos los demás nodos usando una cola de prioridad.
  - Se utiliza la distancia euclidiana entre nodos conectados como peso de las aristas.
  - Se reconstruye el camino óptimo una vez alcanzado el nodo destino.
- **Salida:**
  - Lista de nodos que conforman la ruta óptima.
  - Distancia total del recorrido.

### Insertion Sort (Frontend)

- **Entrada:** Lista de nombres de nodos.
- **Funcionamiento:**
  - Recorre la lista y va insertando cada elemento en su posición correcta respecto a los anteriores.
  - No utiliza el método `.sort()` de JavaScript ni librerías externas.
- **Salida:**
  - Lista de nombres ordenada alfabéticamente.

---

## ¿Cómo correr el proyecto?

### 1. **Requisitos previos**

- Tener instalado [Python 3.x](https://www.python.org/) y [pip](https://pip.pypa.io/en/stable/).
- Tener instalado [Node.js](https://nodejs.org/) si deseas usar un servidor para el frontend (opcional).
- Un navegador web moderno.

### 2. **Instalación del Backend**

1.Primero se deben descargar todas las carpetas que estan en el repositorio
2.Abre un terminal y con el con el comando "cd" ve a la carpeta `Taller_AC/backend`.
3. Instala las dependencias necesarias ejecutando:
   ```bash
   pip install -r requirements.txt
   ```
   Esto instalará automáticamente Flask y Flask-CORS, que son necesarios para el backend.
4. Ejecuta el servidor:
   ```bash
   python app.py
   ```
   Luego de ejecutar este comando ya quedó abierto el servidor.

### 3. **Ejecución del Frontend**

1. Ve a la carpeta `Taller_AC/frontend`.
2. Abre el archivo `index.html` en tu navegador.
   - O usa una extensión de servidor local en VS Code como "Live Server".
3. Asegúrate de que el backend esté corriendo antes de interactuar con la interfaz.

---

## ¿Qué se debe ingresar?

- **Nombres de nodos:** Únicos y descriptivos (ejemplo: "Bodega Central").
- **Latitud y longitud:** Valores numéricos válidos (ejemplo: 4.6097, -74.0817).
- **Conexiones:** Nombres de nodos existentes para conectar/desconectar.
- **Ruta más corta:** Nombres de nodo de inicio y fin.

---

## Temas lógicos y estructurales

- **Persistencia:**  
  El backend mantiene los nodos y conexiones en memoria (puedes adaptar para usar archivos o bases de datos).
- **Validaciones:**  
  El frontend y backend validan que los campos estén completos y que los nodos/conexiones existan.
- **Visualización:**  
  El canvas escala automáticamente los nodos según sus coordenadas para una visualización clara.
- **Modularidad:**  
  El código está organizado en funciones y módulos para facilitar el mantenimiento y la extensión.

---

## Ejemplo de uso

1. **Agregar varios nodos** con sus coordenadas.
2. **Conectar nodos** para formar el grafo.
3. **Calcular la ruta más corta** entre dos puntos.
4. **Visualizar la ruta óptima** resaltada en el grafo.
5. **Ordenar y visualizar los nodos** alfabéticamente.
6. **Limpiar todo** para reiniciar la simulación.
