// scripts/ui/theme.js
export function initTheme() {
    console.log('🎨 Initializing theme system...');
    
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('pactTheme') || 'light';
    setTheme(savedTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('pactTheme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('pactTheme', 'light');
    }
}