/**
 * Authentication Module
 * Handles user authentication and profile management
 */

export function initAuth(userState) {
    console.log('👤 Initializing auth module...');
    
    // Load user data from localStorage
    loadUserData(userState);
    
    // Initialize event listeners
    setupAuthEventListeners(userState);
}

function loadUserData(userState) {
    try {
        const savedUser = JSON.parse(localStorage.getItem('pactUser'));
        if (savedUser) {
            Object.assign(userState, savedUser);
            updateUserUI(userState);
        }
    } catch (error) {
        console.warn('Could not load user data:', error);
    }
}

function updateUserUI(userState) {
    // Update user avatar
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && userState.name) {
        userAvatar.textContent = userState.name.charAt(0).toUpperCase();
    }
    
    // Update profile page if it exists
    updateProfilePage(userState);
}

function updateProfilePage(userState) {
    const profileName = document.querySelector('.profile-details h2');
    if (profileName && userState.name) {
        profileName.textContent = userState.name;
    }
    
    const profileTitle = document.querySelector('.profile-title');
    if (profileTitle && userState.title) {
        profileTitle.textContent = userState.title;
    }
}

function setupAuthEventListeners(userState) {
    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            showEditProfileModal(userState);
        });
    }
    
    // View stats button
    const viewStatsBtn = document.getElementById('viewStatsBtn');
    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', () => {
            showStatsModal(userState);
        });
    }
    
    // User avatar click
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            toggleUserMenu();
        });
    }
}

function showEditProfileModal(userState) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal" id="editProfileModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Redigera profil</h3>
                    <button class="modal-close" id="closeEditProfileModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="profileForm" class="profile-form">
                        <div class="form-group">
                            <label for="profileName" class="form-label">Namn</label>
                            <input type="text" id="profileName" class="form-input" 
                                   value="${userState.name || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="profileTitle" class="form-label">Titel/Erfarenhet</label>
                            <input type="text" id="profileTitle" class="form-input" 
                                   value="${userState.title || ''}" 
                                   placeholder="Ex: Frontend-utvecklare & DIY-entusiast">
                        </div>
                        
                        <div class="form-group">
                            <label for="profileLocation" class="form-label">Plats</label>
                            <select id="profileLocation" class="form-select">
                                <option value="stockholm" ${userState.location === 'stockholm' ? 'selected' : ''}>Stockholm</option>
                                <option value="goteborg" ${userState.location === 'goteborg' ? 'selected' : ''}>Göteborg</option>
                                <option value="malmo" ${userState.location === 'malmo' ? 'selected' : ''}>Malmö</option>
                                <option value="other" ${!['stockholm', 'goteborg', 'malmo'].includes(userState.location) ? 'selected' : ''}>Annat område</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="profileBio" class="form-label">Om mig</label>
                            <textarea id="profileBio" class="form-textarea" rows="4" 
                                      placeholder="Beskriv dig själv och dina kompetenser...">${userState.bio || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tillgänglighet</label>
                            <div class="radio-group">
                                <label class="radio-option ${userState.availability === 'full' ? 'selected' : ''}">
                                    <input type="radio" name="availability" value="full" 
                                           ${userState.availability === 'full' ? 'checked' : ''}>
                                    <div class="radio-content">
                                        <div class="radio-title">Full tillgänglighet</div>
                                        <div class="radio-description">Tillgänglig för uppdrag regelbundet</div>
                                    </div>
                                </label>
                                
                                <label class="radio-option ${userState.availability === 'part' ? 'selected' : ''}">
                                    <input type="radio" name="availability" value="part" 
                                           ${userState.availability === 'part' ? 'checked' : ''}>
                                    <div class="radio-content">
                                        <div class="radio-title">Deltid</div>
                                        <div class="radio-description">Tillgänglig några timmar per vecka</div>
                                    </div>
                                </label>
                                
                                <label class="radio-option ${userState.availability === 'occasional' ? 'selected' : ''}">
                                    <input type="radio" name="availability" value="occasional" 
                                           ${userState.availability === 'occasional' ? 'checked' : ''}>
                                    <div class="radio-content">
                                        <div class="radio-title">Tillfälligt</div>
                                        <div class="radio-description">Tillgänglig för enstaka uppdrag</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancelProfileEdit">Avbryt</button>
                    <button class="btn btn-primary" id="saveProfile">Spara ändringar</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'flex';
    
    // Setup modal event listeners
    setupProfileModalListeners(modal, userState);
}

function setupProfileModalListeners(modal, userState) {
    // Close button
    const closeBtn = modal.querySelector('#closeEditProfileModal');
    const cancelBtn = modal.querySelector('#cancelProfileEdit');
    
    const closeModal = () => {
        modal.remove();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Save button
    const saveBtn = modal.querySelector('#saveProfile');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveProfileChanges(modal, userState);
        });
    }
    
    // Radio selection
    modal.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', function() {
            modal.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}

function saveProfileChanges(modal, userState) {
    const form = modal.querySelector('#profileForm');
    if (!form) return;
    
    // Get form values
    userState.name = form.querySelector('#profileName').value.trim();
    userState.title = form.querySelector('#profileTitle').value.trim();
    userState.location = form.querySelector('#profileLocation').value;
    userState.bio = form.querySelector('#profileBio').value.trim();
    userState.availability = form.querySelector('input[name="availability"]:checked')?.value || 'part';
    
    // Validate
    if (!userState.name) {
        window.showToast?.('Vänligen fyll i ditt namn');
        return;
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('pactUser', JSON.stringify(userState));
        window.showToast?.('Profil sparad!');
        
        // Update UI
        updateUserUI(userState);
        
        // Close modal
        modal.remove();
        
        // Trigger global save if available
        if (window.PACT?.saveState) {
            window.PACT.saveState();
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        window.showToast?.('Kunde inte spara profilen');
    }
}

function showStatsModal(userState) {
    window.showToast?.('Öppnar detaljerad statistik...');
    // In a real implementation, this would show detailed statistics
}

function toggleUserMenu() {
    window.showToast?.('Öppnar användarmeny...');
    // In a real implementation, this would toggle a user dropdown menu
}