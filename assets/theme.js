// Modern 3D Printing Theme JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarNav = document.querySelector('.navbar-nav');
    
    if (navbarToggle && navbarNav) {
        navbarToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('active');
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.portfolio-item, .material-card, .faq-item');
    animateElements.forEach(el => observer.observe(el));
    
    // Material comparison functionality
    const materialCards = document.querySelectorAll('.material-card');
    
    materialCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            // Update compare button visibility
            const selectedCards = document.querySelectorAll('.material-card.selected');
            const compareButton = document.querySelector('.compare-materials-btn');
            
            if (compareButton) {
                if (selectedCards.length >= 2) {
                    compareButton.style.display = 'inline-flex';
                } else {
                    compareButton.style.display = 'none';
                }
            }
        });
    });
    
    // Portfolio filter functionality
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (portfolioFilters.length > 0) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filter
                portfolioFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        });
    }
    
    function performSearch(query) {
        // This would typically make an API call to Shopify
        console.log('Searching for:', query);
        // Placeholder for search implementation
    }
    
    // Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const variantId = this.getAttribute('data-variant-id');
            const quantity = 1;
            
            // Add to cart via Shopify AJAX API
            fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: quantity
                })
            })
            .then(response => response.json())
            .then(data => {
                updateCartUI();
                showNotification('Product added to cart!', 'success');
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                showNotification('Error adding product to cart', 'error');
            });
        });
    });
    
    function updateCartUI() {
        // Update cart count and total
        fetch('/cart.js')
            .then(response => response.json())
            .then(cart => {
                const cartCount = document.querySelector('.cart-count');
                const cartTotal = document.querySelector('.cart-total');
                
                if (cartCount) {
                    cartCount.textContent = cart.item_count;
                }
                
                if (cartTotal) {
                    cartTotal.textContent = formatMoney(cart.total_price);
                }
            });
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    function formatMoney(cents) {
        return '$' + (cents / 100).toFixed(2);
    }
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Form validation
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                form.submit();
            }
        });
    });
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                const errorMessage = field.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
            } else {
                field.classList.remove('error');
                
                const errorMessage = field.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
        });
        
        return isValid;
    }
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = heroSection.querySelector('.hero-content');
            
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
    
    // Initialize everything
    initSeasonalAutoSwitching();
    updateCartUI();

    function initSeasonalAutoSwitching() {
        const root = document.querySelector('[data-seasonal-auto]');
        if (!root) return;

        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        let season = 'evergreen';
        let label = 'Precision 3D Printing';
        let message = 'Custom prototypes, functional parts, and production-ready fabrication.';

        if (month === 10) {
            season = 'halloween';
            label = 'Halloween Builds';
            message = 'Props, cosplay parts, themed decor, and spooky fabrication requests.';
        } else if (month === 11 && day >= 1 && day <= 30) {
            season = day >= 20 ? 'black-friday' : 'thanksgiving';
            label = day >= 20 ? 'Black Friday Fabrication Deals' : 'Thanksgiving Production Window';
            message = day >= 20 ? 'Limited-time deals for prototypes, gifts, and production runs.' : 'Seasonal gifts, table decor, and maker projects before the holiday rush.';
        } else if (month === 12) {
            season = 'christmas';
            label = 'Christmas Custom Prints';
            message = 'Personalized gifts, ornaments, display pieces, and holiday production slots.';
        } else if (month === 2 && day <= 14) {
            season = 'valentines';
            label = 'Valentine Custom Gifts';
            message = 'Personalized keepsakes, miniatures, and custom-designed gifts.';
        } else if (month === 3 || month === 4) {
            season = 'spring-easter';
            label = 'Spring & Easter Prints';
            message = 'Fresh seasonal decor, prototypes, garden parts, and family gifts.';
        } else if (month >= 6 && month <= 8) {
            season = 'summer';
            label = 'Summer Maker Season';
            message = 'Outdoor parts, cosplay builds, event displays, and durable PETG projects.';
        } else if (month === 5 && day >= 1 && day <= 14) {
            season = 'mothers-day';
            label = 'Mother’s Day Custom Gifts';
            message = 'Personalized keepsakes and thoughtful 3D printed gifts.';
        } else if (month === 6 && day >= 1 && day <= 21) {
            season = 'fathers-day';
            label = 'Father’s Day Functional Gifts';
            message = 'Desk tools, garage upgrades, display models, and custom accessories.';
        }

        document.body.dataset.season = season;
        document.documentElement.style.setProperty('--seasonal-label', `"${label}"`);

        const campaign = document.querySelector('.kg-seasonal-auto-message');
        if (campaign) {
            campaign.querySelector('[data-season-label]').textContent = label;
            campaign.querySelector('[data-season-message]').textContent = message;
            const link = campaign.querySelector('[data-season-link]');
            if (link) {
                link.href = `/search?q=${encodeURIComponent(season)}&type=product`;
            }
            campaign.hidden = false;
        }
    }
});
