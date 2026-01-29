/**
 * Matching Algorithm Module
 * Handles job matching and scoring
 */

export function initMatching(state) {
    console.log('🎯 Initializing matching module...');
    
    // Calculate match scores for all jobs
    calculateMatchScores(state);
}

function calculateMatchScores(state) {
    // In a real app, this would use complex matching logic
    // For demo, we'll simulate based on user preferences and job attributes
    
    const userSkills = ['Möbelmontering', 'Tekniksupport', 'Flytthjälp'];
    const userLocation = state.user.location || 'stockholm';
    
    state.jobs.forEach(job => {
        // Base score
        let score = 50;
        
        // Location match
        if (job.location.toLowerCase().includes(userLocation.toLowerCase())) {
            score += 20;
        } else if (job.location.includes('Stockholm')) {
            score += 10;
        }
        
        // Skill match
        const matchingSkills = job.skills.filter(skill => 
            userSkills.some(userSkill => 
                skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                userSkill.toLowerCase().includes(skill.toLowerCase())
            )
        ).length;
        
        score += matchingSkills * 15;
        
        // Time match (prefer shorter jobs)
        if (job.time.includes('1-2') || job.time.includes('2-3')) {
            score += 10;
        } else if (job.time.includes('Halvdag')) {
            score += 5;
        }
        
        // Price match (prefer mid-range)
        const price = parseInt(job.price);
        if (price >= 400 && price <= 800) {
            score += 10;
        }
        
        // Ensure score is between 0-100
        score = Math.max(0, Math.min(100, score));
        
        // Add some randomness for demo
        score += Math.random() * 10 - 5;
        score = Math.round(score);
        
        job.matchScore = score;
    });
}

// Matching reasons for UI display
export function getMatchReasons(job, userState) {
    const reasons = [];
    
    // Location reason
    if (job.location.includes(userState.location || 'Stockholm')) {
        reasons.push('Nära din plats');
    }
    
    // Skill reasons
    const userSkills = ['Möbelmontering', 'Tekniksupport', 'Flytthjälp'];
    const matchingSkills = job.skills.filter(skill => 
        userSkills.some(userSkill => 
            skill.toLowerCase().includes(userSkill.toLowerCase())
        )
    );
    
    if (matchingSkills.length > 0) {
        reasons.push(`Matchar dina kompetenser: ${matchingSkills.join(', ')}`);
    }
    
    // Time reason
    if (job.time.includes('1-2') || job.time.includes('2-3')) {
        reasons.push('Passar din kalender');
    }
    
    // Price reason
    const price = parseInt(job.price);
    if (price >= 400 && price <= 800) {
        reasons.push('Bra betalning');
    }
    
    // Add generic reasons if we don't have enough
    if (reasons.length < 2) {
        const genericReasons = [
            'Populärt uppdrag i ditt område',
            'Hög efterfrågan just nu',
            'Bra betyg från tidigare hjälpare',
            'Flexibla tider'
        ];
        
        while (reasons.length < 2) {
            const randomReason = genericReasons[Math.floor(Math.random() * genericReasons.length)];
            if (!reasons.includes(randomReason)) {
                reasons.push(randomReason);
            }
        }
    }
    
    return reasons.slice(0, 3); // Return max 3 reasons
}

// Get match score color
export function getMatchScoreColor(score) {
    if (score >= 80) return '#2E8B57'; // Green
    if (score >= 60) return '#FFA500'; // Orange
    return '#FF6B6B'; // Red
}

// Filter jobs by match score
export function filterJobsByMatch(jobs, minScore = 70) {
    return jobs.filter(job => job.matchScore >= minScore);
}