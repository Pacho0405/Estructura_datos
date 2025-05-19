import math

# Esta clase representa un nodo del grafo (por ejemplo, una bodega o punto de entrega)
class Nodo:
    def __init__(self, nombre, lat, lon):
        self.nombre = nombre  # Nombre único del nodo
        self.lat = lat        # Latitud (float)
        self.lon = lon        # Longitud (float)

# Esta clase es el grafo completo: guarda todos los nodos y las conexiones entre ellos
class Grafo:
    def __init__(self):
        self.nodos = {}       # Diccionario: nombre -> Nodo
        self.adyacencia = {}  # Diccionario: nombre -> {nombre_vecino: peso}

    # Devuelvo una lista de diccionarios con la info de cada nodo y sus vecinos (para el frontend)
    def nodos_dict(self):
        return [
            {
                'nombre': n.nombre,
                'lat': n.lat,
                'lon': n.lon,
                'vecinos': list(self.adyacencia[nombre].keys())
            }
            for nombre, n in self.nodos.items()
        ]

    # Agrego un nodo nuevo al grafo (si no existe ya)
    def agregar_nodo(self, nombre, lat, lon):
        if nombre in self.nodos:
            return False  # Ya existe un nodo con ese nombre
        self.nodos[nombre] = Nodo(nombre, lat, lon)
        self.adyacencia[nombre] = {}  # Inicializo su lista de vecinos
        return True

    # Elimino un nodo y todas sus conexiones
    def eliminar_nodo(self, nombre):
        if nombre not in self.nodos:
            return False
        del self.nodos[nombre]
        del self.adyacencia[nombre]
        # Quito este nodo de la lista de vecinos de los demás
        for vecinos in self.adyacencia.values():
            vecinos.pop(nombre, None)
        return True

    # Edito el nombre y/o las coordenadas de un nodo
    def editar_nodo(self, nombre, nuevo_nombre, lat, lon):
        if nombre not in self.nodos:
            return False
        if nuevo_nombre != nombre and nuevo_nombre in self.nodos:
            return False  # No puedo poner un nombre que ya existe
        self.nodos[nuevo_nombre] = Nodo(nuevo_nombre, lat, lon)
        # Cambio las conexiones al nuevo nombre
        self.adyacencia[nuevo_nombre] = self.adyacencia.pop(nombre)
        for vecinos in self.adyacencia.values():
            if nombre in vecinos:
                vecinos[nuevo_nombre] = vecinos.pop(nombre)
        if nuevo_nombre != nombre:
            del self.nodos[nombre]
        return True

    # Conecto dos nodos (arista bidireccional) y calculo el peso según la distancia
    def conectar_nodos(self, nombre1, nombre2):
        if nombre1 in self.nodos and nombre2 in self.nodos and nombre1 != nombre2:
            peso = self.distancia(self.nodos[nombre1], self.nodos[nombre2])
            self.adyacencia[nombre1][nombre2] = peso
            self.adyacencia[nombre2][nombre1] = peso
            return True
        return False

    # Quito la conexión entre dos nodos (si existe)
    def desconectar_nodos(self, nombre1, nombre2):
        if nombre1 in self.adyacencia and nombre2 in self.adyacencia[nombre1]:
            del self.adyacencia[nombre1][nombre2]
        if nombre2 in self.adyacencia and nombre1 in self.adyacencia[nombre2]:
            del self.adyacencia[nombre2][nombre1]

    # Calculo la distancia euclidiana entre dos nodos (para usar como peso de la arista)
    def distancia(self, nodo1, nodo2):
        return math.sqrt((nodo1.lat - nodo2.lat)**2 + (nodo1.lon - nodo2.lon)**2)

    # Algoritmo de Dijkstra para encontrar la ruta más corta entre dos nodos
    def dijkstra(self, inicio, fin):
        if inicio not in self.nodos or fin not in self.nodos:
            return [], float('inf')
        dist = {n: float('inf') for n in self.nodos}  # Distancia mínima conocida a cada nodo
        prev = {n: None for n in self.nodos}          # Para reconstruir el camino
        dist[inicio] = 0
        nodos = set(self.nodos.keys())

        while nodos:
            # Busco el nodo no visitado con menor distancia conocida
            actual = min(nodos, key=lambda n: dist[n])
            nodos.remove(actual)
            if dist[actual] == float('inf'):
                break  # Ya no hay forma de llegar a los demás
            for vecino, peso in self.adyacencia[actual].items():
                alt = dist[actual] + peso
                if alt < dist[vecino]:
                    dist[vecino] = alt
                    prev[vecino] = actual

        # Reconstruyo el camino óptimo desde el final hasta el inicio
        camino = []
        actual = fin
        while actual:
            camino.insert(0, actual)
            actual = prev[actual]
        if camino and camino[0] == inicio:
            return camino, dist[fin]
        else:
            return [], float('inf')