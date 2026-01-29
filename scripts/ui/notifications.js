/**
 * Notifications Module
 * Handles toast notifications throughout the application
 */

export function initNotifications() {
    console.log('🔔 Initializing notifications module...');
    
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast')) {
        createToastContainer();
    }
    
    // Make showToast available globally
    window.showToast = showToast;
}

function createToastContainer() {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast';
    toastContainer.className = 'toast';
    document.body.appendChild(toastContainer);
    
    // Add CSS for toast
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: var(--spacing-md) var(--spacing-lg);
                background-color: var(--color-primary);
                color: var(--color-white);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: var(--z-tooltip);
                opacity: 0;
                transform: translateY(100%);
                transition: all var(--transition-normal);
                max-width: 350px;
                pointer-events: none;
            }
            
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .toast.success {
                background-color: var(--color-success);
            }
            
            .toast.warning {
                background-color: var(--color-warning);
            }
            
            .toast.error {
                background-color: var(--color-danger);
            }
            
            .toast.info {
                background-color: var(--color-info);
            }
        `;
        document.head.appendChild(style);
    }
}

export function showToast(message, type = 'default', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type !== 'default') {
        toast.classList.add(type);
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto-hide after duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Convenience methods for different toast types
export const Toast = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
    default: (message, duration) => showToast(message, 'default', duration)
};

// Make Toast available globally
window.Toast = Toast;

// Keyboard shortcut for showing demo toast
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + T for demo toast
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        showToast('Detta är en demo-notifikation! Tryck Ctrl+T igen för en till.', 'info');
    }
});

// Auto-show welcome toast on first visit
document.addEventListener('DOMContentLoaded', function() {
    const hasVisited = localStorage.getItem('pactHasVisited');
    if (!hasVisited) {
        setTimeout(() => {
            showToast('Välkommen till PACT! 🎉 Hitta eller erbjud hjälp med vardagliga uppgifter.', 'success', 5000);
            localStorage.setItem('pactHasVisited', 'true');
        }, 1000);
    }
});