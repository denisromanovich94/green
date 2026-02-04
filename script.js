// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');

function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();

// ===== MOBILE MENU =====
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const burger = document.getElementById('burger');

function openMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
        // Calculate scrollbar width and add padding to prevent content shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';

        // Add padding to header to prevent it from shifting
        const header = document.querySelector('.header');
        if (header) {
            header.style.paddingRight = scrollbarWidth + 'px';
        }

        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
    }
}

function closeMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Remove padding from header
        const header = document.querySelector('.header');
        if (header) {
            header.style.paddingRight = '';
        }
    }
}

// Bottom nav "Меню" button
if (mobileNavMenu) {
    mobileNavMenu.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Burger button
if (burger) {
    burger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Close button
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close on overlay click
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking on links
document.querySelectorAll('.mobile-menu__link:not(.mobile-menu__link--expandable)').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Mobile menu expandable items
document.querySelectorAll('.mobile-menu__link--expandable').forEach(btn => {
    btn.addEventListener('click', function() {
        const submenuId = this.dataset.submenu;
        const submenu = document.getElementById(`submenu-${submenuId}`);
        if (submenu) {
            submenu.classList.toggle('active');
            this.classList.toggle('active');
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        }
    });
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextNewYear = new Date(currentYear + 1, 0, 1, 0, 0, 0);

    // If it's already past New Year this year, count to next year
    if (now >= nextNewYear) {
        nextNewYear = new Date(currentYear + 2, 0, 1, 0, 0, 0);
    }

    const diff = nextNewYear - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update all countdown elements
    document.querySelectorAll('.countdown-days, #countdown-days').forEach(el => {
        el.textContent = String(days).padStart(3, '0');
    });
    document.querySelectorAll('.countdown-hours, #countdown-hours').forEach(el => {
        el.textContent = String(hours).padStart(2, '0');
    });
    document.querySelectorAll('.countdown-minutes, #countdown-minutes').forEach(el => {
        el.textContent = String(minutes).padStart(2, '0');
    });
    document.querySelectorAll('.countdown-seconds, #countdown-seconds').forEach(el => {
        el.textContent = String(seconds).padStart(2, '0');
    });

    // Update year
    document.querySelectorAll('.cta-banner__year').forEach(el => {
        el.textContent = nextNewYear.getFullYear();
    });
}

// Initial call and interval
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('elki_cart')) || [];

// Product data
const products = {
    datskaya: {
        name: 'Датская Ёлка (Пихта Нордмана)',
        image: 'vertical.webp',
        sizes: {
            '1-1.25': { price: 10990, label: '1 - 1,25 м' },
            '1.25-1.5': { price: 14990, label: '1,25 - 1,5 м' },
            '1.5-1.75': { price: 17990, label: '1,5 - 1,75 м' },
            '1.75-2': { price: 22990, label: '1,75 - 2 м' },
            '2-2.25': { price: 28990, label: '2 - 2,25 м' },
            '2.25-2.5': { price: 33990, label: '2,25 - 2,5 м' },
            '2.5-2.75': { price: 42990, label: '2,5 - 2,75 м' },
            '2.75-3': { price: 52990, label: '2,75 - 3 м' }
        }
    },
    russkaya: {
        name: 'Русская ёлка (Уральская)',
        image: 'vertical.webp',
        sizes: {
            '1-1.25': { price: 2790, label: '1 - 1,25 м' },
            '1.25-1.5': { price: 3290, label: '1,25 - 1,5 м' },
            '1.5-1.75': { price: 3990, label: '1,5 - 1,75 м' },
            '1.75-2': { price: 4490, label: '1,75 - 2 м' },
            '2-2.25': { price: 4990, label: '2 - 2,25 м' },
            '2.25-2.5': { price: 5490, label: '2,25 - 2,5 м' }
        }
    },
    sosna: {
        name: 'Сосна уральская',
        image: 'vertical.webp',
        sizes: {
            '1-1.25': { price: 4990, label: '1 - 1,25 м' },
            '1.25-1.5': { price: 5490, label: '1,25 - 1,5 м' },
            '1.5-1.75': { price: 5990, label: '1,5 - 1,75 м' },
            '1.75-2': { price: 6990, label: '1,75 - 2 м' }
        }
    },
    frazera: {
        name: 'Пихта Фразера',
        image: 'goiz-bg.webp',
        sizes: {
            '1-1.25': { price: 18990, label: '1 - 1,25 м' },
            '1.25-1.5': { price: 22990, label: '1,25 - 1,5 м' },
            '1.5-1.75': { price: 27990, label: '1,5 - 1,75 м' },
            '1.75-2': { price: 34990, label: '1,75 - 2 м' }
        }
    },
    podstavka: {
        name: 'Подставка для ёлок и пихт',
        image: 'goiz-bg.webp',
        sizes: {
            'do-2m': { price: 990, label: 'до 2-х метров' },
            'ot-2m': { price: 1490, label: 'от 2-х метров' },
            'ot-3m': { price: 5990, label: 'от 3-х метров' }
        }
    },
    zhidkost: {
        name: 'Жидкость против осыпания',
        image: 'goiz-bg.webp',
        price: 590
    },
    lapnik: {
        name: 'Набор веток из пихты (лапник)',
        image: 'goiz-bg.webp',
        price: 790
    },
    kovrik: {
        name: 'Коврик-мешок для ёлок и пихт',
        image: 'goiz-bg.webp',
        price: 990
    }
};

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount, .header__cart-count, .mobile-nav__cart-count').forEach(el => {
        el.textContent = count;
    });
}

function saveCart() {
    localStorage.setItem('elki_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, size = null) {
    const product = products[productId];
    if (!product) return;

    let price, sizeLabel;

    if (product.sizes && size) {
        price = product.sizes[size].price;
        sizeLabel = product.sizes[size].label;
    } else {
        price = product.price;
        sizeLabel = null;
    }

    // Check if item already in cart
    const existingIndex = cart.findIndex(item =>
        item.id === productId && item.size === size
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            image: product.image,
            price: price,
            size: size,
            sizeLabel: sizeLabel,
            quantity: 1
        });
    }

    saveCart();
    showNotification('Товар добавлен в корзину');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart__empty">Корзина пуста</p>';
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart__item">
                <img src="${item.image}" alt="${item.name}" class="cart__item-image">
                <div class="cart__item-info">
                    <div class="cart__item-title">${item.name}</div>
                    ${item.sizeLabel ? `<div class="cart__item-size">${item.sizeLabel}</div>` : ''}
                    <div class="cart__item-price">${formatPrice(item.price)} × ${item.quantity}</div>
                </div>
                <button class="cart__item-remove" onclick="removeFromCart(${index})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    if (cartTotal) cartTotal.textContent = formatPrice(total);
    if (cartFooter) cartFooter.style.display = 'block';
}

// Size selector change handler
document.querySelectorAll('.size-select').forEach(select => {
    select.addEventListener('change', function() {
        const productId = this.dataset.product;
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.dataset.price;

        // Update price display
        const productCard = this.closest('.product-card');
        const priceEl = productCard.querySelector('.product-card__price');
        if (priceEl) {
            priceEl.textContent = formatPrice(parseInt(price));
        }
    });
});

// Add to cart buttons
document.querySelectorAll('.btn--cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const productId = this.dataset.product;
        const productCard = this.closest('.product-card');
        const sizeSelect = productCard ? productCard.querySelector('.size-select') : null;
        const size = sizeSelect ? sizeSelect.value : null;

        addToCart(productId, size);
    });
});

// ===== MODALS =====
const callbackModal = document.getElementById('callbackModal');
const cartModal = document.getElementById('cartModal');

function openModal(modal) {
    if (modal) {
        // Calculate scrollbar width and add padding to prevent content shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';

        // Add padding to header to prevent it from shifting
        const header = document.querySelector('.header');
        if (header) {
            header.style.paddingRight = scrollbarWidth + 'px';
        }

        modal.classList.add('active');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Remove padding from header
        const header = document.querySelector('.header');
        if (header) {
            header.style.paddingRight = '';
        }
    }
}

// Callback modal
const callbackBtn = document.getElementById('callbackBtn');
const modalClose = document.getElementById('modalClose');

if (callbackBtn) {
    callbackBtn.addEventListener('click', () => openModal(callbackModal));
}

if (modalClose) {
    modalClose.addEventListener('click', () => closeModal(callbackModal));
}

// Cart modal
const cartBtn = document.getElementById('cartBtn');
const cartModalClose = document.getElementById('cartModalClose');
const mobileNavCart = document.getElementById('mobileNavCart');
const mobileCartBtn = document.getElementById('mobileCartBtn');

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        renderCart();
        openModal(cartModal);
    });
}

if (mobileNavCart) {
    mobileNavCart.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        openModal(cartModal);
    });
}

if (mobileCartBtn) {
    mobileCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        openModal(cartModal);
    });
}

if (cartModalClose) {
    cartModalClose.addEventListener('click', () => closeModal(cartModal));
}

// Close modals on overlay click
document.querySelectorAll('.modal__overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
        closeMobileMenu();
    }
});

// ===== NOTIFICATION =====
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a5f4a;
        color: white;
        padding: 20px 28px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideUp 0.3s ease;
        font-size: 16px;
        font-weight: 500;
        max-width: 90%;
        min-width: 280px;
    `;

    // Add animation and mobile styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (max-width: 768px) {
            .notification {
                max-width: calc(100% - 32px) !important;
                min-width: calc(100% - 32px) !important;
                width: calc(100% - 32px) !important;
                left: 16px !important;
                transform: translateX(0) !important;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ===== FORM SUBMISSIONS =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const phone = formData.get('phone');

        if (!phone || phone.trim() === '') {
            showNotification('Пожалуйста, введите номер телефона');
            return;
        }

        // Simulate form submission
        showNotification('Спасибо! Мы скоро вам перезвоним');
        this.reset();

        // Close modal if in modal
        const modal = this.closest('.modal');
        if (modal) {
            setTimeout(() => closeModal(modal), 1000);
        }
    });
});

// ===== SEO TEXT TOGGLE =====
const seoTextToggle = document.querySelector('.seo-text__toggle');
const seoTextHidden = document.querySelector('.seo-text__hidden');

if (seoTextToggle && seoTextHidden) {
    seoTextToggle.addEventListener('click', () => {
        seoTextHidden.classList.toggle('active');
        seoTextToggle.classList.toggle('active');

        if (seoTextHidden.classList.contains('active')) {
            seoTextToggle.textContent = 'Скрыть';
        } else {
            seoTextToggle.textContent = 'Показать больше';
        }
    });
}

// ===== FILTERS TOGGLE =====
const filtersToggle = document.getElementById('filtersToggle');
const filtersContent = document.getElementById('filtersContent');
const resetFiltersBtn = document.getElementById('resetFilters');

if (filtersToggle && filtersContent && resetFiltersBtn) {
    filtersToggle.addEventListener('click', () => {
        const isHidden = filtersContent.classList.toggle('hidden');

        // Показываем/скрываем кнопку сброса
        resetFiltersBtn.style.display = isHidden ? 'none' : 'inline-block';

        // Меняем margin-bottom заголовка
        filtersToggle.style.marginBottom = isHidden ? '0' : '20px';
    });

    // Устанавливаем начальное состояние в зависимости от ширины экрана
    if (window.innerWidth < 768) {
        // На мобилке фильтры закрыты по умолчанию
        filtersContent.classList.add('hidden');
        resetFiltersBtn.style.display = 'none';
        filtersToggle.style.marginBottom = '0';
    } else {
        // На десктопе фильтры открыты по умолчанию
        filtersContent.classList.remove('hidden');
        resetFiltersBtn.style.display = 'inline-block';
        filtersToggle.style.marginBottom = '20px';
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Make functions global for onclick handlers
window.removeFromCart = removeFromCart;
