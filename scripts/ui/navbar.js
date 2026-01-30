/**
 * Dynamic Navbar Component
 * Generates navbar HTML based on app state
 */

export function initNavbar(state) {
  console.log("🧭 Initializing dynamic navbar...");

  const navbarContainer = document.querySelector(".navbar");
  if (!navbarContainer) {
    console.warn("Navbar container not found");
    return;
  }

  // Generate navbar HTML
  const navbarHTML = generateNavbarHTML(state);
  navbarContainer.innerHTML = navbarHTML;

  // Setup event listeners
  setupNavbarEvents(state);
}

function generateNavbarHTML(state) {
  const { user } = state;
  const currentPath = window.location.pathname;

  // Hide "Hem" link if on index page
  const hemLink = currentPath.includes("index.html")
    ? ""
    : '<a href="index.html" class="nav-link">Hem</a>';

  // Hide "Tjänster" link if on services page
  const tjansterLink = currentPath.includes("tjanster.html")
    ? ""
    : '<a href="tjanster.html" class="nav-link">Tjänster</a>';

  // Hide "Så funkar det" link if on that page
  const saFunkarDetLink = currentPath.includes("sa-funkar-det.html")
    ? ""
    : '<a href="sa-funkar-det.html" class="nav-link">Så funkar det</a>';

  // Hide "Profil" link if on profile page
  const profilLink = currentPath.includes("profil.html")
    ? ""
    : '<a href="profil.html" class="nav-link">Profil</a>';

  // Hide user-switch if on profile page
  const userSwitch = currentPath.includes("profil.html")
    ? ""
    : `
        <div class="user-switch">
            <div class="switch-label">Jag vill:</div>
            <div class="switch-buttons">
                <button class="switch-btn ${user.mode === "helper" ? "active" : ""}" data-mode="helper">
                    <i class="fas fa-hands-helping"></i>
                    <span>Hjälpa till</span>
                </button>
                <button class="switch-btn ${user.mode === "needer" ? "active" : ""}" data-mode="needer">
                    <i class="fas fa-question-circle"></i>
                    <span>Få hjälp</span>
                </button>
            </div>
        </div>
    `;

  return `
        <a href="/" class="logo">
            <span class="logo-icon">PACT</span>
            <span class="logo-text">pact.se</span>
        </a>

        <div class="nav-menu" id="navMenu">
            ${hemLink}
            ${tjansterLink}
            ${saFunkarDetLink}
            ${profilLink}

            ${userSwitch}

            <div class="nav-actions">
                <button class="btn btn-primary btn-small" id="postJobBtn">
                    <i class="fas fa-plus"></i> Nytt uppdrag
                </button>
                <div class="user-menu">
            <a href="profil.html">
                    <div class="user-avatar" id="userAvatar">${user.name.charAt(0)}</div>
            </a>
                </div>
            </div>
        </div>

        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
            <i class="fas fa-bars"></i>
        </button>
    `;
}

function setupNavbarEvents(state) {
  // User mode switching
  document.querySelectorAll(".switch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      // Update state and re-render navbar
      state.user.mode = mode;
      initNavbar(state);
      window.showToast?.(
        `Du är nu i ${mode === "helper" ? "hjälparläge" : "behöver-hjälp-läge"}`,
      );
    });
  });

  // Post job button
  const postJobBtn = document.getElementById("postJobBtn");
  if (postJobBtn) {
    postJobBtn.addEventListener("click", () => {
      window.showToast?.("Öppnar formulär för att lägga ut uppdrag...");
    });
  }

  // Menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
}
