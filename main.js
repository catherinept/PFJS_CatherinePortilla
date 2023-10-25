let carritoVisible = false;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    const botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (let i = 0; i < botonesEliminarItem.length; i++) {
        const button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    const botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (let i = 0; i < botonesSumarCantidad.length; i++) {
        const button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    const botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (let i = 0; i < botonesRestarCantidad.length; i++) {
        const button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    const botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
        const button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

function pagarClicked() {
    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: 'Su compra se realizó con éxito',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
        }
    });

    const carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

function agregarAlCarritoClicked(event) {
    const button = event.target;
    const item = button.parentElement;
    const titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    const precio = item.getElementsByClassName('precio-item')[0].innerText;
    const imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);

    hacerVisibleCarrito();
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    const carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    const items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    const item = document.createElement('div');
    item.classList.add('item');
    const itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    const nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
            Swal.fire({
                icon: 'warning',
                title: 'Ítem Duplicado',
                text: 'Este ítem ya se encuentra en el carrito, si desea añadir más hágalo en el carrito de compras',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
    }

    const itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.appendChild(item);

    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    const botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    const botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    const buttonClicked = event.target;
    const selector = buttonClicked.parentElement;
    const cantidadActual = parseInt(selector.querySelector('.carrito-item-cantidad').value);
    const cantidadNueva = cantidadActual + 1;
    selector.querySelector('.carrito-item-cantidad').value = cantidadNueva;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    const buttonClicked = event.target;
    const selector = buttonClicked.parentElement;
    const cantidadActual = parseInt(selector.querySelector('.carrito-item-cantidad').value);
    
    if (cantidadActual > 1) {
        const cantidadNueva = cantidadActual - 1;
        selector.querySelector('.carrito-item-cantidad').value = cantidadNueva;
        actualizarTotalCarrito();
    }
}

function eliminarItemCarrito(event) {
    const buttonClicked = event.target;
    const item = buttonClicked.parentElement.parentElement;
    item.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

function ocultarCarrito() {
    const carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount === 0) {
        const carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        const items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

function actualizarTotalCarrito() {
    const carritoContenedor = document.getElementsByClassName('carrito')[0];
    const carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;
    for (let i = 0; i < carritoItems.length; i++) {
        const item = carritoItems[i];
        const precioElemento = item.querySelector('.carrito-item-precio');
        const precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        const cantidadItem = item.querySelector('.carrito-item-cantidad').value;
        total += precio * cantidadItem;
    }
    total = Math.round(total * 100) / 100;

    document.querySelector('.carrito-precio-total').innerText = `$${total.toLocaleString("es")},00`;
}