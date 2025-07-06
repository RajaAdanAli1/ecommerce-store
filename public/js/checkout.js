// Checkout functionality
let checkoutData = {
    step: 1,
    shippingAddress: {},
    billingAddress: {},
    paymentMethod: 'credit_card',
    cartItems: [],
    totals: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
    }
};

// Initialize checkout page
function initializeCheckout() {
    checkAuth();
    
    if (!currentUser) {
        showToast('Please login to checkout', 'error');
        window.location.href = '/login';
        return;
    }
    
    loadCheckoutData();
    setupCheckoutForm();
    setupPaymentMethodHandlers();
    setupStepNavigation();
}

// Load checkout data
async function loadCheckoutData() {
    try {
        showLoading();
        const response = await apiRequest('/api/cart');
        
        if (!response.items || response.items.length === 0) {
            showToast('Your cart is empty', 'error');
            window.location.href = '/cart';
            return;
        }
        
        checkoutData.cartItems = response.items;
        calculateTotals();
        displayCheckoutItems();
        updateCheckoutSummary();
        
    } catch (error) {
        showToast(error.message, 'error');
        console.error('Error loading checkout data:', error);
    } finally {
        hideLoading();
    }
}

// Calculate totals
function calculateTotals() {
    checkoutData.totals.subtotal = checkoutData.cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    );
    
    checkoutData.totals.shipping = checkoutData.totals.subtotal > 50 ? 0 : 10;
    checkoutData.totals.tax = checkoutData.totals.subtotal * 0.08;
    checkoutData.totals.total = checkoutData.totals.subtotal + checkoutData.totals.shipping + checkoutData.totals.tax;
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = checkoutData.cartItems.map(item => `
        <div class="checkout-item">
            <img src="${item.product.images[0]}" alt="${item.product.name}" class="checkout-item-image">
            <div class="checkout-item-details">
                <div class="checkout-item-title">${item.product.name}</div>
                <div class="checkout-item-price">$${item.price.toFixed(2)}</div>
                <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
            </div>
        </div>
    `).join('');
}

// Update checkout summary
function updateCheckoutSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${checkoutData.totals.subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${checkoutData.totals.shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${checkoutData.totals.tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${checkoutData.totals.total.toFixed(2)}`;
}

// Setup checkout form
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;
    
    // Pre-fill with user data if available
    if (currentUser) {
        const fields = ['firstName', 'lastName'];
        fields.forEach(field => {
            const input = document.getElementById(`shipping${field.charAt(0).toUpperCase() + field.slice(1)}`);
            if (input && currentUser[field]) {
                input.value = currentUser[field];
            }
        });
        
        // Pre-fill address if available
        if (currentUser.address) {
            const addressFields = ['street', 'city', 'state', 'zipCode', 'country', 'phone'];
            addressFields.forEach(field => {
                const input = document.getElementById(`shipping${field.charAt(0).toUpperCase() + field.slice(1)}`);
                if (input && currentUser.address[field]) {
                    input.value = currentUser.address[field];
                }
            });
        }
    }
    
    // Form validation
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

// Handle checkout form submission
async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    if (checkoutData.step < 3) {
        return; // Form submission should only happen on final step
    }
    
    // Collect form data
    const formData = new FormData(e.target);
    const orderData = {
        paymentMethod: checkoutData.paymentMethod,
        shippingAddress: {
            firstName: formData.get('shippingFirstName'),
            lastName: formData.get('shippingLastName'),
            street: formData.get('shippingStreet'),
            city: formData.get('shippingCity'),
            state: formData.get('shippingState'),
            zipCode: formData.get('shippingZip'),
            country: formData.get('shippingCountry'),
            phone: formData.get('shippingPhone')
        },
        billingAddress: checkoutData.billingAddress
    };
    
    // Use shipping address as billing if same as shipping is checked
    const sameAsShipping = document.getElementById('sameAsShipping');
    if (sameAsShipping && sameAsShipping.checked) {
        orderData.billingAddress = orderData.shippingAddress;
    }
    
    try {
        showLoading();
        const response = await apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        showToast('Order placed successfully!');
        
        // Redirect to order confirmation or orders page
        setTimeout(() => {
            window.location.href = '/orders';
        }, 2000);
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Setup payment method handlers
function setupPaymentMethodHandlers() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            checkoutData.paymentMethod = e.target.value;
            
            // Show/hide card details based on payment method
            if (cardDetails) {
                if (e.target.value === 'credit_card' || e.target.value === 'debit_card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            }
        });
    });
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
    
    // Format CVV input
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', formatCVV);
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    e.target.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Format CVV
function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
}

// Setup step navigation
function setupStepNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', previousStep);
    }
    
    updateStepUI();
}

// Navigate to next step
function nextStep() {
    if (checkoutData.step === 1) {
        // Validate shipping information
        if (!validateShippingInfo()) {
            return;
        }
        
        checkoutData.step = 2;
        showPaymentSection();
    } else if (checkoutData.step === 2) {
        // Validate payment information
        if (!validatePaymentInfo()) {
            return;
        }
        
        checkoutData.step = 3;
        showReviewSection();
    }
    
    updateStepUI();
}

// Navigate to previous step
function previousStep() {
    if (checkoutData.step === 2) {
        checkoutData.step = 1;
        showShippingSection();
    } else if (checkoutData.step === 3) {
        checkoutData.step = 2;
        showPaymentSection();
    }
    
    updateStepUI();
}

// Show shipping section
function showShippingSection() {
    const shippingSection = document.getElementById('shippingSection');
    const paymentSection = document.getElementById('paymentSection');
    const reviewSection = document.getElementById('reviewSection');
    
    if (shippingSection) shippingSection.style.display = 'block';
    if (paymentSection) paymentSection.style.display = 'none';
    if (reviewSection) reviewSection.style.display = 'none';
}

// Show payment section
function showPaymentSection() {
    const shippingSection = document.getElementById('shippingSection');
    const paymentSection = document.getElementById('paymentSection');
    const reviewSection = document.getElementById('reviewSection');
    
    if (shippingSection) shippingSection.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'block';
    if (reviewSection) reviewSection.style.display = 'none';
}

// Show review section
function showReviewSection() {
    const shippingSection = document.getElementById('shippingSection');
    const paymentSection = document.getElementById('paymentSection');
    const reviewSection = document.getElementById('reviewSection');
    
    if (shippingSection) shippingSection.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'none';
    if (reviewSection) reviewSection.style.display = 'block';
    
    displayOrderReview();
}

// Display order review
function displayOrderReview() {
    const orderReview = document.getElementById('orderReview');
    if (!orderReview) return;
    
    const formData = new FormData(document.getElementById('checkoutForm'));
    
    orderReview.innerHTML = `
        <div class="review-section">
            <h4>Shipping Address</h4>
            <div class="address-display">
                <p>${formData.get('shippingFirstName')} ${formData.get('shippingLastName')}</p>
                <p>${formData.get('shippingStreet')}</p>
                <p>${formData.get('shippingCity')}, ${formData.get('shippingState')} ${formData.get('shippingZip')}</p>
                <p>${formData.get('shippingCountry')}</p>
                <p>Phone: ${formData.get('shippingPhone')}</p>
            </div>
        </div>
        
        <div class="review-section">
            <h4>Payment Method</h4>
            <p>${getPaymentMethodDisplay(checkoutData.paymentMethod)}</p>
        </div>
        
        <div class="review-section">
            <h4>Order Items</h4>
            <div class="review-items">
                ${checkoutData.cartItems.map(item => `
                    <div class="review-item">
                        <img src="${item.product.images[0]}" alt="${item.product.name}" class="review-item-image">
                        <div class="review-item-info">
                            <h5>${item.product.name}</h5>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Get payment method display name
function getPaymentMethodDisplay(method) {
    const methods = {
        'credit_card': 'Credit Card',
        'debit_card': 'Debit Card',
        'paypal': 'PayPal',
        'cash_on_delivery': 'Cash on Delivery'
    };
    return methods[method] || method;
}

// Update step UI
function updateStepUI() {
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    // Update step indicators
    steps.forEach((step, index) => {
        if (index + 1 === checkoutData.step) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update button visibility
    if (backBtn) {
        backBtn.style.display = checkoutData.step > 1 ? 'block' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = checkoutData.step < 3 ? 'block' : 'none';
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.style.display = checkoutData.step === 3 ? 'block' : 'none';
    }
}

// Validate shipping information
function validateShippingInfo() {
    const requiredFields = [
        'shippingFirstName', 'shippingLastName', 'shippingStreet',
        'shippingCity', 'shippingState', 'shippingZip', 'shippingCountry', 'shippingPhone'
    ];
    
    for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (!input || !input.value.trim()) {
            showToast(`Please fill in all shipping fields`, 'error');
            if (input) input.focus();
            return false;
        }
    }
    
    return true;
}

// Validate payment information
function validatePaymentInfo() {
    if (checkoutData.paymentMethod === 'credit_card' || checkoutData.paymentMethod === 'debit_card') {
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');
        const cardName = document.getElementById('cardName');
        
        if (!cardNumber || !cardNumber.value.trim()) {
            showToast('Please enter card number', 'error');
            return false;
        }
        
        if (!expiryDate || !expiryDate.value.trim()) {
            showToast('Please enter expiry date', 'error');
            return false;
        }
        
        if (!cvv || !cvv.value.trim()) {
            showToast('Please enter CVV', 'error');
            return false;
        }
        
        if (!cardName || !cardName.value.trim()) {
            showToast('Please enter name on card', 'error');
            return false;
        }
    }
    
    return true;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCheckout);
