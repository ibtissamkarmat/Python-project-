

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeSmoothScroll();
    initializeFormValidation();
    initializeDarkMode();
    initializeCardInteractions();
});


function initializeSearch() {
    
    const jobsSection = document.querySelector('.section');
    if (!jobsSection) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
        align-items: center;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Search...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        flex: 1;
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.95rem;
        transition: var(--transition);
    `;

    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = 'var(--primary-color)';
        searchInput.style.boxShadow = '0 0 0 3px rgba(91, 99, 222, 0.1)';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'var(--border-color)';
        searchInput.style.boxShadow = 'none';
    });

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '✕';
    resetBtn.style.cssText = `
        padding: 0.75rem 1rem;
        background: var(--border-color);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: var(--transition);
    `;

    resetBtn.addEventListener('hover-like', () => {
        resetBtn.style.background = 'var(--light-color)';
    });

    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.cards-grid .card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? '' : 'none';
            if (text.includes(searchTerm) && searchTerm.length > 0) {
                card.style.animation = 'fadeIn 0.3s ease-out';
            }
        });

        
        resetBtn.style.display = searchTerm ? 'block' : 'none';
    });

    
    resetBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        resetBtn.style.display = 'none';
        searchInput.focus();
    });

    resetBtn.style.display = 'none';
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(resetBtn);

    if (jobsSection) {
        jobsSection.insertBefore(searchContainer, jobsSection.querySelector('.cards-grid'));
    }
}


function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });

        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly', 'error');
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');

    
    field.classList.remove('invalid');
    removeErrorMessage(field);

    
    if (isRequired && !value) {
        addInvalidStyle(field, 'This field is required');
        return false;
    }

    if (field.type === 'email' && value && !isValidEmail(value)) {
        addInvalidStyle(field, 'Please enter a valid email');
        return false;
    }

    if (field.type === 'number' && value && isNaN(value)) {
        addInvalidStyle(field, 'Please enter a valid number');
        return false;
    }

    addValidStyle(field);
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function addInvalidStyle(field, message) {
    field.classList.add('invalid');
    field.style.borderColor = 'var(--danger-color)';

    let errorMsg = field.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
    }
    errorMsg.textContent = message;
    errorMsg.style.cssText = `
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease-out;
    `;
}

function addValidStyle(field) {
    field.style.borderColor = 'var(--border-color)';
}

function removeErrorMessage(field) {
    const nextEl = field.nextElementSibling;
    if (nextEl && nextEl.classList.contains('error-message')) {
        nextEl.remove();
    }
}


function initializeDarkMode() {
    
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (!savedMode && prefersDark)) {
        enableDarkMode();
    }

    
    const header = document.querySelector('header .container');
    if (header) {
        const toggleBtn = document.createElement('button');
        toggleBtn.title = 'Toggle dark mode';
        toggleBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            transition: var(--transition);
        `;
        toggleBtn.textContent = '🌙';

        toggleBtn.addEventListener('click', function() {
            const isDark = document.body.classList.contains('dark-mode');
            if (isDark) {
                disableDarkMode();
                toggleBtn.textContent = '🌙';
            } else {
                enableDarkMode();
                toggleBtn.textContent = '☀️';
            }
        });

        
        const nav = header.querySelector('.nav');
        if (nav) {
            nav.parentNode.insertBefore(toggleBtn, nav);
        }

        if (document.body.classList.contains('dark-mode')) {
            toggleBtn.textContent = '☀️';
        }
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
}


const style = document.createElement('style');
style.textContent = `
    body.dark-mode {
        background: #111827;
        color: #f3f4f6;
    }

    body.dark-mode header {
        background: #1f2937;
        border-bottom: 1px solid #374151;
    }

    body.dark-mode .card,
    body.dark-mode form,
    body.dark-mode .welcome-section {
        background: #1f2937;
        border-color: #374151;
    }

    body.dark-mode input,
    body.dark-mode textarea,
    body.dark-mode select,
    body.dark-mode .search-input {
        background: #111827;
        border-color: #374151;
        color: #f3f4f6;
    }

    body.dark-mode label,
    body.dark-mode .card-title,
    body.dark-mode h1,
    body.dark-mode h2,
    body.dark-mode h3 {
        color: #f3f4f6;
    }

    body.dark-mode .empty-state {
        background: #1f2937;
        border-color: #374151;
    }

    body.dark-mode footer {
        background: #0f172a;
        border-top: 1px solid #374151;
    }

    body.dark-mode .nav a {
        color: #e5e7eb;
    }

    body.dark-mode .card-meta {
        color: #9ca3af;
    }
`;
document.head.appendChild(style);


function initializeCardInteractions() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        
        card.style.cursor = 'pointer';

        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                
                console.log('Card clicked:', this.textContent);
            }
        });

        
        const cardText = card.textContent;
        if (cardText.includes('@')) {
            const copyHint = document.createElement('div');
            copyHint.textContent = 'Click to copy contact info';
            copyHint.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.85rem;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
            `;
        }
    });
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger-color)' : type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;

    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(400px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


function copyToClipboard(text, message = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message, 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}


document.addEventListener('keydown', function(e) {
    
    if (e.key === 'Escape') {
        console.log('Escape pressed - close modals');
    }

    
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});


function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}


window.FreelanceHub = {
    showNotification,
    copyToClipboard,
    validateField
};

console.log('%cFreelanceHub Interactive Features Loaded ✨', 'color: #5b63de; font-size: 14px; font-weight: bold;');
