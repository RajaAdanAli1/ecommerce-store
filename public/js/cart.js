// Cart management functions
let cartItems = [];
let cartTotal = 0;

// Add item to cart
async function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showToast('Please login to add items to cart', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await apiRequest('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
        
        showToast('Item added to cart!');
        updateCartCount();
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Update cart item quantity
async function updateCartItem(productId, quantity) {
    if (!currentUser) {
        showToast('Please login to update cart', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await apiRequest(`/api/cart/update/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
        
        showToast('Cart updated!');
        if (window.location.pathname === '/cart') {
            loadCart();
        }
        updateCartCount();
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Remove item from cart
async function removeFromCart(productId) {
    if (!currentUser) {
        showToast('Please login to remove items from cart', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await apiRequest(`/api/cart/remove/${productId}`, {
            method: 'DELETE'
        });
        
        showToast('Item removed from cart!');
        if (window.location.pathname === '/cart') {
            loadCart();
        }
        updateCartCount();
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Clear entire cart
async function clearCart() {
    if (!currentUser) {
        showToast('Please login to clear cart', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear your cart?')) {
        return;
    }
    
    try {
        showLoading();
        const response = await apiRequest('/api/cart/clear', {
            method: 'DELETE'
        });
        
        showToast('Cart cleared!');
        if (window.location.pathname === '/cart') {
            loadCart();
        }
        updateCartCount();
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Load cart data
async function loadCart() {
    if (!currentUser) {
        displayEmptyCart();
        return;
    }
    
    try {
        showLoading();
        const response = await apiRequest('/api/cart');
        cartItems = response.items || [];
        cartTotal = response.totalAmount || 0;
        
        if (cartItems.length === 0) {
            displayEmptyCart();
        } else {
            displayCartItems();
            updateCartSummary();
        }
        
    } catch (error) {
        console.error('Error loading cart:', error);
        displayEmptyCart();
    } finally {
        hideLoading();
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (emptyCart) emptyCart.style.display = 'none';
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.product.images[0]}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.product.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartItem('${item.product._id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItem('${item.product._id}', this.value)">
                        <button class="quantity-btn" onclick="updateCartItem('${item.product._id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.product._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display empty cart
function displayEmptyCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update cart count in navigation
async function updateCartCount() {
    if (!currentUser) {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) cartCount.textContent = '0';
        return;
    }
    
    try {
        const response = await apiRequest('/api/cart');
        const itemCount = response.items ? response.items.reduce((count, item) => count + item.quantity, 0) : 0;
        
        const cartCount = document.getElementById('cartCount');
        if (cartCount) cartCount.textContent = itemCount;
        
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Quick add to cart with quantity selector
function showQuickAddModal(productId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add to Cart</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="quantity-selector">
                    <label for="modalQuantity">Quantity:</label>
                    <input type="number" id="modalQuantity" value="1" min="1" max="99">
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="addToCartFromModal('${productId}')">Add to Cart</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function addToCartFromModal(productId) {
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    closeModal();
    addToCart(productId, quantity);
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Initialize cart functionality
function initializeCart() {
    updateCartCount();
    
    if (window.location.pathname === '/cart') {
        loadCart();
        
        // Set up checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (!currentUser) {
                    showToast('Please login to checkout', 'error');
                    return;
                }
                
                if (cartItems.length === 0) {
                    showToast('Your cart is empty', 'error');
                    return;
                }
                
                window.location.href = '/checkout';
            });
        }
    }
}

// Cart page specific functions
function setupCartPage() {
    initializeCart();
    
    // Add clear cart button functionality
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Add continue shopping functionality
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/cart') {
        setupCartPage();
    } else {
        updateCartCount();
    }
});
