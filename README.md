# Examen 01 - InvenPro Dashboard

Aplicación de gestión de inventario desarrollada con **Node.js, Express.js y MongoDB Atlas**.

## Características
- **API REST completa**: Operaciones CRUD para productos.
- **Base de Datos**: Conexión segura a MongoDB Atlas.
- **Interfaz Premium**: Dashboard moderno con filtrado en tiempo real.
- **Validación**: Implementada con `express-validator`.
- **Responsive**: Adaptable a dispositivos móviles.

## Estructura del Proyecto
- `/backend`: Servidor Express, modelos de Mongoose y rutas de la API.
- `/frontend`: Interfaz de usuario (HTML, CSS, JS).

## Requisitos
- Node.js instalado.
- Cuenta en MongoDB Atlas (o MongoDB local).

## Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/cristianzavaletab-lgtm/Examen-01.git
   cd Examen-01
   ```

2. Configurar el Backend:
   ```bash
   cd backend
   npm install
   ```

3. Crear un archivo `.env` en la carpeta `backend` con tu URI de MongoDB:
   ```env
   MONGODB_URI=tu_uri_de_mongodb_atlas
   PORT=3000
   ```

4. Iniciar el servidor:
   ```bash
   npm start
   ```

5. Abrir en el navegador:
   `http://localhost:3000`

## Despliegue en la Nube
Para desplegar en **Render.com**:
1. Conectar este repositorio de GitHub.
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Agregar variable de entorno `MONGODB_URI`.

## Autor
Desarrollado para el Examen Parcial 01.
