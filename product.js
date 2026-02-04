// ===== PRODUCT PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Image Gallery
    initGallery();

    // Product Tabs
    initProductTabs();

    // SEO Text Toggle
    initSeoText();

    // Size Selector Highlighting
    initSizeSelector();
});

// ===== IMAGE GALLERY =====
function initGallery() {
    const mainImage = document.querySelector('.product__gallery-main img');
    const thumbs = document.querySelectorAll('.product__thumb');

    if (!mainImage || thumbs.length === 0) return;

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Update main image
            const thumbImg = this.querySelector('img');
            if (thumbImg) {
                mainImage.src = thumbImg.src;
                mainImage.alt = thumbImg.alt;
            }

            // Update active state
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== PRODUCT TABS =====
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.product-tabs__btn');
    const tabPanes = document.querySelectorAll('.product-tabs__pane');

    if (tabButtons.length === 0 || tabPanes.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;

            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update panes
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// ===== SEO TEXT TOGGLE =====
function initSeoText() {
    const seoContent = document.querySelector('.seo-text__content');
    const seoBtn = document.querySelector('.seo-text__btn');

    if (!seoContent || !seoBtn) return;

    seoBtn.addEventListener('click', function() {
        seoContent.classList.toggle('expanded');

        if (seoContent.classList.contains('expanded')) {
            this.textContent = 'Скрыть';
        } else {
            this.textContent = 'Читать далее';
        }
    });
}

// ===== SIZE SELECTOR =====
function initSizeSelector() {
    const sizeButtons = document.querySelectorAll('.product__size');

    if (sizeButtons.length === 0) return;

    // Get current URL to highlight active size
    const currentUrl = window.location.pathname;

    sizeButtons.forEach(button => {
        const link = button.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            // Check if this is the current page
            if (currentUrl.includes(href) || href === currentUrl) {
                button.classList.add('active');
            }
        }
    });
}

// ===== ADD TO CART FROM PRODUCT PAGE =====
function addToCartFromProduct() {
    // Get product info from page
    const productTitle = document.querySelector('.product__title');
    const productPrice = document.querySelector('.product__price');
    const activeSize = document.querySelector('.product__size.active');
    const mainImage = document.querySelector('.product__gallery-main img');

    if (!productTitle || !productPrice) return;

    // Extract size from active button or URL
    let size = '150-175';
    if (activeSize) {
        size = activeSize.textContent.trim().replace(' см', '');
    }

    // Extract price number
    const priceText = productPrice.textContent;
    const price = parseInt(priceText.replace(/\D/g, ''));

    // Get product ID from URL or data attribute
    const pathname = window.location.pathname;
    let productId = 'datskaya';

    if (pathname.includes('nordmana')) productId = 'nordmana';
    else if (pathname.includes('frazera')) productId = 'frazera';
    else if (pathname.includes('russkaya')) productId = 'russkaya';
    else if (pathname.includes('sosna')) productId = 'sosna';

    // Create cart item
    const cartItem = {
        id: productId,
        name: productTitle.textContent,
        size: size,
        price: price,
        image: mainImage ? mainImage.src : 'images/vertical.webp',
        quantity: 1
    };

    // Add to cart (using function from main script.js)
    if (typeof addToCart === 'function') {
        addToCart(productId, size);
    } else {
        // Fallback if main script not loaded
        let cart = JSON.parse(localStorage.getItem('elki_cart')) || [];

        // Check if item already exists
        const existingIndex = cart.findIndex(item =>
            item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity++;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('elki_cart', JSON.stringify(cart));

        // Update cart count
        const cartCounts = document.querySelectorAll('.header__cart-count, .mobile-nav__cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounts.forEach(count => {
            count.textContent = totalItems;
            if (totalItems > 0) {
                count.style.display = 'flex';
            }
        });

        // Show notification
        showNotification('Товар добавлен в корзину!');
    }
}

// ===== NOTIFICATION =====
function showNotification(message) {
    // Check if notification function exists in main script
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message);
        return;
    }

    // Create notification element
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== CALLBACK FORM SUBMISSION =====
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('callback-form')) {
        e.preventDefault();

        const form = e.target;
        const phone = form.querySelector('input[type="tel"]').value;

        if (phone.length >= 10) {
            showNotification('Спасибо! Мы перезвоним вам в ближайшее время.');
            form.reset();

            // Close modal if in modal
            const modal = form.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        } else {
            showNotification('Пожалуйста, введите корректный номер телефона');
        }
    }
});

// ===== RELATED PRODUCTS CART =====
document.querySelectorAll('.product-card-mini .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();

        const card = this.closest('.product-card-mini');
        const productId = card.dataset.product || 'datskaya';
        const size = '150-175'; // Default size

        if (typeof addToCart === 'function') {
            addToCart(productId, size);
        } else {
            addToCartFromProduct();
        }
    });
});
