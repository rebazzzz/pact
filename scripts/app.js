/**
 * PACT Platform - Main Application
 * Initializes all modules and handles global state
 */

import { initNavbar } from "./ui/navbar.js";
import { initFooter } from "./ui/footer.js";
import { initAuth } from "./modules/auth.js";
import { initJobs } from "./modules/jobs.js";
import { initProfile } from "./modules/profile.js";
import { initCalendar } from "./modules/calendar.js";
import { initMatching } from "./modules/matching.js";
import { initModals } from "./ui/modals.js";
import { initNotifications } from "./ui/notifications.js";

// Global state
const PACT = {
  state: {
    user: {
      id: null,
      name: "Anders",
      mode: "helper", // 'helper' or 'needer'
      location: "Stockholm",
      isVerified: true,
    },
    jobs: [],
    matches: [],
    savedJobs: [],
    skills: [],
    calendarEvents: [],
  },

  // Initialize all modules
  init: function () {
    console.log("🚀 PACT Platform initializing...");

    // Load saved state
    this.loadState();

    // Initialize modules
    initNavbar(this.state);
    initFooter(this.state);
    initAuth(this.state.user);
    initJobs(this.state);
    initProfile(this.state);
    initCalendar();
    initMatching(this.state);
    initModals();
    initNotifications();

    // Setup event listeners
    this.setupEventListeners();

    // Update UI
    this.updateUI();

    console.log("✅ PACT Platform ready!");
  },

  // Load state from localStorage
  loadState: function () {
    try {
      const savedState = JSON.parse(localStorage.getItem("pactState"));
      if (savedState) {
        this.state = { ...this.state, ...savedState };
      }
    } catch (error) {
      console.warn("Could not load saved state:", error);
    }
  },

  // Save state to localStorage
  saveState: function () {
    try {
      localStorage.setItem("pactState", JSON.stringify(this.state));
    } catch (error) {
      console.warn("Could not save state:", error);
    }
  },

  // Update UI based on state
  updateUI: function () {
    // Update user mode
    const helperMode = document.querySelector(
      '.switch-btn[data-mode="helper"]',
    );
    const neederMode = document.querySelector(
      '.switch-btn[data-mode="needer"]',
    );

    if (helperMode && neederMode) {
      helperMode.classList.toggle("active", this.state.user.mode === "helper");
      neederMode.classList.toggle("active", this.state.user.mode === "needer");
    }

    // Update location
    const locationElement = document.getElementById("currentLocation");
    if (locationElement) {
      locationElement.textContent = this.state.user.location;
    }

    // Update user avatar
    const userAvatar = document.getElementById("userAvatar");
    if (userAvatar) {
      userAvatar.textContent = this.state.user.name.charAt(0);
    }
  },

  // Setup global event listeners
  setupEventListeners: function () {
    // User mode switching
    document.querySelectorAll(".switch-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        this.setUserMode(mode);
      });
    });

    // Location change
    const changeLocationBtn = document.getElementById("changeLocation");
    if (changeLocationBtn) {
      changeLocationBtn.addEventListener("click", () => {
        this.changeLocation();
      });
    }

    // Post job button
    const postJobBtn = document.getElementById("postJobBtn");
    if (postJobBtn) {
      postJobBtn.addEventListener("click", () => {
        this.showPostJobModal();
      });
    }

    // Save state on beforeunload
    window.addEventListener("beforeunload", () => {
      this.saveState();
    });
  },

  // Set user mode (helper/needer)
  setUserMode: function (mode) {
    this.state.user.mode = mode;
    this.updateUI();
    this.saveState();

    // Show notification
    const modeText = mode === "helper" ? "hjälparläge" : "behöver-hjälp-läge";
    window.showToast?.(`Du är nu i ${modeText}`);
  },

  // Change user location
  changeLocation: function () {
    const locations = [
      "Stockholm",
      "Göteborg",
      "Malmö",
      "Uppsala",
      "Linköping",
    ];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];

    this.state.user.location = randomLocation;
    this.updateUI();
    this.saveState();

    window.showToast?.(`Plats ändrad till ${randomLocation}`);
  },

  // Show post job modal
  showPostJobModal: function () {
    // This would open a modal in a real implementation
    window.showToast?.("Öppnar formulär för att lägga ut uppdrag...");
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  PACT.init();
});

// Make PACT available globally for debugging
window.PACT = PACT;
