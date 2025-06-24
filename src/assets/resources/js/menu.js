// menu.js - Controlador del menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (!menuButton || !dropdownMenu) {
      console.error('No se encontraron los elementos del menú');
      return;
    }
  
    // Mostrar/ocultar menú al hacer clic en el botón
    menuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
      
      // Opcional: cambiar icono cuando el menú está abierto
      const isOpen = !dropdownMenu.classList.contains('hidden');
      menuButton.setAttribute('aria-expanded', isOpen);
    });
  
    // Ocultar menú al hacer clic fuera
    document.addEventListener('click', function() {
      dropdownMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  
    // Evitar que el menú se cierre al hacer clic dentro
    dropdownMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  
    // Ocultar menú al presionar Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdownMenu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
  
  // cart.js - Controlador del carrito de compras
  document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartButton = document.getElementById('cart-button');
    const cartContainer = document.getElementById('cart-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    
    // Estado del carrito (persistente en localStorage)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mostrar/ocultar carrito
    cartButton.addEventListener('click', function(e) {
      e.stopPropagation();
      cartContainer.classList.toggle('hidden');
    });
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function() {
      cartContainer.classList.add('hidden');
    });
    
    // Evitar que el carrito se cierre al hacer clic dentro
    cartContainer.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Función para guardar el carrito en localStorage
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Función para agregar producto al carrito
    function addToCart(product) {
      // Verificar si el producto ya está en el carrito
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.image || '',
          quantity: 1
        });
      }
      
      updateCart();
      saveCart();
      
      // Mostrar feedback visual
      const button = document.querySelector(`.add-to-cart-btn[data-id="${product.id}"]`);
      if (button) {
        const originalText = button.querySelector('.btn-text').textContent;
        button.innerHTML = '<span class="btn-text">✔️ Agregado</span>';
        
        // Resetear el botón después de 2 segundos
        setTimeout(() => {
          button.innerHTML = `<span class="btn-text">${originalText}</span>`;
        }, 2000);
      }
    }
    
    // Función para eliminar producto del carrito
    function removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      updateCart();
      saveCart();
    }
    
    // Función para actualizar la cantidad de un producto
    function updateQuantity(productId, newQuantity) {
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
          removeFromCart(productId);
        } else {
          updateCart();
          saveCart();
        }
      }
    }
    
    // Función para actualizar la visualización del carrito
    function updateCart() {
      // Actualizar contador
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      
      if (totalItems > 0) {
        cartCount.classList.remove('hidden');
      } else {
        cartCount.classList.add('hidden');
      }
      
      // Actualizar lista de items
      cartItemsContainer.innerHTML = '';
      
      if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        checkoutButton.disabled = true;
      } else {
        emptyCartMessage.classList.add('hidden');
        checkoutButton.disabled = false;
        
        cart.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.className = 'flex items-center py-2 border-b border-gray-600';
          itemElement.innerHTML = `
            ${item.image ? `
              <div class="w-12 h-12 flex-shrink-0 mr-3">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded">
              </div>
            ` : ''}
            <div class="flex-1 min-w-0">
              <h4 class="font-medium truncate">${item.name}</h4>
              <p class="text-sm text-gray-400">$${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="flex items-center ml-2">
              <button class="quantity-btn decrease px-2 py-1 bg-gray-700 rounded-l" data-id="${item.id}">-</button>
              <span class="px-2 py-1 bg-gray-800">${item.quantity}</span>
              <button class="quantity-btn increase px-2 py-1 bg-gray-700 rounded-r" data-id="${item.id}">+</button>
              <button class="remove-btn ml-2 px-2 py-1 bg-red-600 rounded" data-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
              </button>
            </div>
          `;
          cartItemsContainer.appendChild(itemElement);
        });
        
        // Agregar event listeners a los botones recién creados
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
          btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity - 1);
          });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
          btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity + 1);
          });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
          });
        });
      }
      
      // Actualizar total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Evento para finalizar compra
    checkoutButton.addEventListener('click', function() {
      alert('Compra finalizada! Gracias por tu pedido.');
      cart = [];
      updateCart();
      saveCart();
      cartContainer.classList.add('hidden');
    });
    
    // Inicializar carrito al cargar la página
    updateCart();
    
    // Event listeners para todos los botones "Agregar al Carrito"
    document.addEventListener('click', function(e) {
      if (e.target.closest('.add-to-cart-btn')) {
        const button = e.target.closest('.add-to-cart-btn');
        addToCart({
          id: button.getAttribute('data-id'),
          name: button.getAttribute('data-name'),
          price: button.getAttribute('data-price'),
          image: button.getAttribute('data-image')
        });
      }
    });
  });