# Usamos Flask para crear el servidor web y Flask-CORS para permitir peticiones desde el frontend (JavaScript).
# Todo lo que el frontend necesita (agregar, editar, eliminar, conectar nodos, etc.) pasa por aquí.

from flask import Flask, request, jsonify
from flask_cors import CORS
from grafo import Grafo  # Importamos la clase Grafo que tiene toda la lógica

app = Flask(__name__)
CORS(app)  # Permitimos peticiones desde cualquier origen que es útil para el desarrollo
grafo = Grafo()  # Creamos una instancia de mi grafo

# Ruta para obtener la lista de nodos (GET)
@app.route('/nodos', methods=['GET'])
def get_nodos():
    return jsonify(grafo.nodos_dict())

# Ruta para agregar un nodo nuevo (POST)
@app.route('/nodo', methods=['POST'])
def add_nodo():
    data = request.json
    ok = grafo.agregar_nodo(data['nombre'], float(data['lat']), float(data['lon']))
    return jsonify({'ok': ok})

# Ruta para eliminar un nodo por nombre (DELETE)
@app.route('/nodo/<nombre>', methods=['DELETE'])
def delete_nodo(nombre):
    ok = grafo.eliminar_nodo(nombre)
    return jsonify({'ok': ok})

# Ruta para editar un nodo existente (PUT)
@app.route('/nodo/<nombre>', methods=['PUT'])
def edit_nodo(nombre):
    data = request.json
    ok = grafo.editar_nodo(nombre, data['nuevo_nombre'], float(data['lat']), float(data['lon']))
    return jsonify({'ok': ok})

# Ruta para conectar dos nodos (POST)
@app.route('/conectar', methods=['POST'])
def conectar():
    data = request.json
    ok = grafo.conectar_nodos(data['nodo1'], data['nodo2'])
    return jsonify({'ok': ok})

# Ruta para desconectar dos nodos (POST)
@app.route('/desconectar', methods=['POST'])
def desconectar():
    data = request.json
    grafo.desconectar_nodos(data['nodo1'], data['nodo2'])
    return jsonify({'ok': True})

# Ruta para calcular la ruta más corta entre dos nodos (POST)
@app.route('/ruta', methods=['POST'])
def ruta():
    data = request.json
    camino, distancia = grafo.dijkstra(data['inicio'], data['fin'])
    return jsonify({'camino': camino, 'distancia': distancia})

# Esto hace que el servidor se inicie si se corre este archivo directamente
if __name__ == '__main__':
    app.run(debug=True)
