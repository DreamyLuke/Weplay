// Navbar con fondo negro al scrollear

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if(window.scrollY > 0){
        navbar.classList.add("navbar-scroll");
    }else{
        navbar.classList.remove("navbar-scroll");
    }
});

// Menú hamburguesa

const menuIcon = document.querySelector(".menu-icon"); 
const navItems = document.querySelector(".nav-items"); 

menuIcon.addEventListener("click", () => {
    navItems.classList.toggle("active");
    navbar.classList.toggle("open-menu");

    if (navItems.classList.contains("active")) {
    menuIcon.textContent = "close";
    } else {
        menuIcon.textContent = "menu";
    }
});

// Cerrar el menú al hacer click en alguno de los items
const menuLinks = document.querySelectorAll(".nav-items a");

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        navItems.classList.remove("active");
        navbar.classList.remove("open-menu");
        menuIcon.textContent = "menu";
    });
});

// Filtros de Productos

const filterButtons = document.querySelectorAll(".filter li");
const productCards = document.querySelectorAll(".product-card");

filterButtons[0].classList.add("active-filter");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active-filter"));
        button.classList.add("active-filter");
        
        const filterValue = button.getAttribute("data-filter");

        productCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            if (filterValue === "all" || filterValue === cardCategory) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// Mostrar y ocultar carritos

const cartIcon = document.getElementById("cart-icon");
const cartEmpty = document.getElementById("cart-window-without-products");
const cartWithProducts = document.getElementById("cart-window");
const cartCloseEmpty = document.getElementById("cart-close-empty");
const cartCloseWithProducts = document.getElementById("cart-close-with-products");

cartEmpty.style.display = "none";
cartWithProducts.style.display = "none";

function closeCart() {
    cartEmpty.style.display = "none";
    cartWithProducts.style.display = "none";
}

function openCart() {
    if (cartItems.length === 0) {
        cartEmpty.style.display = "flex";
        cartWithProducts.style.display = "none";
    } else {
        cartEmpty.style.display = "none";
        cartWithProducts.style.display = "flex";
        updateCartDisplay();
    }
}

cartIcon.addEventListener("click", openCart);
cartCloseEmpty.addEventListener("click", closeCart);
cartCloseWithProducts.addEventListener("click", closeCart);

cartWithProducts.addEventListener("click", function(e) {
    if (e.target === this) {
        closeCart();
    }
});

cartEmpty.addEventListener("click", function(e) {
    if (e.target === this) {
        closeCart();
    }
});

// Actualizar carrito

let cartItems = [];

function crearEstructuraCarrito() {
    const cartProductsContainer = document.querySelector(".cart-products");
    
    cartProductsContainer.innerHTML = "";
    
    const columnas = [
        { id: "cart-products-list", titulo: "Aventuras Elegidas" },
        { id: "cart-prices-list", titulo: "Precio" },
        { id: "cart-quantities-list", titulo: "Cantidad" },
        { id: "cart-totals-list", titulo: "Total" }
    ];
    
    columnas.forEach(col => {
        const columna = document.createElement("div");
        columna.className = "cart-column";
        columna.innerHTML = `
            <h2 id="cart-titulos-columnas">${col.titulo}</h2>
            <div id="${col.id}"></div>
        `;
        cartProductsContainer.appendChild(columna);
    });
}

crearEstructuraCarrito();

function updateCartDisplay() {

    if (cartItems.length === 0) {
        updateSummary();
        return;
    }
    
    if (cartWithProducts.style.display !== "flex") {
        updateSummary();
        return;
    }
    
    const productsList = document.getElementById("cart-products-list");
    const pricesList = document.getElementById("cart-prices-list");
    const quantitiesList = document.getElementById("cart-quantities-list");
    const totalsList = document.getElementById("cart-totals-list");
    
    productsList.innerHTML = "";
    pricesList.innerHTML = "";
    quantitiesList.innerHTML = "";
    totalsList.innerHTML = "";
    
    cartItems.forEach((item, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "cart-product-card";
        productDiv.innerHTML = `
            <div class="cart-product-card-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-product-card-description">
                <h2>${item.title}</h2>
                <h2 id="categoria">${item.category}</h2>
                <h2 id="quitar-del-carrito" onclick="removeFromCart(${index})">✕ Quitar del carrito</h2>
            </div>
        `;

        productsList.appendChild(productDiv);

        const priceDiv = document.createElement("div");
        priceDiv.className = "cart-column-content";
        priceDiv.innerHTML = `<p class="cart-product-price">USD ${item.price}</p>`;
        pricesList.appendChild(priceDiv);

        const quantityDiv = document.createElement("div");
        quantityDiv.className = "cart-column-content cart-modifier";
        quantityDiv.innerHTML = `
            <span class="material-symbols-outlined" id="cart-modifier-icon" onclick="changeQuantity(${index}, -1)">remove</span>
            <p class="cart-product-quantity">${item.quantity}</p>
            <span class="material-symbols-outlined" id="cart-modifier-icon" onclick="changeQuantity(${index}, 1)">add</span>
        `;
        quantitiesList.appendChild(quantityDiv);
        
        const totalDiv = document.createElement("div");
        totalDiv.className = "cart-column-content";
        totalDiv.innerHTML = `<p class="cart-product-total">USD ${item.price * item.quantity}</p>`;
        totalsList.appendChild(totalDiv);
    });
    
    updateSummary();
}

// Modificar cantidad de productos del carrito

function changeQuantity(index, change) {
    if (cartItems[index].quantity === 1 && change === -1) {
        return;
    }
    
    cartItems[index].quantity += change;
    
    if (cartWithProducts.style.display === "flex") {
        if (cartItems.length === 0) {
            cartEmpty.style.display = "flex";
            cartWithProducts.style.display = "none";
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    
    if (cartWithProducts.style.display === "flex") {
        if (cartItems.length === 0) {
            cartEmpty.style.display = "flex";
            cartWithProducts.style.display = "none";
        } else {
            updateCartDisplay();
        }
    }
}

// Resumen del carrito

function updateSummary() {
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const subtotalElements = document.querySelectorAll(".subtotal-price");
    const totalElements = document.querySelectorAll(".total-price");
    
    if (subtotalElements.length >= 2) {
        subtotalElements[1].textContent = `USD ${subtotal}`;
    }
    
    if (totalElements.length >= 2) {
        totalElements[1].textContent = `USD ${subtotal}`;
    }
}

// Agregar productos al carrito

const addButtons = document.querySelectorAll(".btn-card");

addButtons.forEach((button) => {
    button.addEventListener("click", function(e) {
        const productCard = this.closest(".product-card");
        const productImage = productCard.querySelector(".product-card-content img").src;
        const productTitle = productCard.querySelector(".product-card-content h3").textContent;
        const productPriceText = productCard.querySelector(".product-card-price span").textContent;
        const productPrice = parseFloat(productPriceText.replace("USD ", ""));
        const productCategory = productCard.getAttribute("data-category");
        
        const existingProduct = cartItems.find(item => item.title === productTitle);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cartItems.push({
                image: productImage,
                title: productTitle,
                price: productPrice,
                category: productCategory,
                quantity: 1
            });
        }
        
        updateCartDisplay();

        this.textContent = "✓ Agregado";
        this.classList.add("added");
        
        setTimeout(() => {
            this.textContent = "Agregar";
            this.classList.remove("added");
        }, 1000);

    });
});

// Mensaje de compra realizada

const compraRealizada = document.getElementById("compra-realizada");
const btnPagar = document.querySelector(".btn-pay");

compraRealizada.style.display = "none";

function cerrarCompraRealizada() {
    compraRealizada.style.display = "none";
}

const closeCompra = document.getElementById("close-compra-realizada");
if (closeCompra) {
    closeCompra.addEventListener("click", cerrarCompraRealizada);
}

compraRealizada.addEventListener("click", function(e) {
    if (e.target === this) {
        cerrarCompraRealizada();
    }
});

btnPagar.addEventListener("click", function() {
    if (cartItems.length === 0) {
        alert("Tu carrito está vacío. ¡Agregá algunos juegos antes de pagar!");
        return;
    }
    
    cartItems = [];
    updateCartDisplay();
    
    closeCart();
    
    compraRealizada.style.display = "flex";
});

// Carrousel de Reseñas

const contenedorReviews = document.querySelector(".reviews");
const flechaIzquierda = document.querySelector(".icono-flecha--izquierda");
const flechaDerecha = document.querySelector(".icono-flecha--derecha");
const tarjetasOriginales = document.querySelectorAll(".reviews-card");

let tarjetasVisibles = 3;
if (window.innerWidth <= 530) {
    tarjetasVisibles = 1;
} else if (window.innerWidth <= 810) {
    tarjetasVisibles = 2;
}

for (let i = 0; i < tarjetasVisibles; i++) {
    const clonAlFinal = tarjetasOriginales[i].cloneNode(true);
    contenedorReviews.appendChild(clonAlFinal);
}

for (let i = tarjetasOriginales.length - tarjetasVisibles; i < tarjetasOriginales.length; i++) {
    const clonAlPrincipio = tarjetasOriginales[i].cloneNode(true);
    contenedorReviews.insertBefore(clonAlPrincipio, contenedorReviews.firstChild);
}

const todasLasTarjetas = document.querySelectorAll(".reviews-card");
let indiceActual = tarjetasVisibles; 
let estaAnimando = false;

function moverCarrusel(conAnimacion = true) {
    const anchoTarjeta = tarjetasOriginales[0].clientWidth;
    const gap = parseFloat(window.getComputedStyle(contenedorReviews).gap) || 0;
    const desplazamiento = indiceActual * (anchoTarjeta + gap);

    todasLasTarjetas.forEach(tarjeta => {
        tarjeta.style.transition = conAnimacion ? "transform 0.5s ease-in-out" : "none";
        tarjeta.style.transform = `translateX(-${desplazamiento}px)`;
    });
}

moverCarrusel(false);

flechaDerecha.addEventListener("click", () => {
    if (estaAnimando) return;
    estaAnimando = true;
    
    indiceActual++;
    moverCarrusel(true);
});

flechaIzquierda.addEventListener("click", () => {
    if (estaAnimando) return;
    estaAnimando = true;
    
    indiceActual--;
    moverCarrusel(true);
});

contenedorReviews.addEventListener("transitionend", () => {
    estaAnimando = false;

    if (indiceActual >= todasLasTarjetas.length - tarjetasVisibles) {
        indiceActual = tarjetasVisibles;
        moverCarrusel(false);
    }
    
    if (indiceActual <= 0) {
        indiceActual = todasLasTarjetas.length - (tarjetasVisibles * 2);
        moverCarrusel(false);
    }
});

window.addEventListener("resize", () => {
    let nuevasVisibles = 3;
    if (window.innerWidth <= 530) {
        nuevasVisibles = 1;
    } else if (window.innerWidth <= 810) {
        nuevasVisibles = 2;
    }
    
    if (nuevasVisibles !== tarjetasVisibles) {
        window.location.reload();
    } else {
        moverCarrusel(false);
    }
});