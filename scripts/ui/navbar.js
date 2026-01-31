/**
 * Dynamic Navbar Component
 * Updated for clean, professional layout
 * Focus: Uppdrag, Så funkar det, Bli utförare
 */

export function initNavbar(state) {
  console.log("🧭 Initializing navbar...");

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

  // Left navigation links
  const hemLink =
    currentPath === "/" || currentPath === "/index.html"
      ? ""
      : '<a href="index.html" class="nav-link">Hem</a>';

  const uppdragLink = currentPath.includes("tjanster.html")
    ? ""
    : '<a href="tjanster.html" class="nav-link">Uppdrag</a>';

  const saFunkarDetLink = currentPath.includes("sa-funkar-det.html")
    ? ""
    : '<a href="sa-funkar-det.html" class="nav-link">Så funkar det</a>';

  const bliUtförareLink = currentPath.includes("bli-utförare.html")
    ? ""
    : '<a href="bli-utförare.html" class="nav-link">Bli utförare</a>';

  // Right actions
  const navActions = `
        <div class="nav-actions">
            <button class="btn btn-primary btn-small" id="postJobBtn">
                <i class="fas fa-plus"></i> Nytt uppdrag
            </button>
            <a href="profil.html" class="user-avatar" id="userAvatar">
                ${user.name.charAt(0)}
            </a>
        </div>
    `;

  // Full HTML
  return `
        <a href="/" class="logo">
            <span class="logo-icon">PACT</span>
            <span class="logo-text">pact.se</span>
        </a>

        <div class="nav-menu" id="navMenu">
            ${hemLink}
            ${uppdragLink}
            ${saFunkarDetLink}
            ${bliUtförareLink}

            ${navActions}
        </div>

        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
            <i class="fas fa-bars"></i>
        </button>
    `;
}

function setupNavbarEvents(state) {
  // Post job button
  const postJobBtn = document.getElementById("postJobBtn");
  if (postJobBtn) {
    postJobBtn.addEventListener("click", () => {
      window.showToast?.("Öppnar formulär för att lägga ut uppdrag...");
    });
  }

  // Menu toggle for mobile
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
}
