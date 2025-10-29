console.log("Hola mundooo!");

//formas de declarar variables
//const constante = "hola";
//let variable = 5;

const listProductos = [
    { id: 1, nombre: "Camara de red domo fija ColorVU 4K HIKVISION", precio: 100, img: '../img/camara fija domo Hikvision 4K.png' },
    { id: 2, nombre: "Cámara bala TiOC HDCVI inteligente con doble luz 4K", precio: 200, img: '../img/Cámara bala TiOC HDCVI inteligente con doble luz 4K.png' },
    { id: 3, nombre: "Dahua Picoo Dual 10mp P5d-5f-pv Camara Wifi Lente 5mp+5mp Color Blanco", precio: 300, img: '../img/DH-P5D-5F-PV - CAMARA Dahua.png' },
    { id: 4, nombre: "Cámara Seguridad Hikvision Turbo Hd Tvi 1080p 2mp Domo Color Blanco", precio: 400, img: '../img/Cám Hikvision Turbo Hd Tvi 1080p 2mp Domo' },
    { id: 5, nombre: "Camara Bullet Dahua 5mp Full Hd Exterior Seguridad Cctv Ir 30mts", precio: 500, img: '../img/camara Bullet Dahua 5mp.png' },
];

const productsDom = document.querySelector('.muestra-product');//elemento padre

function creacionProducto(product){
    const newProduct = document.createElement('div');//creamos un nuevo elemento
    newProduct.setAttribute('class', 'product-container');//le agregamos una clase

    const newAnchor = document.createElement('a');
    newAnchor.setAttribute('href', './detalleProducto.html');

    const newImage = document.createElement('img');
    newImage.setAttribute('src', product.img);
    newImage.setAttribute('alt', product.nombre);

    const newH2Name = document.createElement('h2');
    newH2Name.innerText = product.nombre;

    const newH3Price = document.createElement('h3');
    newH3Price.innerText = `$ ${product.precio}`;

    newAnchor.appendChild(newImage);
    newAnchor.appendChild(newH2Name);
    newAnchor.appendChild(newH3Price);
    newProduct.appendChild(newAnchor);

    return newProduct;//devolvemos el nuevo elemento creado al Dom
}


