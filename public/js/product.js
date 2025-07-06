// Product detail page functionality
let currentProduct = null;
let selectedQuantity = 1;

// Load product details
async function loadProductDetails() {
    const productId = window.location.pathname.split('/').pop();
    
    if (!productId) {
        showToast('Product not found', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await apiRequest(`/api/products/${productId}`);
        currentProduct = response;
        
        displayProductDetails();
        updateBreadcrumb();
        loadRelatedProducts();
        
    } catch (error) {
        showToast(error.message, 'error');
        console.error('Error loading product:', error);
    } finally {
        hideLoading();
    }
}

// Display product details
function displayProductDetails() {
    if (!currentProduct) return;
    
    const productDetails = document.getElementById('productDetails');
    if (!productDetails) return;
    
    // Update category hero background
    updateCategoryHero();
    
    productDetails.innerHTML = `
        <div class="product-images">
            <img src="${currentProduct.images[0]}" alt="${currentProduct.name}" class="product-image-main" id="mainImage">
            <div class="product-image-thumbnails">
                ${currentProduct.images.map((image, index) => `
                    <img src="${image}" alt="${currentProduct.name}" class="product-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${image}', ${index})">
                `).join('')}
            </div>
            ${currentProduct.discount > 0 ? `<div class="product-badge badge-sale">-${currentProduct.discount}%</div>` : ''}
            ${currentProduct.featured ? `<div class="product-badge badge-featured">Featured</div>` : ''}
        </div>
        
        <div class="product-info">
            <div class="product-brand">${currentProduct.brand || 'Premium Brand'}</div>
            <h1 class="product-title">${currentProduct.name}</h1>
            
            <div class="product-rating">
                <div class="stars">${generateStars(currentProduct.rating.average)}</div>
                <span class="rating-text">(${currentProduct.rating.count} reviews)</span>
            </div>
            
            <div class="product-price">
                <span class="price-current">$${(currentProduct.discountedPrice || currentProduct.price).toFixed(2)}</span>
                ${currentProduct.discount > 0 ? `<span class="price-original">$${currentProduct.price.toFixed(2)}</span>` : ''}
                ${currentProduct.discount > 0 ? `<span class="price-discount">Save ${currentProduct.discount}%</span>` : ''}
            </div>
            
            <div class="product-description">
                ${currentProduct.description}
            </div>
            
            <div class="product-features">
                <h3>Key Features</h3>
                <ul class="features-list">
                    ${currentProduct.tags?.map(tag => `<li>${tag}</li>`).join('') || '<li>Premium Quality</li><li>Fast Delivery</li><li>Money Back Guarantee</li>'}
                </ul>
            </div>
            
            <div class="product-stock ${currentProduct.stock < 5 ? 'stock-low' : ''} ${currentProduct.stock === 0 ? 'stock-out' : ''}">
                ${currentProduct.stock > 0 ? 
                    `<i class="fas fa-check-circle"></i> ${currentProduct.stock} items in stock` : 
                    '<i class="fas fa-times-circle"></i> Out of stock'
                }
            </div>
            
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateQuantity(${selectedQuantity - 1})">-</button>
                    <input type="number" class="quantity-input" id="quantityInput" value="${selectedQuantity}" min="1" max="${currentProduct.stock}" onchange="updateQuantity(this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${selectedQuantity + 1})">+</button>
                </div>
                
                <button class="add-to-cart-btn" onclick="addToCartDetail()" ${currentProduct.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                
                <button class="wishlist-btn" onclick="addToWishlist()">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Update tab content
    updateTabContent();
}

// Update category hero background
function updateCategoryHero() {
    const categoryHero = document.getElementById('categoryHero');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    
    if (categoryHero && currentProduct) {
        // Remove existing category classes
        categoryHero.classList.remove('category-electronics', 'category-books', 'category-clothing', 'category-home', 'category-sports', 'category-beauty', 'category-toys', 'category-automotive');
        
        // Add category-specific class
        categoryHero.classList.add(`category-${currentProduct.category}`);
        
        // Update title and description
        const categoryInfo = getCategoryInfo(currentProduct.category);
        categoryTitle.textContent = categoryInfo.title;
        categoryDescription.textContent = categoryInfo.description;
    }
}

// Get category information
function getCategoryInfo(category) {
    const categoryInfoMap = {
        'electronics': {
            title: 'Electronics',
            description: 'Discover the latest in technology and innovation'
        },
        'books': {
            title: 'Books',
            description: 'Explore worlds of knowledge and imagination'
        },
        'clothing': {
            title: 'Clothing',
            description: 'Fashion that defines your style'
        },
        'home': {
            title: 'Home & Garden',
            description: 'Create your perfect living space'
        },
        'sports': {
            title: 'Sports & Outdoors',
            description: 'Gear up for your next adventure'
        },
        'beauty': {
            title: 'Beauty & Personal Care',
            description: 'Enhance your natural beauty'
        },
        'toys': {
            title: 'Toys & Games',
            description: 'Fun for kids and adults alike'
        },
        'automotive': {
            title: 'Automotive',
            description: 'Keep your ride running smoothly'
        }
    };
    
    return categoryInfoMap[category] || {
        title: 'Products',
        description: 'Discover amazing products'
    };
}

// Change main product image
function changeMainImage(imageSrc, index) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Update quantity
function updateQuantity(quantity) {
    selectedQuantity = parseInt(quantity);
    if (selectedQuantity < 1) selectedQuantity = 1;
    if (selectedQuantity > currentProduct.stock) selectedQuantity = currentProduct.stock;
    
    document.getElementById('quantityInput').value = selectedQuantity;
}

// Add to cart from product detail page
function addToCartDetail() {
    if (!currentProduct) return;
    addToCart(currentProduct._id, selectedQuantity);
}

// Buy now functionality
function buyNow() {
    if (!currentUser) {
        showToast('Please login to purchase', 'error');
        return;
    }
    
    if (!currentProduct) return;
    
    // Add to cart and redirect to checkout
    addToCart(currentProduct._id, selectedQuantity);
    
    setTimeout(() => {
        window.location.href = '/checkout';
    }, 1000);
}

// Add to wishlist (placeholder)
function addToWishlist() {
    showToast('Wishlist feature coming soon!', 'info');
}

// Update breadcrumb
function updateBreadcrumb() {
    if (!currentProduct) return;
    
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const productBreadcrumb = document.getElementById('productBreadcrumb');
    
    if (categoryBreadcrumb) {
        categoryBreadcrumb.textContent = currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1);
    }
    
    if (productBreadcrumb) {
        productBreadcrumb.textContent = currentProduct.name;
    }
}

// Update tab content
function updateTabContent() {
    if (!currentProduct) return;
    
    // Description tab
    const descriptionTab = document.getElementById('description');
    if (descriptionTab) {
        descriptionTab.innerHTML = `
            <div class="product-description">
                <p>${currentProduct.description}</p>
                ${currentProduct.tags ? `
                    <div class="product-tags">
                        <h4>Tags:</h4>
                        ${currentProduct.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Specifications tab
    const specificationsTab = document.getElementById('specifications');
    if (specificationsTab) {
        if (currentProduct.specifications && Object.keys(currentProduct.specifications).length > 0) {
            specificationsTab.innerHTML = `
                <div class="product-specifications">
                    <table class="specs-table">
                        ${Object.entries(currentProduct.specifications).map(([key, value]) => `
                            <tr>
                                <td class="spec-key">${key}</td>
                                <td class="spec-value">${value}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;
        } else {
            specificationsTab.innerHTML = '<p>No specifications available.</p>';
        }
    }
    
    // Reviews tab
    const reviewsTab = document.getElementById('reviews');
    if (reviewsTab) {
        displayReviews();
    }
}

// Display reviews
function displayReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (currentProduct.reviews && currentProduct.reviews.length > 0) {
        reviewsList.innerHTML = currentProduct.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.user.firstName} ${review.user.lastName}</span>
                    <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="review-rating">${generateStars(review.rating)}</div>
                <div class="review-comment">${review.comment}</div>
            </div>
        `).join('');
    } else {
        reviewsList.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
    }
}

// Load related products
async function loadRelatedProducts() {
    if (!currentProduct) return;
    
    try {
        const response = await apiRequest(`/api/products?category=${currentProduct.category}&limit=4`);
        const relatedProducts = response.products.filter(p => p._id !== currentProduct._id);
        
        displayRelatedProducts(relatedProducts);
        
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Display related products
function displayRelatedProducts(products) {
    const relatedProductsGrid = document.getElementById('relatedProducts');
    if (!relatedProductsGrid) return;
    
    relatedProductsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.images[0]}" alt="${product.name}" class="product-image" onclick="viewProduct('${product._id}')">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.discount > 0 ? `<span class="product-original-price">$${product.price.toFixed(2)}</span>` : ''}
                    $${(product.discountedPrice || product.price).toFixed(2)}
                </div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating.average)}</div>
                    <span class="rating-count">(${product.rating.count})</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart('${product._id}', 1)">Add to Cart</button>
                    <button class="quick-view" onclick="viewProduct('${product._id}')">View</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            const activePane = document.getElementById(tabName);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
}

// Review functionality
function setupReviews() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            if (!currentUser) {
                showToast('Please login to add a review', 'error');
                return;
            }
            showReviewModal();
        });
    }
}

function showReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.style.display = 'block';
        setupReviewForm();
    }
}

function setupReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;
    
    // Star rating functionality
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStarRating(selectedRating);
        });
        
        star.addEventListener('mouseover', () => {
            updateStarRating(index + 1);
        });
    });
    
    // Reset star rating on mouse leave
    document.querySelector('.star-rating').addEventListener('mouseleave', () => {
        updateStarRating(selectedRating);
    });
    
    // Form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (selectedRating === 0) {
                showToast('Please select a rating', 'error');
                return;
            }
            
            const comment = document.getElementById('reviewComment').value;
            
            try {
                await apiRequest(`/api/products/${currentProduct._id}/reviews`, {
                    method: 'POST',
                    body: JSON.stringify({
                        rating: selectedRating,
                        comment: comment
                    })
                });
                
                showToast('Review added successfully!');
                closeModal();
                
                // Reload product to show new review
                setTimeout(() => {
                    loadProductDetails();
                }, 1000);
                
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('reviewModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function closeModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize product page
function initializeProductPage() {
    checkAuth();
    loadProductDetails();
    setupTabs();
    setupReviews();
    setupModal();
    updateCartCount();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProductPage);
