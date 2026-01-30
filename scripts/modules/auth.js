/**
 * Authentication Module
 * Handles user authentication and profile management
 */

export function initAuth(userState) {
  console.log("👤 Initializing auth module...");

  // Load user data from localStorage
  loadUserData(userState);

  // Initialize event listeners
  setupAuthEventListeners(userState);
}

function loadUserData(userState) {
  try {
    const savedUser = JSON.parse(localStorage.getItem("pactUser"));
    if (savedUser) {
      Object.assign(userState, savedUser);
      updateUserUI(userState);
    }
  } catch (error) {
    console.warn("Could not load user data:", error);
  }
}

function updateUserUI(userState) {
  // Update user avatar
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar && userState.name) {
    userAvatar.textContent = userState.name.charAt(0).toUpperCase();
  }

  // Update profile page if it exists
  updateProfilePage(userState);
}

function updateProfilePage(userState) {
  const profileName = document.querySelector(".profile-details h2");
  if (profileName && userState.name) {
    profileName.textContent = userState.name;
  }

  const profileTitle = document.querySelector(".profile-title");
  if (profileTitle && userState.title) {
    profileTitle.textContent = userState.title;
  }
}

function setupAuthEventListeners(userState) {
  // Edit profile button
  const editProfileBtn = document.getElementById("editProfileBtn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      showEditProfileModal(userState);
    });
  }

  // View stats button
  const viewStatsBtn = document.getElementById("viewStatsBtn");
  if (viewStatsBtn) {
    viewStatsBtn.addEventListener("click", () => {
      showStatsModal(userState);
    });
  }

  // User avatar click
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", () => {
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
                    <h3>Hantera profil</h3>
                    <button class="modal-close" id="closeEditProfileModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="profile-management-grid">
                        <div class="management-card">
                            <div class="management-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="management-content">
                                <h4>Personuppgifter</h4>
                                <p>BankID-verifierad</p>
                            </div>
                            <button class="btn btn-outline btn-small">Redigera</button>
                        </div>

                        <div class="management-card">
                            <div class="management-icon">
                                <i class="fas fa-user-tag"></i>
                            </div>
                            <div class="management-content">
                                <h4>Roller</h4>
                                <p>Kund & Utförare</p>
                            </div>
                            <button class="btn btn-outline btn-small">Ändra</button>
                        </div>

                        <div class="management-card">
                            <div class="management-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="management-content">
                                <h4>Område</h4>
                                <p>Stockholm</p>
                            </div>
                            <button class="btn btn-outline btn-small">Uppdatera</button>
                        </div>

                        <div class="management-card">
                            <div class="management-icon">
                                <i class="fas fa-language"></i>
                            </div>
                            <div class="management-content">
                                <h4>Språk</h4>
                                <p>Svenska, Engelska</p>
                            </div>
                            <button class="btn btn-outline btn-small">Ändra</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

  // Add modal to page
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Show modal
  const modal = document.getElementById("editProfileModal");
  modal.style.display = "flex";

  // Setup modal event listeners
  setupProfileModalListeners(modal, userState);
}

function setupProfileModalListeners(modal, userState) {
  // Close button
  const closeBtn = modal.querySelector("#closeEditProfileModal");

  const closeModal = () => {
    modal.remove();
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Management card buttons
  modal.querySelectorAll(".management-card button").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".management-card");
      const title = card.querySelector("h4").textContent;
      window.showToast?.(`Öppnar ${title} inställningar...`);
      // In a real implementation, this would open specific edit forms
    });
  });
}

function saveProfileChanges(modal, userState) {
  const form = modal.querySelector("#profileForm");
  if (!form) return;

  // Get form values
  userState.name = form.querySelector("#profileName").value.trim();
  userState.title = form.querySelector("#profileTitle").value.trim();
  userState.location = form.querySelector("#profileLocation").value;
  userState.bio = form.querySelector("#profileBio").value.trim();
  userState.availability =
    form.querySelector('input[name="availability"]:checked')?.value || "part";

  // Validate
  if (!userState.name) {
    window.showToast?.("Vänligen fyll i ditt namn");
    return;
  }

  // Save to localStorage
  try {
    localStorage.setItem("pactUser", JSON.stringify(userState));
    window.showToast?.("Profil sparad!");

    // Update UI
    updateUserUI(userState);

    // Close modal
    modal.remove();

    // Trigger global save if available
    if (window.PACT?.saveState) {
      window.PACT.saveState();
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    window.showToast?.("Kunde inte spara profilen");
  }
}

function showStatsModal(userState) {
  window.showToast?.("Öppnar detaljerad statistik...");
  // In a real implementation, this would show detailed statistics
}

function toggleUserMenu() {
  window.showToast?.("Öppnar användarmeny...");
  // In a real implementation, this would toggle a user dropdown menu
}
