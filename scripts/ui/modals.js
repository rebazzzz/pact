/**
 * Modals Module
 * Handles modal dialogs throughout the application
 */

export function initModals() {
    console.log('🪟 Initializing modals module...');
    
    // Setup modal event listeners
    setupModalEventListeners();
    
    // Setup video call modal
    setupVideoCallModal();
}

function setupModalEventListeners() {
    // Close modals when clicking the close button or outside
    document.addEventListener('click', function(e) {
        // Close button
        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        }
        
        // Outside click
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
        
        // Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const openModal = document.querySelector('.modal.active');
                if (openModal) {
                    closeModal(openModal);
                }
            }
        });
    });
}

function setupVideoCallModal() {
    const startVideoBtn = document.getElementById('startVideoCall');
    if (!startVideoBtn) return;
    
    startVideoBtn.addEventListener('click', function() {
        openVideoCallModal();
    });
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

export function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

export function openVideoCallModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) {
        // Create video modal if it doesn't exist
        createVideoModal();
        return;
    }
    
    openModal('videoModal');
    startCallTimer();
    
    // Setup video call controls
    setupVideoCallControls();
}

function createVideoModal() {
    const modalHTML = `
        <div class="modal video-modal" id="videoModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Videosamtal</h3>
                    <button class="modal-close" id="closeVideoModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="video-container">
                        <div class="video-local">
                            <div class="video-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="video-label">Du</div>
                        </div>
                        <div class="video-remote">
                            <div class="video-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="video-label">Uppdragsgivare</div>
                        </div>
                    </div>
                    <div class="video-controls">
                        <button class="control-btn" id="toggleMic">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button class="control-btn" id="toggleVideo">
                            <i class="fas fa-video"></i>
                        </button>
                        <button class="control-btn end-call" id="endCall">
                            <i class="fas fa-phone-slash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    openModal('videoModal');
    startCallTimer();
    setupVideoCallControls();
}

function setupVideoCallControls() {
    const toggleMicBtn = document.getElementById('toggleMic');
    const toggleVideoBtn = document.getElementById('toggleVideo');
    const endCallBtn = document.getElementById('endCall');
    const closeBtn = document.getElementById('closeVideoModal');
    
    if (toggleMicBtn) {
        toggleMicBtn.addEventListener('click', function() {
            const isMuted = this.classList.toggle('muted');
            this.innerHTML = isMuted 
                ? '<i class="fas fa-microphone-slash"></i>' 
                : '<i class="fas fa-microphone"></i>';
            window.showToast?.(isMuted ? 'Mikrofon avstängd' : 'Mikrofon påslagen');
        });
    }
    
    if (toggleVideoBtn) {
        toggleVideoBtn.addEventListener('click', function() {
            const isVideoOff = this.classList.toggle('video-off');
            this.innerHTML = isVideoOff 
                ? '<i class="fas fa-video-slash"></i>' 
                : '<i class="fas fa-video"></i>';
            window.showToast?.(isVideoOff ? 'Kamera avstängd' : 'Kamera påslagen');
        });
    }
    
    if (endCallBtn) {
        endCallBtn.addEventListener('click', function() {
            const modal = document.getElementById('videoModal');
            if (modal) {
                closeModal(modal);
                stopCallTimer();
                window.showToast?.('Videosamtal avslutat');
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = document.getElementById('videoModal');
            if (modal) {
                closeModal(modal);
                stopCallTimer();
                window.showToast?.('Videosamtal avslutat');
            }
        });
    }
}

let callTimerInterval;
function startCallTimer() {
    const callTimer = document.getElementById('callTimer');
    if (!callTimer) return;
    
    let seconds = 0;
    callTimer.textContent = '00:00';
    
    callTimerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        callTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopCallTimer() {
    if (callTimerInterval) {
        clearInterval(callTimerInterval);
    }
}

// Job detail modal
export function openJobDetailModal(job) {
    // Create modal HTML for job details
    const modalHTML = `
        <div class="modal job-modal" id="jobDetailModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${job.title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-match-score">
                        <div class="score-display" style="background: conic-gradient(var(--color-primary) ${job.matchScore}%, var(--color-border) 0)">
                            <span>${job.matchScore}%</span>
                        </div>
                        <div class="match-reasons">
                            <div class="match-reason">
                                <i class="fas fa-check"></i>
                                <span>Bra match för dina kompetenser</span>
                            </div>
                            <div class="match-reason">
                                <i class="fas fa-check"></i>
                                <span>Nära din plats</span>
                            </div>
                            <div class="match-reason">
                                <i class="fas fa-check"></i>
                                <span>Passar din kalender</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-job-details">
                        <div class="job-detail-section">
                            <h4>Beskrivning</h4>
                            <p>${job.description}</p>
                        </div>
                        
                        <div class="job-detail-section">
                            <h4>Detaljer</h4>
                            <div class="job-details-grid">
                                <div class="detail-item">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <div>
                                        <strong>Pris</strong>
                                        <p>${job.price}</p>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <div>
                                        <strong>Plats</strong>
                                        <p>${job.location}</p>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <i class="far fa-clock"></i>
                                    <div>
                                        <strong>Tidsåtgång</strong>
                                        <p>${job.time}</p>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-calendar"></i>
                                    <div>
                                        <strong>Publicerad</strong>
                                        <p>${job.date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="job-detail-section">
                            <h4>Önskade kompetenser</h4>
                            <div class="job-tags">
                                ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="job-detail-section">
                            <h4>Om uppdragsgivaren</h4>
                            <div class="author-details">
                                <div class="author-avatar large">${job.author.charAt(0)}</div>
                                <div class="author-info">
                                    <h5>${job.author}</h5>
                                    <p>Medlem sedan 2023 • 4.8★ (12 recensioner)</p>
                                    <div class="author-badges">
                                        <span class="badge badge-success">
                                            <i class="fas fa-check-circle"></i> Verifierad
                                        </span>
                                        <span class="badge badge-warning">
                                            <i class="fas fa-star"></i> Toppbetyg
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="saveJobDetail">
                        <i class="far fa-bookmark"></i> Spara
                    </button>
                    <button class="btn btn-primary" id="applyForJob">
                        <i class="fas fa-handshake"></i> Intresserad av uppdraget
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('jobDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    openModal('jobDetailModal');
    
    // Setup event listeners for this modal
    setupJobDetailModalListeners(job);
}

function setupJobDetailModalListeners(job) {
    const modal = document.getElementById('jobDetailModal');
    if (!modal) return;
    
    // Save button
    const saveBtn = modal.querySelector('#saveJobDetail');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            window.showToast?.('Uppdrag sparat!');
            // In a real app, this would save to user's saved jobs
        });
    }
    
    // Apply button
    const applyBtn = modal.querySelector('#applyForJob');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            window.showToast?.(`Ditt intresse har skickats till ${job.author}`);
            closeModal(modal);
        });
    }
}