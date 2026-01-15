// DOM Elements
const loaderContainer = document.querySelector('.loader-container');
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const backToTopBtn = document.getElementById('back-to-top');
const header = document.querySelector('header');
const filterButtons = document.querySelectorAll('.filter-btn');
const plantCards = document.querySelectorAll('.plant-card');
const counters = document.querySelectorAll('.counter');
const typedText = document.querySelector('.typed-text');
const cartCount = document.querySelector('.cart-count');
const viewButtons = document.querySelectorAll('.view-btn');
const plantsGrid = document.getElementById('plants-grid');

// Words for typing animation
const words = ['Kesehatan', 'Kebahagiaan', 'Keindahan', 'Ketenangan'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        loaderContainer.style.opacity = '0';
        setTimeout(() => {
            loaderContainer.style.display = 'none';
        }, 500);
    }, 1000);
});

// Custom Cursor
window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    
    setTimeout(() => {
        cursorOutline.style.left = `${e.clientX}px`;
        cursorOutline.style.top = `${e.clientY}px`;
    }, 100);
});

// Click effects on cursor
document.addEventListener('click', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
});

// Mobile Navigation
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTopBtn.classList.add('active');
    } else {
        header.classList.remove('scrolled');
        backToTopBtn.classList.remove('active');
    }
});

// Back to Top
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Filter plants
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        plantCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Counter Animation
function startCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const increment = target / 200;
    let current = 0;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.floor(current);
            setTimeout(updateCounter, 10);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCounter();
}

// Start counters when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => startCounter(counter));
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (counters.length > 0) {
    observer.observe(counters[0].closest('section'));
}

// Typing Animation
function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (!isDeleting && charIndex < currentWord.length) {
        // Typing
        typedText.textContent += currentWord.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        typedText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        // Switch between typing and deleting
        isDeleting = !isDeleting;
        
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        setTimeout(typeEffect, isDeleting ? 1000 : 200);
    }
}

// Start typing animation
if (typedText) {
    setTimeout(typeEffect, 1000);
}

// Wishlist toggle
document.querySelectorAll('.plant-wishlist').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('fa-regular')) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            button.classList.add('active');
            showNotification('Tanaman ditambahkan ke wishlist');
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            button.classList.remove('active');
            showNotification('Tanaman dihapus dari wishlist');
        }
    });
});

// Add to cart
document.querySelectorAll('.plant-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
        showNotification('Tanaman ditambahkan ke keranjang');
    });
});

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// View toggle for catalog
if (viewButtons.length > 0) {
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.getAttribute('data-view');
            plantsGrid.className = `catalog-grid ${view}-view`;
        });
    });
}

// Cart modal
const cartModal = document.getElementById('cart-modal');
const modalClose = document.querySelector('.modal-close');

document.querySelector('.cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.add('active');
});

modalClose.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Initialize with sample plants for catalog page
if (plantsGrid) {
    const samplePlants = [
        {
            name: "Monstera Deliciosa",
            category: "indoor",
            price: "Rp 150.000",
            image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Tanaman hias dengan daun unik berlubang, cocok untuk ruang tamu atau kantor."
        },
        {
            name: "Lidah Mertua",
            category: "sukulen",
            price: "Rp 60.000",
            image: "https://images.unsplash.com/photo-1545243421-89e5c9b6d12c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Tanaman pembersih udara yang sangat efektif. Tahan kekeringan."
        },
        {
            name: "Anggrek Bulan",
            category: "bunga",
            price: "Rp 120.000",
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Anggrek dengan bunga indah yang tahan lama."
        },
        {
            name: "Pohon Uang",
            category: "outdoor",
            price: "Rp 250.000",
            image: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Dipercaya membawa keberuntungan dan kemakmuran."
        },
        {
            name: "Peace Lily",
            category: "indoor",
            price: "Rp 85.000",
            image: "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Tanaman dengan bunga putih yang elegan dan pembersih udara alami."
        },
        {
            name: "Kaktus Natal",
            category: "sukulen",
            price: "Rp 75.000",
            image: "https://images.unsplash.com/photo-1517232115160-ff293b5b4604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Kaktus yang berbunga indah dengan perawatan mudah."
        }
    ];
    
    samplePlants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.className = 'plant-card';
        plantCard.setAttribute('data-category', plant.category);
        
        plantCard.innerHTML = `
            <div class="plant-wishlist"><i class="fa-regular fa-heart"></i></div>
            <div class="plant-image">
                <img src="${plant.image}" alt="${plant.name}">
            </div>
            <div class="plant-content">
                <div class="plant-info">
                    <div class="plant-type">${plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}</div>
                    <div class="plant-light">
                        <i class="fas fa-sun"></i>
                        <span>Cahaya Sedang</span>
                    </div>
                </div>
                <h3 class="plant-title">${plant.name}</h3>
                <p class="plant-description">${plant.description}</p>
                <div class="plant-footer">
                    <div class="plant-price">${plant.price}</div>
                    <button class="plant-btn">Tambah ke Keranjang</button>
                </div>
            </div>
        `;
        
        plantsGrid.appendChild(plantCard);
    });
    
    // Reattach event listeners to new elements
    document.querySelectorAll('.plant-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = button.querySelector('i');
            
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                button.classList.add('active');
                showNotification('Tanaman ditambahkan ke wishlist');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                button.classList.remove('active');
                showNotification('Tanaman dihapus dari wishlist');
            }
        });
    });
    
    document.querySelectorAll('.plant-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;
            showNotification('Tanaman ditambahkan ke keranjang');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========== NOTIFICATION HELPER ==========
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(46, 125, 50, 0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== TIPS PAGE FUNCTIONALITY ==========
const tipCategoryButtons = document.querySelectorAll('.tip-category-btn');
const tipArticles = document.querySelectorAll('.tip-detailed, .featured-article');
const searchInput = document.getElementById('search-tips');

// Filter tips by category
if (tipCategoryButtons.length > 0) {
    tipCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            tipCategoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            tipArticles.forEach(article => {
                if (category === 'all' || article.getAttribute('data-category') === category) {
                    article.style.display = 'flex';
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        article.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Search functionality for tips
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        tipArticles.forEach(article => {
            const titleEl = article.querySelector('h2, h3');
            const excerptEl = article.querySelector('.article-excerpt');
            
            if (!titleEl || !excerptEl) return;
            
            const title = titleEl.textContent.toLowerCase();
            const excerpt = excerptEl.textContent.toLowerCase();
            
            if (searchTerm === '' || title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                article.style.display = 'flex';
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, 100);
            } else {
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    article.style.display = 'none';
                }, 300);
            }
        });
    });
}

// ========== FAQ TOGGLE ==========
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                item.classList.toggle('active');
            });
        }
    });
}

// ========== CONTACT FORM FUNCTIONALITY ==========
const contactForm = document.getElementById('consultation-form');
const fileUpload = document.getElementById('plant-photo');
const filePreview = document.getElementById('file-preview');
const successModal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');

// File upload preview
if (fileUpload) {
    fileUpload.addEventListener('change', function(e) {
        if (!filePreview) return;
        
        filePreview.innerHTML = '';
        
        Array.from(this.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'file-preview-item';
                    
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button class="remove-file" type="button"><i class="fas fa-times"></i></button>
                    `;
                    
                    filePreview.appendChild(previewItem);
                    
                    previewItem.querySelector('.remove-file').addEventListener('click', function() {
                        previewItem.remove();
                    });
                };
                
                reader.readAsDataURL(file);
            } else {
                showNotification('Hanya file gambar yang diperbolehkan (JPG, PNG)');
            }
        });
    });
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const phoneEl = document.getElementById('phone');
        const problemEl = document.getElementById('problem-detail');
        
        if (!nameEl || !emailEl || !phoneEl || !problemEl) {
            showNotification('Form tidak lengkap');
            return;
        }
        
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const phone = phoneEl.value.trim();
        const problem = problemEl.value.trim();
        
        if (!name || !email || !phone || !problem) {
            showNotification('Harap isi semua field yang wajib diisi');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[0-9\-\+\s]{9,15}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Format nomor telepon tidak valid');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Format email tidak valid');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success modal
                if (successModal) {
                    successModal.classList.add('active');
                    
                    // Generate ticket number
                    const ticketNumber = `#CONS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
                    const ticketEl = successModal.querySelector('strong');
                    if (ticketEl) {
                        ticketEl.textContent = `Nomor Tiket: ${ticketNumber}`;
                    }
                }
                
                // Reset form
                contactForm.reset();
                if (filePreview) filePreview.innerHTML = '';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showNotification('Konsultasi berhasil dikirim!');
            }, 1500);
        }
    });
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (successModal) {
            successModal.classList.remove('active');
        }
    });
}

// Close modal when clicking outside
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}

// ========== SIDEBAR CATEGORY LINKS ==========
const sidebarCategoryLinks = document.querySelectorAll('.widget-categories a');
if (sidebarCategoryLinks.length > 0) {
    sidebarCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.getAttribute('data-category');
            const correspondingButton = document.querySelector(`.tip-category-btn[data-category="${category}"]`);
            
            if (correspondingButton) {
                correspondingButton.click();
            }
        });
    });
}

// ========== TEAM MEMBER HOVER EFFECT ==========
const teamMembers = document.querySelectorAll('.team-member');
teamMembers.forEach(member => {
    member.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    member.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========== URGENCY LEVEL SELECTION ==========
const urgencyOptions = document.querySelectorAll('.urgency-option');
urgencyOptions.forEach(option => {
    option.addEventListener('click', function() {
        const input = this.querySelector('input');
        if (input) {
            input.checked = true;
            
            urgencyOptions.forEach(opt => {
                opt.style.background = 'transparent';
            });
            this.style.background = 'var(--color-background-alt)';
        }
    });
});

// ========== WHATSAPP QUICK CONTACT ==========
const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
whatsappButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.href.includes('whatsapp')) {
            e.preventDefault();
            showNotification('Fitur WhatsApp akan aktif di perangkat mobile');
        }
    });
});

// ========== ACTIVE NAVIGATION HIGHLIGHTING ==========
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        }
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
    highlightActiveNav();
});

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const animationObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, animationObserverOptions);

// Observe animate elements
document.querySelectorAll('.tip-detailed, .team-member, .contact-info-card, .animate-element').forEach(element => {
    animationObserver.observe(element);
});
