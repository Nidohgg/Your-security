//Airtable
const airtableToken = "patrlX6gGjWJ4rTXi.78e0dc6576eab5f825e32ba84a3880e816e7846934cca7ca082d5248d495ce87";
 const baseId = "appn9RLoP0VhtfoET";
 const tableName = "Products";
 const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

//data

//elementos del DOM
const botonHamburguesa = document.querySelector('.hamburguesa');
const navmenu = document.querySelector('#nav-menu');
const productsDom = document.querySelector('.section-product');//elemento padre
const inputBusqueda = document.getElementById("busqueda");

//funciones
function creacionProducto(product){
    const newProduct = document.createElement('div');//creamos un nuevo elemento
    newProduct.setAttribute('class', 'product-container');//le agregamos una clase

    const newAnchor = document.createElement('a');
    newAnchor.setAttribute('href', './detalleProducto.html');

    const newImage = document.createElement('img');
    newImage.setAttribute('src', product.img);
    newImage.setAttribute('alt', product.name);

    const newH2Name = document.createElement('h2');
    newH2Name.innerText = product.name;

    const newH3Model = document.createElement('h3');
    newH3Model.innerText = product.model;

    const newPPrice = document.createElement('p');
    newPPrice.innerText = `$ ${product.price}`;

    newAnchor.appendChild(newImage);
    newAnchor.appendChild(newH2Name);
    newAnchor.appendChild(newH3Model);
    newAnchor.appendChild(newPPrice);
    newProduct.appendChild(newAnchor);

    return newProduct;//devolvemos el nuevo elemento creado al Dom
}

function filtroProductos(text){//filtramos los productos por nombre
    const filtrado = listProductos.filter( (p => p.name.toLowerCase().includes(text.toLowerCase())))
    return filtrado;
}

function filtroProductosCategoria(category){//filtramos los productos por categoria
    const filtrado = listProductos.filter( (p => p.category.toLowerCase() === category.toLowerCase()))
    return filtrado;
}


function muestraProductos(productos){
    productsDom.innerHTML = "";//limpiamos el contenido actual
    productos.forEach( (producto) => {
        const newProductDom = creacionProducto(producto);
        productsDom.appendChild(newProductDom);//agregamos el nuevo elemento al elemento padre, se agrega al DOM
    })
}

//EVENTOS

botonHamburguesa.addEventListener('click', () => {//se registra el click en el boton hamburguesa
    const abrirMenu = navmenu.classList.toggle('open');//se agrega o quita la clase open al menu, el toggle devuelve true o false segun el estado
    botonHamburguesa.setAttribute('aria-expanded', abrirMenu);//se actualiza el atributo aria-expanded segun el estado del menu
})


inputBusqueda.addEventListener('keyup', (event) => {
    const texto = event.target.value;//obtenemos el texto del input
    const productosFiltrados = filtroProductos(texto);//obtenemos los productos filtrados
    muestraProductos(productosFiltrados);//mostramos los productos filtrados
})





//LLAMADAS A LA API DE AIRTABLE
 async function getProductsFromAirtable() {
    try {
        const response = await fetch(airtableUrl, {
            headers: {
                'Authorization': `Bearer ${airtableToken}`,
                'content-type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Products from airtable:', data);
        const mappedProducts = data.records.map(item => ({
            name: item.fields.Name,
            model: item.fields.Model,
            price: item.fields.Price,
            img: item.fields.img[0].url,
            category: item.fields.Category
        }));
        listProductos = mappedProducts; // Guardar en la variable global
        console.log('Mapped Products:', mappedProducts);
        muestraProductos(mappedProducts);
    }
    catch (error) {
        console.error('Error fetching products from Airtable:', error);
    }
}
getProductsFromAirtable();

/*async function editAirtableProduct(product) {
    try {
        const response = await fetch(`${airtableUrl}/recqGCxjt90Sadm7s`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${airtableToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    name: product.nombre,
                    model: product.modelo,
                    price: product.precio,
                    image: product.img
                }
            })
        });
        const data = await response.json();
        console.log('Product updated in Airtable:', data);
    } catch (error) {
        console.error('Error updating product in Airtable:', error);
    }
};

//editAirtableProduct(listProductos[0]);
editAirtableProduct(
    {
        nombre: "Camara de red domo fija ColorVU 4K HIKVISION EDITADA",
        modelo: "DS-2CD2187G2-L(SU) EDITADA",
        precio: 150,
        img: '../img/camara fija domo Hikvision 4K.png'
    }
);*/