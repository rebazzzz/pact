/**
 * Profile Module
 * Handles user profile, skills, and endorsements
 */

// Sample skills data
const sampleSkills = [
    { id: 1, name: 'Möbelmontering', level: 'expert', endorsements: 12, endorsers: ['A', 'M', 'E', 'J'] },
    { id: 2, name: 'Datorreparation', level: 'advanced', endorsements: 8, endorsers: ['K', 'L', 'S'] },
    { id: 3, name: 'Flytthjälp', level: 'intermediate', endorsements: 15, endorsers: ['D', 'A', 'M', 'E', 'J'] },
    { id: 4, name: 'Trädgårdsarbete', level: 'intermediate', endorsements: 5, endorsers: ['L', 'S'] },
    { id: 5, name: 'Måleri', level: 'beginner', endorsements: 3, endorsers: ['D', 'A'] },
    { id: 6, name: 'Tekniksupport', level: 'expert', endorsements: 18, endorsers: ['M', 'E', 'J', 'K', 'L'] }
];

export function initProfile(state) {
    console.log('👤 Initializing profile module...');
    
    // Load skills into state
    state.skills = [...sampleSkills];
    
    // Initialize UI
    renderSkills(state.skills);
    
    // Setup event listeners
    setupProfileEventListeners(state);
}

function renderSkills(skills) {
    const container = document.getElementById('skillsGrid');
    if (!container) return;
    
    const html = skills.map(skill => createSkillElement(skill)).join('');
    container.innerHTML = html;
}

function createSkillElement(skill) {
    const levelLabels = {
        'beginner': 'Ny börjare',
        'intermediate': 'Erfaren',
        'advanced': 'Avancerad',
        'expert': 'Expert'
    };
    
    const levelColors = {
        'beginner': 'beginner',
        'intermediate': 'intermediate',
        'advanced': 'intermediate',
        'expert': 'expert'
    };
    
    const hasEndorsed = localStorage.getItem(`endorsed-${skill.id}`) === 'true';
    const endorserCount = skill.endorsers.length;
    const showMore = skill.endorsements > endorserCount;
    
    return `
        <div class="skill-item" data-skill-id="${skill.id}">
            <div class="skill-header">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level ${levelColors[skill.level]}">${levelLabels[skill.level]}</div>
            </div>
            <div class="endorsement-count">
                <i class="fas fa-thumbs-up"></i>
                <span>${skill.endorsements} rekommendationer</span>
            </div>
            <div class="endorsers">
                ${skill.endorsers.map((initial, index) => `
                    <div class="endorser-avatar" style="z-index: ${endorserCount - index}">
                        ${initial}
                    </div>
                `).join('')}
                ${showMore ? `
                    <div class="more-endorsers">+${skill.endorsements - endorserCount} fler</div>
                ` : ''}
            </div>
            <button class="endorse-btn ${hasEndorsed ? 'endorsed' : ''}" 
                    data-skill-id="${skill.id}"
                    title="${hasEndorsed ? 'Ta bort rekommendation' : 'Rekommendera denna kompetens'}">
                <i class="fas fa-thumbs-up"></i>
            </button>
        </div>
    `;
}

function setupProfileEventListeners(state) {
    // Endorse buttons
    document.addEventListener('click', function(e) {
        const endorseBtn = e.target.closest('.endorse-btn');
        if (endorseBtn) {
            const skillId = parseInt(endorseBtn.dataset.skillId);
            const skill = state.skills.find(s => s.id === skillId);
            
            if (skill) {
                toggleEndorsement(skillId, endorseBtn, state);
            }
        }
    });
    
    // Add skill button
    const addSkillBtn = document.getElementById('addSkill');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            showAddSkillModal(state);
        });
    }
    
    // Emergency contact button
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', toggleEmergencyInfo);
    }
    
    // Share location button
    const shareLocationBtn = document.getElementById('shareLocationBtn');
    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', shareLocationWithSupport);
    }
}

function toggleEndorsement(skillId, button, state) {
    const skill = state.skills.find(s => s.id === skillId);
    if (!skill) return;
    
    const hasEndorsed = localStorage.getItem(`endorsed-${skillId}`) === 'true';
    const endorsementCount = button.closest('.skill-item').querySelector('.endorsement-count span');
    
    if (hasEndorsed) {
        // Remove endorsement
        skill.endorsements = Math.max(0, skill.endorsements - 1);
        localStorage.setItem(`endorsed-${skillId}`, 'false');
        button.classList.remove('endorsed');
        button.title = 'Rekommendera denna kompetens';
        window.showToast?.('Rekommendation borttagen');
    } else {
        // Add endorsement
        skill.endorsements++;
        localStorage.setItem(`endorsed-${skillId}`, 'true');
        button.classList.add('endorsed');
        button.title = 'Ta bort rekommendation';
        window.showToast?.('Tack för din rekommendation!');
    }
    
    // Update UI
    if (endorsementCount) {
        endorsementCount.textContent = `${skill.endorsements} rekommendationer`;
    }
    
    // Update more endorsers text
    const moreEndorsers = button.closest('.skill-item').querySelector('.more-endorsers');
    if (moreEndorsers && skill.endorsements <= skill.endorsers.length) {
        moreEndorsers.remove();
    }
}

function showAddSkillModal(state) {
    const modalHTML = `
        <div class="modal" id="addSkillModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Lägg till kompetens</h3>
                    <button class="modal-close" id="closeAddSkillModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addSkillForm" class="skill-form">
                        <div class="form-group">
                            <label for="skillName" class="form-label">Kompetens</label>
                            <input type="text" id="skillName" class="form-input" 
                                   placeholder="Ex: Möbelmontering, Måleri, Tekniksupport" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="skillLevel" class="form-label">Nivå</label>
                            <select id="skillLevel" class="form-select">
                                <option value="beginner">Ny börjare</option>
                                <option value="intermediate" selected>Erfaren</option>
                                <option value="advanced">Avancerad</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Beskrivning (valfritt)</label>
                            <textarea id="skillDescription" class="form-textarea" rows="3" 
                                      placeholder="Beskriv kortfattat din erfarenhet..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancelAddSkill">Avbryt</button>
                    <button class="btn btn-primary" id="saveSkill">Lägg till kompetens</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('addSkillModal');
    modal.style.display = 'flex';
    
    // Setup modal event listeners
    setupAddSkillModalListeners(modal, state);
}

function setupAddSkillModalListeners(modal, state) {
    // Close button
    const closeBtn = modal.querySelector('#closeAddSkillModal');
    const cancelBtn = modal.querySelector('#cancelAddSkill');
    
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
    const saveBtn = modal.querySelector('#saveSkill');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveNewSkill(modal, state);
        });
    }
}

function saveNewSkill(modal, state) {
    const form = modal.querySelector('#addSkillForm');
    if (!form) return;
    
    const name = form.querySelector('#skillName').value.trim();
    const level = form.querySelector('#skillLevel').value;
    const description = form.querySelector('#skillDescription').value.trim();
    
    if (!name) {
        window.showToast?.('Vänligen ange ett namn på kompetensen');
        return;
    }
    
    // Create new skill
    const newSkill = {
        id: Date.now(), // Simple ID generation
        name: name,
        level: level,
        endorsements: 0,
        endorsers: [],
        description: description
    };
    
    // Add to state
    state.skills.push(newSkill);
    
    // Update UI
    renderSkills(state.skills);
    
    // Save state
    if (window.PACT?.saveState) {
        window.PACT.saveState();
    }
    
    window.showToast?.('Kompetens tillagd!');
    modal.remove();
}

function toggleEmergencyInfo() {
    const emergencyInfo = document.getElementById('emergencyInfo');
    if (!emergencyInfo) return;
    
    if (emergencyInfo.style.display === 'none' || !emergencyInfo.style.display) {
        emergencyInfo.style.display = 'block';
        window.showToast?.('Nödinformation visas. Dela din plats med support om du känner dig otrygg.');
    } else {
        emergencyInfo.style.display = 'none';
    }
}

function shareLocationWithSupport() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // In a real app, this would send to backend
                window.showToast?.(`Plats delad med support: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                
                // Simulate emergency alert
                setTimeout(() => {
                    window.showToast?.('PACT Support har blivit meddelad och kommer kontakta dig inom 2 minuter.');
                }, 1000);
            },
            function(error) {
                window.showToast?.('Kunde inte hämta din plats. Vänligen ring 112 om det är akut.');
            }
        );
    } else {
        window.showToast?.('Geolocation stöds inte av din webbläsare. Vänligen ring 112 om det är akut.');
    }
}