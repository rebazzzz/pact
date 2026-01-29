/**
 * Calendar Module
 * Handles calendar functionality and availability
 */

export function initCalendar() {
    console.log('📅 Initializing calendar module...');
    
    // Initialize mini calendar
    renderMiniCalendar();
    
    // Initialize availability slots
    renderAvailabilitySlots();
    
    // Setup event listeners
    setupCalendarEventListeners();
}

function renderMiniCalendar() {
    const container = document.getElementById('miniCalendar');
    if (!container) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get days in month and first day
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Month names in Swedish
    const monthNames = [
        'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
        'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
    ];
    
    // Day names in Swedish (short)
    const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    
    // Create calendar HTML
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav prev-month">
                <i class="fas fa-chevron-left"></i>
            </button>
            <h4>${monthNames[currentMonth]} ${currentYear}</h4>
            <button class="calendar-nav next-month">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="calendar-grid">
    `;
    
    // Day names
    dayNames.forEach(day => {
        html += `<div class="calendar-day day-name">${day}</div>`;
    });
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && 
                       currentMonth === today.getMonth() && 
                       currentYear === today.getFullYear();
        
        // Simulate some days having jobs (random for demo)
        const hasJob = Math.random() > 0.7;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (hasJob) classes += ' has-event';
        
        html += `<div class="${classes}" data-day="${day}">${day}</div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function renderAvailabilitySlots() {
    const container = document.getElementById('availabilitySlots');
    if (!container) return;
    
    // Days and time slots
    const days = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    const slots = [
        { time: '09-12', label: 'Förmiddag' },
        { time: '12-15', label: 'Eftermiddag' },
        { time: '15-18', label: 'Kväll' },
        { time: '18-21', label: 'Sen kväll' }
    ];
    
    let html = '';
    
    // Time slots header
    html += '<div class="slot header"></div>';
    slots.forEach(slot => {
        html += `<div class="slot header" title="${slot.label}">${slot.time}</div>`;
    });
    
    // Days and slots
    days.forEach(day => {
        html += `<div class="slot day-header">${day}</div>`;
        
        slots.forEach(slot => {
            const slotId = `${day}-${slot.time}`;
            // Load saved availability or use random for demo
            const isAvailable = localStorage.getItem(`availability-${slotId}`) === 'true' || 
                               Math.random() > 0.6;
            
            const classes = ['slot', 'time-slot'];
            if (isAvailable) classes.push('available');
            
            html += `
                <div class="${classes.join(' ')}" data-slot="${slotId}" 
                     title="${day} ${slot.time} - ${slot.label}">
                    ${isAvailable ? '<i class="fas fa-check"></i>' : ''}
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
}

function setupCalendarEventListeners() {
    // Day clicks in mini calendar
    document.addEventListener('click', function(e) {
        const calendarDay = e.target.closest('.calendar-day:not(.empty):not(.day-name)');
        if (calendarDay) {
            const day = calendarDay.dataset.day;
            showDayDetails(day);
        }
        
        // Navigation buttons
        const prevMonthBtn = e.target.closest('.prev-month');
        const nextMonthBtn = e.target.closest('.next-month');
        
        if (prevMonthBtn || nextMonthBtn) {
            // In a real app, this would navigate months
            window.showToast?.(`${prevMonthBtn ? 'Föregående' : 'Nästa'} månad (demo)`);
        }
    });
    
    // Availability slot clicks
    document.addEventListener('click', function(e) {
        const timeSlot = e.target.closest('.time-slot');
        if (timeSlot) {
            toggleAvailabilitySlot(timeSlot);
        }
    });
    
    // Availability toggle
    const availabilityToggle = document.getElementById('availabilityToggle');
    if (availabilityToggle) {
        availabilityToggle.addEventListener('change', function() {
            const status = this.checked ? 'tillgänglig' : 'otillgänglig';
            window.showToast?.(`Du är nu ${status} för nya uppdrag`);
            
            // Update all slots if turning off availability
            if (!this.checked) {
                clearAllAvailabilitySlots();
            }
        });
    }
    
    // Edit availability button
    const editAvailabilityBtn = document.getElementById('editAvailability');
    if (editAvailabilityBtn) {
        editAvailabilityBtn.addEventListener('click', () => {
            window.showToast?.('Redigerar tillgänglighet...');
        });
    }
    
    // Add to calendar button
    const addToCalendarBtn = document.getElementById('addToCalendar');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', () => {
            showAddEventModal();
        });
    }
}

function toggleAvailabilitySlot(slot) {
    const slotId = slot.dataset.slot;
    const isAvailable = slot.classList.contains('available');
    
    if (isAvailable) {
        slot.classList.remove('available');
        slot.innerHTML = '';
        localStorage.setItem(`availability-${slotId}`, 'false');
        window.showToast?.('Tillgänglighet borttagen');
    } else {
        slot.classList.add('available');
        slot.innerHTML = '<i class="fas fa-check"></i>';
        localStorage.setItem(`availability-${slotId}`, 'true');
        window.showToast?.('Tillgänglighet lagd till');
    }
}

function clearAllAvailabilitySlots() {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('available');
        slot.innerHTML = '';
        const slotId = slot.dataset.slot;
        localStorage.setItem(`availability-${slotId}`, 'false');
    });
}

function showDayDetails(day) {
    // In a real app, this would show events for the selected day
    window.showToast?.(`Visar uppdrag för den ${day}:e`);
}

function showAddEventModal() {
    // In a real app, this would show a modal to add events
    window.showToast?.('Lägger till nytt kalenderhändelse...');
}