//Airtable
const airtableToken =
  "patrlX6gGjWJ4rTXi.78e0dc6576eab5f825e32ba84a3880e816e7846934cca7ca082d5248d495ce87";
const baseId = "appn9RLoP0VhtfoET";
const tableName = "Products";
const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

//data

//ELEMENTOS DEL DOM

let listProductos = []; //lista global de productos
//menu navegacion
const botonHamburguesa = document.querySelector(".hamburguesa");
const navmenu = document.querySelector("#nav-menu");

//muestra de productos
const productsDom = document.querySelector(".section-product"); //elemento padre para mostrar los productos
const productsCarrDom = document.querySelector(".muestra-product"); //elemento padre para el carrusel de productos
const inputBusqueda = document.getElementById("busqueda");
const filtroMarca = document.querySelectorAll(".filtro-marca");
const filtroTipo = document.querySelectorAll(".filtro-tipo");

//carrusel
const carr = document.getElementById("carrusel-productos");
const anterior = document.querySelector(".carr-btn.anterior");
const siguiente = document.querySelector(".carr-btn.siguiente");

//para detalle de producto
//obterner el id del producto
const params = new URLSearchParams(window.location.search);
const productId = params.get("code");

//Carrito de compras
const botonCarrito = document.getElementById("btnAñadirCarrito");
let productDetail = null;
const carritoItemsContainer = document.getElementById("carrito-items");
const carritoTotalAmount = document.getElementById("carrito-total-amount");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");

const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");
const checkoutItemsContainer = document.getElementById("checkout-items");
const checkoutTotalAmount = document.getElementById("checkout-total");
const checkoutVacioMensaje = document.getElementById("checkout-vacio");
const checkoutForm = document.getElementById("checkout-form");
const checkoutConfirmacion = document.getElementById("checkout-confirmacion");

//
const btnEditarProducto = document.getElementById("btn-editar-producto");

//FUNCIONES
function creacionProducto(product) {
  const newProduct = document.createElement("div"); //creamos un nuevo elemento
  newProduct.setAttribute("class", "product-container"); //le agregamos una clase

  const newAnchor = document.createElement("a");
  newAnchor.href = `./detalleProducto.html?code=${encodeURIComponent(
    product.id
  )}`; // enlace a la pagina de detalle del producto

  const newImage = document.createElement("img");
  newImage.setAttribute("src", product.img);
  newImage.setAttribute("alt", product.name);

  const newH2Name = document.createElement("h2");
  newH2Name.innerText = product.name;

  const newH3Model = document.createElement("h3");
  newH3Model.innerText = product.model;

  const newPPrice = document.createElement("p");
  newPPrice.innerText = `$ ${product.price}`;

  newAnchor.appendChild(newImage);
  newAnchor.appendChild(newH2Name);
  newAnchor.appendChild(newH3Model);
  newAnchor.appendChild(newPPrice);
  newProduct.appendChild(newAnchor);

  return newProduct; //devolvemos el nuevo elemento creado al Dom
}

function filtroProductos(text) {
  //filtramos los productos por nombre
  const filtrado = listProductos.filter((p) =>
    p.name.toLowerCase().includes(text.toLowerCase())
  );
  return filtrado;
}

function muestraProductos(productos) {
  productsDom.innerHTML = ""; //limpiamos el contenido actual
  productos.forEach((producto) => {
    const newProductDom = creacionProducto(producto);
    productsDom.appendChild(newProductDom); //agregamos el nuevo elemento al elemento padre, se agrega al DOM
  });
}

//filtramos los productos por categoria
function filtroProductosCategoria(category) {
  const filtrado = listProductos.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
  muestraProductos(filtrado);
}

//filtramos los productos por marca
function filtroProductosMarca(brand) {
  const filtrado = listProductos.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase()
  );
  muestraProductos(filtrado);
}

function muestraProductosCarrusel(productos) {
  productsCarrDom.innerHTML = ""; //limpiamos el contenido actual
  productos.slice(0, 8).forEach((producto) => {
    //SLICE PARA LIMITAR A 8 PRODUCTOS
    const newProductDom = creacionProducto(producto);
    productsCarrDom.appendChild(newProductDom); //agregamos el nuevo elemento al elemento padre, se agrega al DOM
  });
}

function mover(dir = 1) {
  const paso = 300;
  carr.scrollBy({ left: dir * paso, behavior: "smooth" });
}

function detalleProducto(productData) {
  document.getElementById("detalle-img").src = productData.fields.img[0].url;
  document.getElementById("detalle-nombre").innerText = productData.fields.Name;
  document.getElementById("detalle-modelo").innerText =
    productData.fields.Model;
  document.getElementById(
    "detalle-precio"
  ).innerText = `$ ${productData.fields.Price}`;
  document.getElementById(
    "detalle-precio1"
  ).innerText = `$ ${productData.fields.Price}`;
  document.getElementById("detalle-decripción").innerText =
    productData.fields.Description || "No description available.";
}

function cargarCarritoDesdeStorage() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarritoEnStorage(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderCarrito() {
  if (!carritoItemsContainer || !carritoTotalAmount) return; //

  const carrito = cargarCarritoDesdeStorage();
  carritoItemsContainer.innerHTML = ""; //
  let total = 0;

  if (carrito.length === 0) {
    carritoItemsContainer.innerHTML =
      '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    carritoTotalAmount.textContent = "0.00";
    return;
  }

  carrito.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.dataset.index = index;

    div.innerHTML = `
            <div class="carrito-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="carrito-info">
                <h4>${item.name}</h4>
                <p class="carrito-modelo">${item.model || ""}</p>
                <p class="carrito-precio">Precio: $ ${item.price}</p>

                <div class="carrito-controles">
                    <button class="btn-restar">-</button>
                    <span class="carrito-cantidad">${item.quantity}</span>
                    <button class="btn-sumar">+</button>
                    <button class="btn-eliminar">Eliminar</button>
                </div>

                <p class="carrito-subtotal">Subtotal: $ ${subtotal}</p>
            </div>
        `;

    carritoItemsContainer.appendChild(div);
  });

  carritoTotalAmount.textContent = total.toFixed(2);
}

if (carritoItemsContainer) {
  renderCarrito();
}

function actualizarCheckout() {
  if (!checkoutItemsContainer || !checkoutTotalAmount) return;

  const carrito = cargarCarritoDesdeStorage();
  checkoutItemsContainer.innerHTML = ""; //es para limpiar el contenedor
  let total = 0;

  if (checkoutVacioMensaje) {
    checkoutVacioMensaje.style.display =
      carrito.length === 0 ? "block" : "none"; //mostrar mensaje si el carrito esta vacio
  }

  const enviarBtn = checkoutForm?.querySelector("button[type='submit']");
  if (enviarBtn) {
    enviarBtn.disabled = carrito.length === 0; //deshabilitar el boton si el carrito esta vacio
  }

  if (!carrito.length) {
    checkoutTotalAmount.textContent = "0.00"; //si el carrito esta vacio, el total es 0
    return;
  }

  carrito.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const resumenItem = document.createElement("div");
    resumenItem.classList.add("checkout-item");
    resumenItem.innerHTML = `
        <div class="checkout-item-text">
            <h4>${item.name}</h4>
            <p class="checkout-item-modelo">${item.model || ""}</p>
            <p class="checkout-item-cantidad">Cantidad: ${item.quantity}</p>
            <p class="checkout-item-subtotal">Subtotal: $ ${subtotal}</p>
        </div>
    `; //creamos el elemento del resumen del carrito
    checkoutItemsContainer.appendChild(resumenItem);
  });
  checkoutTotalAmount.textContent = total.toFixed(2); //actualizamos el total del checkout, fixed es para limitar los decimales
}

if (checkoutItemsContainer) {
  //si existe el contenedor de checkout, actualizamos el resumen
  actualizarCheckout();
}

//EVENTOS
if (carritoItemsContainer) {
  carritoItemsContainer.addEventListener("click", (e) => {
    const carrito = cargarCarritoDesdeStorage();
    const itemDom = e.target.closest(".carrito-item");
    if (!itemDom) return;

    const index = Number(itemDom.dataset.index);
    const item = carrito[index];
    if (!item) return;

    if (e.target.classList.contains("btn-sumar")) {
      item.quantity = (item.quantity || 1) + 1;
    }

    if (e.target.classList.contains("btn-restar")) {
      const nuevaCantidad = (item.quantity || 1) - 1;
      item.quantity = nuevaCantidad < 1 ? 1 : nuevaCantidad;
    }

    if (e.target.classList.contains("btn-eliminar")) {
      carrito.splice(index, 1);
    }

    guardarCarritoEnStorage(carrito);
    renderCarrito();
  });

  // Botón para "Vaciar Carrito"
  if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      renderCarrito();
    });
  }

  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", () => {
      const carrito = cargarCarritoDesdeStorage(); //obtenemos el carrito del localStorage
      if (carrito.length === 0) {
        alert(
          "El carrito esta vacio. Agrega productos antes de finalizar la compra."
        );
        return;
      }
      window.location.href = "./checkout.html"; //redireccionamos a la pagina de checkout
    });
  }
}

//evento para el boton hamburguesa
if (botonHamburguesa && navmenu) {
  botonHamburguesa.addEventListener("click", () => {
    //se registra el click en el boton hamburguesa
    const abrirMenu = navmenu.classList.toggle("open"); //se agrega o quita la clase open al menu, el toggle devuelve true o false segun el estado
    botonHamburguesa.setAttribute("aria-expanded", abrirMenu); //se actualiza el atributo aria-expanded segun el estado del menu
  });
}

//evento para el input de busqueda
if (inputBusqueda) {
  inputBusqueda.addEventListener("keyup", (event) => {
    const texto = event.target.value; //obtenemos el texto del input
    const productosFiltrados = filtroProductos(texto); //obtenemos los productos filtrados
    muestraProductos(productosFiltrados); //mostramos los productos filtrados
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault(); //evita que se recargue la pagina

    const carrito = cargarCarritoDesdeStorage();
    if (carrito.length === 0) {
      checkoutConfirmacion.textContent =
        "El carrito esta vacio. No se puede procesar la compra."; //mensaje de error
      checkoutConfirmacion.classList.remove("checkout-exito");
      checkoutConfirmacion.classList.add("checkout-aviso"); //clase de aviso
      return;
    }

    const nombre = checkoutForm.nombre.value.trim(); //obtenemos el nombre del formulario
    checkoutConfirmacion.textContent = `Gracias por tu compra, ${
      nombre || ""
    }! Tu pedido ha sido procesado exitosamente.`; //mensaje de exito
    checkoutConfirmacion.classList.remove("checkout-aviso");
    checkoutConfirmacion.classList.add("checkout-exito"); //clase de exito

    localStorage.removeItem("carrito"); //vaciamos el carrito
    checkoutForm.reset(); //reseteamos el formulario
    renderCarrito(); //actualizamos el carrito
    actualizarCheckout(); //actualizamos el checkout
  });
}

//evento para los filtros de tipo
filtroTipo.forEach((e) => {
  e.addEventListener("click", () => {
    const category = e.getAttribute("data-category");

    filtroTipo.forEach((el) => el.classList.remove("filtro-activo")); //removemos la clase de todos los filtros
    e.classList.add("filtro-activo"); //agregamos la clase al filtro seleccionado

    filtroProductosCategoria(category);
  });
});

//evento para los filtros de marca
filtroMarca.forEach((e) => {
  e.addEventListener("click", () => {
    const brand = e.getAttribute("data-brand");

    filtroMarca.forEach((el) => el.classList.remove("filtro-activo"));
    e.classList.add("filtro-activo");

    filtroProductosMarca(brand);
  });
});

if (anterior) {
  anterior.addEventListener("click", () => mover(-1)); // mueve a la izquierda
}
if (siguiente) {
  siguiente.addEventListener("click", () => mover(1)); // mueve a la derecha
}

if (botonCarrito) {
  botonCarrito.addEventListener("click", (e) => {
    e.preventDefault(); //se hace para evitar que el boton recargue la pagina

    if (!productDetail) {
      console.error("No se ha cargado el detalle del producto.");
      return;
    } else {
      alert("Se agregó el producto al carrito");
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || []; //obtenemos el carrito del localStorage o un array vacio si no existe

    //verificar si el producto ya esta en el carrito
    const prodExiste = carrito.find((item) => item.id === productDetail.id);

    if (prodExiste) {
      prodExiste.quantity += 1; //suma uno mas
    } else {
      carrito.push({
        id: productDetail.id,
        name: productDetail.fields.Name,
        model: productDetail.fields.Model,
        price: productDetail.fields.Price,
        img: productDetail.fields.img[0].url,
        quantity: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); //guardamos el carrito en el localStorage
    console.log("Se agrego el producto al carrito");
  });
}

//eveto para el boton de editar producto
if (btnEditarProducto && productId) {
  btnEditarProducto.addEventListener("click", async () => {
    if (!productDetail) {
      alert("Todavía no se cargó el detalle del producto.");
      return;
    }

    // valores actuales
    const nombreActual = productDetail.fields.Name;
    const precioActual = productDetail.fields.Price;

    const nuevoNombre = prompt("Nuevo nombre del producto:", nombreActual);
    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const nuevoPrecioStr = prompt("Nuevo precio:", precioActual);
    const nuevoPrecio = Number(nuevoPrecioStr);

    if (isNaN(nuevoPrecio)) {
      alert("El precio debe ser un número válido.");
      return;
    }

    try {
      const updated = await editProductInAirtable(productId, {
        Name: nuevoNombre,
        Price: nuevoPrecio,
      });

      // Airtable devuelve { id, fields: {...} }
      productDetail = updated; // actualizamos la variable global
      detalleProducto(updated); // refrescamos los datos en pantalla

      alert("Producto actualizado correctamente ✅");
    } catch (error) {
      alert("Ocurrió un error al actualizar el producto.");
    }
  });
}

//LLAMADAS A LA API DE AIRTABLE
async function getProductsFromAirtable() {
  try {
    const response = await fetch(airtableUrl, {
      headers: {
        Authorization: `Bearer ${airtableToken}`, //sirve para autenticar la peticion
        "content-type": "application/json", //indica que el contenido es de tipo json
      },
    });
    const data = await response.json(); //sirve para convertir la respuesta en un objeto json
    console.log("Products from airtable:", data);
    const mappedProducts = data.records.map((item) => ({
      id: item.id,
      name: item.fields.Name,
      model: item.fields.Model,
      price: item.fields.Price,
      img: item.fields.img[0].url, // Asumiendo que 'img' es un array de objetos con una propiedad 'url'
      category: item.fields.Category,
      description: item.fields.Description,
      brand: item.fields.Brand,
    }));
    listProductos = mappedProducts; // Guardar en la variable global
    console.log("Mapped Products:", mappedProducts);

    if (productsDom) {
      muestraProductos(mappedProducts);
    }
    if (productsCarrDom) {
      muestraProductosCarrusel(mappedProducts);
    }
  } catch (error) {
    console.error("Error fetching products from Airtable:", error);
  }
}

//funcion para editar un producto en airtable
async function editProductInAirtable(productId, updatedFields) {
  try {
    const url = `${airtableUrl}/${productId}`;

    const response = await fetch(url, {
      method: "PATCH", // importante: PATCH para actualizar
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: updatedFields, // { Name: 'nuevo', Price: 123 }
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Producto actualizado en Airtable:", data);
    return data; // { id, fields: { ... } }
  } catch (error) {
    console.error("Error actualizando producto en Airtable:", error);
    throw error;
  }
}

//funcion para obtener el detalle de un producto
async function getProductDetailFromAirtable() {
  try {
    const url = `${airtableUrl}/${productId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Detalle del producto: ", data);

    productDetail = data; //Se guarda el detalle del producto en la variable global
    detalleProducto(data); //llamamos a la funcion para mostrar el detalle del producto
  } catch (error) {
    console.error("Error obteniendo el detalle del producto", error);
  }
}

getProductsFromAirtable();

//si existe un productId en la URL, obtenemos el detalle del producto
if (productId) {
  getProductDetailFromAirtable();
}
