/**
 * Utility Functions
 * Shared helper functions for the entire application
 */

// LocalStorage utilities
export const Storage = {
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Formatting utilities
export const Formatter = {
    currency: function(amount, currency = 'SEK') {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    date: function(dateString, format = 'short') {
        const date = new Date(dateString);
        const options = format === 'short' 
            ? { day: 'numeric', month: 'short' }
            : { day: 'numeric', month: 'long', year: 'numeric' };
        
        return new Intl.DateTimeFormat('sv-SE', options).format(date);
    },
    
    time: function(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('sv-SE', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },
    
    relativeTime: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffHours < 1) {
            return 'Nu';
        } else if (diffHours < 24) {
            return `${diffHours} tim sedan`;
        } else if (diffDays === 1) {
            return 'Igår';
        } else if (diffDays < 7) {
            return `${diffDays} dagar sedan`;
        } else {
            return this.date(dateString, 'short');
        }
    },
    
    truncate: function(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
};

// Validation utilities
export const Validator = {
    email: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    phone: function(phone) {
        const re = /^[\d\s\-\+\(\)]{8,}$/;
        return re.test(phone);
    },
    
    required: function(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    minLength: function(value, min) {
        return value && value.length >= min;
    },
    
    maxLength: function(value, max) {
        return value && value.length <= max;
    },
    
    between: function(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }
};

// DOM utilities
export const DOM = {
    show: function(element) {
        if (element) element.style.display = 'block';
    },
    
    hide: function(element) {
        if (element) element.style.display = 'none';
    },
    
    toggle: function(element) {
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    addClass: function(element, className) {
        if (element) element.classList.add(className);
    },
    
    removeClass: function(element, className) {
        if (element) element.classList.remove(className);
    },
    
    toggleClass: function(element, className) {
        if (element) element.classList.toggle(className);
    },
    
    scrollTo: function(element, offset = 80) {
        if (element) {
            window.scrollTo({
                top: element.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    },
    
    isInViewport: function(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Array utilities
export const ArrayUtils = {
    shuffle: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    chunk: function(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    
    unique: function(array, key = null) {
        if (key) {
            const seen = new Set();
            return array.filter(item => {
                const value = item[key];
                if (seen.has(value)) {
                    return false;
                }
                seen.add(value);
                return true;
            });
        }
        return [...new Set(array)];
    },
    
    sortBy: function(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];
            
            // Handle nested keys
            if (key.includes('.')) {
                aValue = key.split('.').reduce((o, i) => o[i], a);
                bValue = key.split('.').reduce((o, i) => o[i], b);
            }
            
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
};

// Object utilities
export const ObjectUtils = {
    merge: function(target, ...sources) {
        sources.forEach(source => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    target[key] = this.merge(target[key] || {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        });
        return target;
    },
    
    pick: function(obj, keys) {
        return keys.reduce((result, key) => {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    },
    
    omit: function(obj, keys) {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
    },
    
    isEmpty: function(obj) {
        if (!obj) return true;
        return Object.keys(obj).length === 0;
    }
};

// Random utilities
export const Random = {
    number: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    item: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    boolean: function(probability = 0.5) {
        return Math.random() < probability;
    },
    
    id: function(prefix = '') {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
};

// Debounce and throttle
export const Debounce = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Copy to clipboard
export const Clipboard = {
    copy: function(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => resolve(true))
                    .catch(() => this.fallbackCopy(text, resolve, reject));
            } else {
                this.fallbackCopy(text, resolve, reject);
            }
        });
    },
    
    fallbackCopy: function(text, resolve, reject) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            resolve(true);
        } catch (err) {
            reject(err);
        }
        
        document.body.removeChild(textArea);
    }
};

// Export all utilities as default object
export default {
    Storage,
    Formatter,
    Validator,
    DOM,
    ArrayUtils,
    ObjectUtils,
    Random,
    Debounce,
    Clipboard
};