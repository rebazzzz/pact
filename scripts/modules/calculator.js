/**
 * Pricing Calculator Module
 */

export function initCalculator() {
    console.log('💰 Initializing pricing calculator...');
    
    // Initialize calculator
    setupCalculator();
    
    // Setup event listeners
    setupCalculatorEventListeners();
}

function setupCalculator() {
    // Initial calculation
    calculatePrice();
}

function setupCalculatorEventListeners() {
    // Time slider
    const timeSlider = document.getElementById('calcTime');
    const timeValue = document.getElementById('timeValue');
    
    if (timeSlider && timeValue) {
        timeSlider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            timeValue.textContent = value === 1 ? '1 timme' : `${value} timmar`;
            calculatePrice();
        });
    }
    
    // Complexity buttons
    const complexityButtons = document.querySelectorAll('.complexity-option');
    complexityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            complexityButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculatePrice();
        });
    });
    
    // Category select
    const categorySelect = document.getElementById('calcCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', calculatePrice);
    }
    
    // Location select
    const locationSelect = document.getElementById('calcLocation');
    if (locationSelect) {
        locationSelect.addEventListener('change', calculatePrice);
    }
    
    // Use price button
    const usePriceBtn = document.getElementById('usePriceBtn');
    if (usePriceBtn) {
        usePriceBtn.addEventListener('click', () => {
            const minPrice = document.getElementById('priceMin').textContent;
            const maxPrice = document.getElementById('priceMax').textContent;
            window.showToast?.(`Pris ${minPrice}-${maxPrice} har lagts till i ditt uppdrag`);
        });
    }
}

function calculatePrice() {
    // Get inputs
    const time = parseFloat(document.getElementById('calcTime').value);
    const complexityBtn = document.querySelector('.complexity-option.active');
    const complexity = complexityBtn ? complexityBtn.dataset.level : 'medium';
    const category = document.getElementById('calcCategory').value;
    const location = document.getElementById('calcLocation').value;
    
    // Base rates by category (SEK per hour)
    const baseRates = {
        'assembly': 150,
        'moving': 200,
        'tech': 180,
        'cleaning': 120,
        'garden': 130,
        'painting': 160,
        'repair': 170
    };
    
    // Complexity multipliers
    const complexityMultipliers = {
        'simple': 1.0,
        'medium': 1.25,
        'complex': 1.5
    };
    
    // Location multipliers
    const locationMultipliers = {
        'stockholm': 1.2,
        'goteborg': 1.1,
        'malmo': 1.1,
        'other': 1.0
    };
    
    // Calculate
    const baseRate = baseRates[category] || 150;
    const complexityMultiplier = complexityMultipliers[complexity] || 1.25;
    const locationMultiplier = locationMultipliers[location] || 1.0;
    
    const basePrice = time * baseRate;
    const complexityAdd = basePrice * (complexityMultiplier - 1);
    const locationAdd = basePrice * (locationMultiplier - 1);
    
    const totalPrice = Math.round(basePrice + complexityAdd + locationAdd);
    const minPrice = Math.round(totalPrice * 0.85);
    const maxPrice = Math.round(totalPrice * 1.15);
    
    // Update UI
    updatePriceDisplay(minPrice, maxPrice, basePrice, complexityAdd, locationAdd, totalPrice);
}

function updatePriceDisplay(minPrice, maxPrice, basePrice, complexityAdd, locationAdd, totalPrice) {
    // Update price range
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin) priceMin.textContent = `${minPrice} kr`;
    if (priceMax) priceMax.textContent = `${maxPrice} kr`;
    
    // Update breakdown
    const breakdownRows = document.querySelectorAll('.breakdown-row');
    if (breakdownRows.length >= 4) {
        // Time display
        const time = parseFloat(document.getElementById('calcTime').value);
        const timeText = time === 1 ? 'timme' : 'timmar';
        
        breakdownRows[0].querySelector('span:first-child').textContent = `Baspris (${time} ${timeText})`;
        breakdownRows[0].querySelector('span:last-child').textContent = `${Math.round(basePrice)} kr`;
        
        // Complexity add
        breakdownRows[1].querySelector('span:last-child').textContent = `+${Math.round(complexityAdd)} kr`;
        
        // Location add
        breakdownRows[2].querySelector('span:last-child').textContent = `+${Math.round(locationAdd)} kr`;
        
        // Total
        breakdownRows[3].querySelector('span:last-child').textContent = `${totalPrice} kr`;
    }
    
    // Update market comparison
    const marketComparison = document.querySelector('.market-comparison span');
    if (marketComparison) {
        const marketMin = Math.round(totalPrice * 0.85);
        const marketMax = Math.round(totalPrice * 1.15);
        marketComparison.textContent = `Marknadspris i området: ${marketMin}-${marketMax} kr`;
    }
}