// Global variables
let currentUser = null;
let cart = { items: [], totalAmount: 0 };
let products = [];
let currentPage = 1;
let totalPages = 1;
let filters = {
    category: '',
    brand: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
};

// API base URL
const API_BASE = '';

// Utility functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Add CSS animation for toast
if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// API helper functions
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    };
    
    const response = await fetch(API_BASE + url, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
}

// User authentication functions
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        updateUserUI();
    }
}

function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = currentUser.firstName;
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Product functions
async function loadProducts() {
    try {
        showLoading();
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.brand) queryParams.append('brand', filters.brand);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.sort) queryParams.append('sort', filters.sort);
        queryParams.append('page', currentPage);
        queryParams.append('limit', 12);
        
        const response = await apiRequest(`/api/products?${queryParams}`);
        products = response.products;
        totalPages = response.pagination.pages;
        
        displayProducts();
        updatePagination();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    } finally {
        hideLoading();
    }
}

async function loadFeaturedProducts() {
    try {
        const response = await apiRequest('/api/products/featured');
        displayFeaturedProducts(response);
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

async function loadCategories() {
    try {
        const response = await apiRequest('/api/products/categories');
        displayCategories(response);
        updateCategoryFilter(response);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadBrands() {
    try {
        const response = await apiRequest('/api/products/brands');
        updateBrandFilter(response);
    } catch (error) {
        console.error('Error loading brands:', error);
    }
}

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card fade-in">
            <div class="product-card-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-card-image" onclick="viewProduct('${product._id}')">
                ${product.discount > 0 ? `<div class="product-badge badge-sale">-${product.discount}%</div>` : ''}
                ${product.featured ? `<div class="product-badge badge-featured">Featured</div>` : ''}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <div class="product-card-brand">${product.brand || 'Premium Brand'}</div>
                <div class="product-card-price">
                    <span class="price-current">$${(product.discountedPrice || product.price).toFixed(2)}</span>
                    ${product.discount > 0 ? `<span class="price-original">$${product.price.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating.average)}</div>
                    <span class="rating-count">(${product.rating.count})</span>
                </div>
                <div class="product-card-actions">
                    <button class="product-card-btn btn-primary" onclick="addToCart('${product._id}', 1)">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="product-card-btn btn-outline" onclick="viewProduct('${product._id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function displayFeaturedProducts(products) {
    const grid = document.getElementById('featuredProducts');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card slide-up">
            <div class="product-card-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="product-card-image" onclick="viewProduct('${product._id}')">
                <div class="product-badge badge-featured">Featured</div>
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <div class="product-card-brand">${product.brand || 'Premium Brand'}</div>
                <div class="product-card-price">
                    <span class="price-current">$${(product.discountedPrice || product.price).toFixed(2)}</span>
                    ${product.discount > 0 ? `<span class="price-original">$${product.price.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating.average)}</div>
                    <span class="rating-count">(${product.rating.count})</span>
                </div>
                <div class="product-card-actions">
                    <button class="product-card-btn btn-primary" onclick="addToCart('${product._id}', 1)">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="product-card-btn btn-outline" onclick="viewProduct('${product._id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function displayCategories(categories) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    const categoryIcons = {
        electronics: 'fa-laptop',
        clothing: 'fa-tshirt',
        books: 'fa-book',
        home: 'fa-home',
        sports: 'fa-futbol',
        beauty: 'fa-spa',
        toys: 'fa-gamepad',
        automotive: 'fa-car'
    };
    
    grid.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory('${category}')">
            <i class="fas ${categoryIcons[category] || 'fa-tag'}"></i>
            <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <p>Shop ${category} products</p>
        </div>
    `).join('');
}

function updateCategoryFilter(categories) {
    const select = document.getElementById('categoryFilter');
    if (!select) return;
    
    const options = categories.map(category => 
        `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">All Categories</option>' + options;
}

function updateBrandFilter(brands) {
    const select = document.getElementById('brandFilter');
    if (!select) return;
    
    const options = brands.map(brand => 
        `<option value="${brand}">${brand}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">All Brands</option>' + options;
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    let html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="active">${i}</button>`;
        } else {
            html += `<button onclick="changePage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }
    
    pagination.innerHTML = html;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Event handlers
function viewProduct(productId) {
    window.location.href = `/product/${productId}`;
}

function filterByCategory(category) {
    filters.category = category;
    currentPage = 1;
    
    // Update category filter UI
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    loadProducts();
}

function changePage(page) {
    currentPage = page;
    loadProducts();
}

function clearFilters() {
    filters = {
        category: '',
        brand: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sort: ''
    };
    
    // Reset form elements
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const sortBy = document.getElementById('sortBy');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) categoryFilter.value = '';
    if (brandFilter) brandFilter.value = '';
    if (priceMin) priceMin.value = '';
    if (priceMax) priceMax.value = '';
    if (sortBy) sortBy.value = '';
    if (searchInput) searchInput.value = '';
    
    currentPage = 1;
    loadProducts();
}

// Initialize page
function initializePage() {
    checkAuth();
    
    // Load initial data
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
    
    if (document.getElementById('categoriesGrid')) {
        loadCategories();
    }
    
    if (document.getElementById('productsGrid')) {
        loadProducts();
        loadBrands();
    }
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            filters.search = searchInput.value;
            currentPage = 1;
            loadProducts();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                filters.search = searchInput.value;
                currentPage = 1;
                loadProducts();
            }
        });
    }
    
    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const sortBy = document.getElementById('sortBy');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            filters.category = categoryFilter.value;
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (brandFilter) {
        brandFilter.addEventListener('change', () => {
            filters.brand = brandFilter.value;
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (priceMin) {
        priceMin.addEventListener('change', () => {
            filters.minPrice = priceMin.value;
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (priceMax) {
        priceMax.addEventListener('change', () => {
            filters.maxPrice = priceMax.value;
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', () => {
            filters.sort = sortBy.value;
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Navigation
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const cartBtn = document.getElementById('cartBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = '/register';
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = '/cart';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUserUI();
    showToast('Logged out successfully');
    window.location.href = '/';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
