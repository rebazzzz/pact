/**
 * Jobs Module
 * Handles job listings, filtering, and matching
 */

// Sample job data
const sampleJobs = [
    {
        id: 1,
        title: "Hjälp med IKEA-möbelmontering",
        description: "Behöver hjälp att montera en BILLY bokhylla och en MALM säng. Har alla delar och instruktioner.",
        price: "450 kr",
        location: "Stockholm, Södermalm",
        time: "2-3 timmar",
        category: "assembly",
        skills: ["Möbelmontering", "DIY"],
        matchScore: 95,
        author: "Anna",
        date: "Idag",
        icon: "fas fa-tools"
    },
    {
        id: 2,
        title: "Transport av soffa",
        description: "Behöver hjälp att transportera en 3-sits soffa från Kungens kurva till Sollentuna. Har bil med takräcke.",
        price: "700 kr",
        location: "Stockholm, Kungens kurva",
        time: "Halvdag",
        category: "moving",
        skills: ["Transport", "Lastning"],
        matchScore: 82,
        author: "Marcus",
        date: "Idag",
        icon: "fas fa-truck-moving"
    },
    {
        id: 3,
        title: "Hjälp med datorinstallation",
        description: "Behöver hjälp att installera Windows och sätta upp skrivare och wifi på min nya dator.",
        price: "350 kr",
        location: "Stockholm, Vasastan",
        time: "1-2 timmar",
        category: "tech",
        skills: ["Tekniksupport", "Installation"],
        matchScore: 78,
        author: "Elin",
        date: "Igår",
        icon: "fas fa-laptop"
    },
    {
        id: 4,
        title: "Städhjälp inför fest",
        description: "Behöver extra städhjälp i lägenheten (85 kvm) inför en fest på lördag.",
        price: "600 kr",
        location: "Stockholm, Östermalm",
        time: "3-4 timmar",
        category: "cleaning",
        skills: ["Städning", "Organisation"],
        matchScore: 65,
        author: "David",
        date: "Igår",
        icon: "fas fa-broom"
    },
    {
        id: 5,
        title: "Måla om ett rum",
        description: "Behöver hjälp att måla om ett sovrum på ca 15 kvm. All material finns på plats.",
        price: "1200 kr",
        location: "Stockholm, Hägersten",
        time: "Helgdag",
        category: "painting",
        skills: ["Måleri", "Renovering"],
        matchScore: 88,
        author: "Sofia",
        date: "2 dagar sedan",
        icon: "fas fa-paint-roller"
    },
    {
        id: 6,
        title: "Hjälp med flytt",
        description: "Behöver hjälp att bära möbler och kartonger från 3:e våningen (hiss finns).",
        price: "900 kr",
        location: "Stockholm, Bromma",
        time: "Halvdag",
        category: "moving",
        skills: ["Flytt", "Lastning"],
        matchScore: 91,
        author: "Johan",
        date: "2 dagar sedan",
        icon: "fas fa-box-open"
    }
];

// Sample categories
const categories = [
    { id: 'assembly', name: 'Montering', icon: 'fas fa-tools', count: 24 },
    { id: 'moving', name: 'Flytt & Transport', icon: 'fas fa-truck-moving', count: 18 },
    { id: 'tech', name: 'Teknikhjälp', icon: 'fas fa-laptop', count: 32 },
    { id: 'cleaning', name: 'Städning', icon: 'fas fa-broom', count: 15 },
    { id: 'garden', name: 'Trädgård', icon: 'fas fa-leaf', count: 12 },
    { id: 'repair', name: 'Reparation', icon: 'fas fa-wrench', count: 9 },
    { id: 'painting', name: 'Måleri', icon: 'fas fa-paint-roller', count: 11 },
    { id: 'other', name: 'Övrigt', icon: 'fas fa-tasks', count: 7 }
];

export function initJobs(state) {
    console.log('📋 Initializing jobs module...');
    
    // Load jobs into state
    state.jobs = [...sampleJobs];
    
    // Initialize UI
    renderCategories();
    renderJobs(state);
    
    // Setup event listeners
    setupJobEventListeners(state);
}

function renderCategories() {
    const container = document.getElementById('categoryGrid');
    if (!container) return;
    
    const html = categories.map(category => `
        <div class="category-card" data-category="${category.id}">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h4>${category.name}</h4>
            <span class="category-count">${category.count} uppdrag</span>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function renderJobs(state) {
    const container = document.getElementById('jobGrid');
    if (!container) return;
    
    // Get filter values
    const categoryFilter = document.getElementById('categoryFilter');
    const showMatchesOnly = document.getElementById('showMatchesOnly');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const onlyMatches = showMatchesOnly ? showMatchesOnly.checked : false;
    
    // Filter jobs
    let filteredJobs = [...state.jobs];
    
    if (selectedCategory !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.category === selectedCategory);
    }
    
    if (onlyMatches) {
        filteredJobs = filteredJobs.filter(job => job.matchScore > 70);
        filteredJobs.sort((a, b) => b.matchScore - a.matchScore);
    }
    
    // Render jobs
    const html = filteredJobs.map(job => `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-match">${job.matchScore}% match</div>
            <div class="job-image">
                <i class="${job.icon}"></i>
            </div>
            <div class="job-content">
                <h3 class="job-title">${job.title}</h3>
                <p class="job-description">${job.description}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="far fa-clock"></i> ${job.time}</span>
                </div>
                <div class="job-price">${job.price}</div>
                <div class="job-tags">
                    ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                </div>
                <div class="job-footer">
                    <div class="job-author">
                        <div class="author-avatar">${job.author.charAt(0)}</div>
                        <div class="author-name">${job.author}</div>
                    </div>
                    <button class="btn-icon btn-save" title="Spara uppdrag">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function setupJobEventListeners(state) {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => renderJobs(state));
    }
    
    // Match filter
    const showMatchesOnly = document.getElementById('showMatchesOnly');
    if (showMatchesOnly) {
        showMatchesOnly.addEventListener('change', () => renderJobs(state));
    }
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (categoryFilter) {
                categoryFilter.value = category;
                renderJobs(state);
                
                // Scroll to job listings
                document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Job cards (delegated)
    document.addEventListener('click', function(e) {
        const jobCard = e.target.closest('.job-card');
        if (jobCard) {
            const jobId = parseInt(jobCard.dataset.jobId);
            const job = state.jobs.find(j => j.id === jobId);
            
            if (job) {
                showJobDetails(job);
            }
        }
        
        // Save button
        const saveBtn = e.target.closest('.btn-save');
        if (saveBtn) {
            e.stopPropagation();
            const jobCard = saveBtn.closest('.job-card');
            const jobId = parseInt(jobCard.dataset.jobId);
            toggleSaveJob(jobId, saveBtn, state);
        }
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreJobs');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Laddar...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading more jobs
            setTimeout(() => {
                // In a real app, this would load from an API
                loadMoreBtn.innerHTML = '<i class="fas fa-redo"></i> Ladda fler uppdrag';
                loadMoreBtn.disabled = false;
                
                window.showToast?.('Fler uppdrag laddade!');
            }, 1000);
        });
    }
}

function showJobDetails(job) {
    // This would open a modal in a real implementation
    console.log('Showing job details:', job);
    
    window.showToast?.(`Visar detaljer för: ${job.title}`);
}

function toggleSaveJob(jobId, button, state) {
    const isSaved = state.savedJobs.includes(jobId);
    const icon = button.querySelector('i');
    
    if (isSaved) {
        // Remove from saved
        state.savedJobs = state.savedJobs.filter(id => id !== jobId);
        icon.className = 'far fa-bookmark';
        window.showToast?.('Uppdrag borttaget från sparade');
    } else {
        // Add to saved
        state.savedJobs.push(jobId);
        icon.className = 'fas fa-bookmark';
        window.showToast?.('Uppdrag sparat!');
    }
    
    // Save state
    if (window.PACT) {
        window.PACT.saveState();
    }
}