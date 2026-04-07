// URL de la API (ajusta según tu despliegue)
const API_URL = 'http://localhost:3000/productos';
// const API_URL = 'https://tu-app-en-la-nube.com/productos'; // Para producción

// Elementos del DOM
const form = document.getElementById('producto-form');
const formTitle = document.getElementById('form-title');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const tbody = document.getElementById('tbody-productos');
const mensajeDiv = document.getElementById('mensaje');
const buscadorInput = document.getElementById('buscador');

// Estado
let editando = false;
let productosGlobales = []; // Para almacenar y filtrar sin recargar

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', cargarProductos);

// Event listeners
form.addEventListener('submit', manejarSubmit);
btnCancelar.addEventListener('click', cancelarEdicion);
buscadorInput.addEventListener('input', filtrarProductos);

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = 'exito') {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';
    
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

// Cargar todos los productos
async function cargarProductos() {
    try {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Cargando productos...</td></tr>';
        
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (!data.exito) {
            throw new Error(data.mensaje);
        }
        
        productosGlobales = data.data; // Guardamos
        mostrarProductos(productosGlobales);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="loading">Error: ${error.message}</td></tr>`;
        mostrarMensaje('Error al cargar productos: ' + error.message, 'error');
    }
}

// Mostrar productos en la tabla
function mostrarProductos(productos) {
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading-state"><p>No se encontraron productos</p></td></tr>';
        document.querySelector('.badge-count').textContent = `0 Productos`;
        return;
    }
    
    tbody.innerHTML = productos.map(producto => {
        const catClass = producto.categoria ? producto.categoria.toLowerCase().replace('é', 'e') : '';
        return `
        <tr>
            <td>
                <div class="product-name-cell">
                    <span class="product-name">${producto.nombre}</span>
                    <span class="product-desc">${producto.descripcion}</span>
                </div>
            </td>
            <td class="product-price">S/ ${producto.precio.toFixed(2)}</td>
            <td>${producto.stock} uds.</td>
            <td><span class="badge ${catClass}">${producto.categoria}</span></td>
            <td class="actions-cell">
                <button onclick="editarProducto('${producto._id}')" class="action-btn btn-edit" title="Editar">
                    <i data-lucide="edit-3"></i>
                </button>
                <button onclick="eliminarProducto('${producto._id}')" class="action-btn btn-delete" title="Eliminar">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        </tr>
    `}).join('');
    lucide.createIcons();
    document.querySelector('.badge-count').textContent = `${productos.length} Productos`;
}

// Crear o actualizar producto
async function manejarSubmit(e) {
    e.preventDefault();
    
    const productoData = {
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        categoria: document.getElementById('categoria').value
    };
    
    const productoId = document.getElementById('producto-id').value;
    
    try {
        const url = editando ? `${API_URL}/${productoId}` : API_URL;
        const method = editando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        });
        
        const data = await response.json();
        
        if (!data.exito) {
            if (data.errores) {
                const errores = data.errores.map(e => e.msg).join(', ');
                throw new Error(errores);
            }
            throw new Error(data.mensaje);
        }
        
        mostrarMensaje(data.mensaje);
        form.reset();
        cancelarEdicion();
        cargarProductos();
        
    } catch (error) {
        mostrarMensaje('Error: ' + error.message, 'error');
    }
}

// Editar producto
async function editarProducto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (!data.exito) {
            throw new Error(data.mensaje);
        }
        
        const producto = data.data;
        
        // Llenar formulario
        document.getElementById('producto-id').value = producto._id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('categoria').value = producto.categoria;
        
        // Cambiar modo a edición
        editando = true;
        formTitle.textContent = 'Editar Producto';
        btnGuardar.innerHTML = '<i data-lucide="save"></i> Actualizar Producto';
        btnCancelar.style.display = 'inline-flex';
        btnCancelar.innerHTML = '<i data-lucide="x"></i> Cancelar';
        lucide.createIcons();
        
        // Scroll al formulario
        form.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        mostrarMensaje('Error al cargar producto: ' + error.message, 'error');
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!data.exito) {
            throw new Error(data.mensaje);
        }
        
        mostrarMensaje(data.mensaje);
        cargarProductos();
        
    } catch (error) {
        mostrarMensaje('Error al eliminar: ' + error.message, 'error');
    }
}

// Cancelar edición
function cancelarEdicion() {
    editando = false;
    form.reset();
    document.getElementById('producto-id').value = '';
    formTitle.textContent = 'Nuevo Producto';
    btnGuardar.innerHTML = 'Guardar Producto';
    btnCancelar.style.display = 'none';
}

// Filtrar productos por búsqueda
function filtrarProductos() {
    const textoBuscador = buscadorInput.value.toLowerCase();
    const productosFiltrados = productosGlobales.filter(producto => 
        producto.nombre.toLowerCase().includes(textoBuscador) || 
        producto.descripcion.toLowerCase().includes(textoBuscador)
    );
    mostrarProductos(productosFiltrados);
}