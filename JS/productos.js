let products = document.querySelector('.section-product');//elemento padre

const newProduct = document.createElement('div');//creamos un nuevo elemento
newProduct.setAttribute('class', 'product-container');//le agregamos una clase

newProduct.innerHTML = `
    <a href="./detalleProducto.html">
        <img src="../img/camara fija domo Hikvision 4K.png" alt="Camara fija domo Hikvision" />
        <h2>Porducto Nuevo</h2>
        <h3>DS-2CD2187G2-L(SU)</h3>
    </a>
`;

products.appendChild(newProduct);//agregamos el nuevo elemento al elemento padre, se agrega al DOM