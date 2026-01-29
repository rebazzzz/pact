/**
 * Dynamic Footer Component
 * Generates footer HTML based on app state
 */

export function initFooter(state) {
    console.log('📄 Initializing dynamic footer...');

    const footerContainer = document.querySelector('.footer');
    if (!footerContainer) {
        console.warn('Footer container not found');
        return;
    }

    // Generate footer HTML
    const footerHTML = generateFooterHTML(state);
    footerContainer.innerHTML = footerHTML;

    // Setup event listeners
    setupFooterEvents();
}

function generateFooterHTML(state) {
    return `
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo">PACT</div>
                    <p class="footer-tagline">Enkla uppdrag, enkla lösningar.</p>
                    <div class="footer-verified">
                        <span><i class="fas fa-shield-alt"></i> Säker plattform</span>
                        <span><i class="fas fa-user-check"></i> Verifierade användare</span>
                    </div>
                </div>

                <div class="footer-links">
                    <div class="footer-column">
                        <h4>För användare</h4>
                        <a href="#how-it-works">Så funkar det</a>
                        <a href="#">Vanliga frågor</a>
                        <a href="#">Säkerhet</a>
                    </div>

                    <div class="footer-column">
                        <h4>För hjälpare</h4>
                        <a href="#">Kom igång</a>
                        <a href="#">Tips & råd</a>
                        <a href="#">Skatt</a>
                    </div>

                    <div class="footer-column">
                        <h4>Om PACT</h4>
                        <a href="#">Om oss</a>
                        <a href="#">Kontakt</a>
                        <a href="#">Karriär</a>
                    </div>

                    <div class="footer-column">
                        <h4>Juridik</h4>
                        <a href="#">Användarvillkor</a>
                        <a href="#">Integritetspolicy</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2023 PACT AB. Alla rättigheter förbehållna.</p>
                <div class="footer-social">
                    <a href="#" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" aria-label="Facebook">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="#" aria-label="Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function setupFooterEvents() {
    // Emergency button toggle
    const emergencyBtn = document.getElementById('emergencyBtn');
    const emergencyInfo = document.getElementById('emergencyInfo');
    if (emergencyBtn && emergencyInfo) {
        emergencyBtn.addEventListener('click', () => {
            emergencyInfo.style.display = emergencyInfo.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Share location button
    const shareLocationBtn = document.getElementById('shareLocationBtn');
    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', () => {
            window.showToast?.('Delar plats med support...');
        });
    }
}
