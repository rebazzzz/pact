/**
 * Jobs Module
 * Handles job listings, filtering, and matching
 */

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "Hjälp med IKEA-möbelmontering",
    description:
      "Behöver hjälp att montera en BILLY bokhylla och en MALM säng. Har alla delar och instruktioner.",
    price: "450 kr",
    location: "Stockholm, Södermalm",
    time: "2-3 timmar",
    category: "assembly",
    skills: ["Möbelmontering", "DIY"],
    matchScore: 95,
    author: "Anna",
    date: "Idag",
    icon: "fas fa-tools",
  },
  {
    id: 2,
    title: "Transport av soffa",
    description:
      "Behöver hjälp att transportera en 3-sits soffa från Kungens kurva till Sollentuna. Har bil med takräcke.",
    price: "700 kr",
    location: "Stockholm, Kungens kurva",
    time: "Halvdag",
    category: "moving",
    skills: ["Transport", "Lastning"],
    matchScore: 82,
    author: "Marcus",
    date: "Idag",
    icon: "fas fa-truck-moving",
  },
  {
    id: 3,
    title: "Hjälp med datorinstallation",
    description:
      "Behöver hjälp att installera Windows och sätta upp skrivare och wifi på min nya dator.",
    price: "350 kr",
    location: "Stockholm, Vasastan",
    time: "1-2 timmar",
    category: "tech",
    skills: ["Tekniksupport", "Installation"],
    matchScore: 78,
    author: "Elin",
    date: "Igår",
    icon: "fas fa-laptop",
  },
  {
    id: 4,
    title: "Städhjälp inför fest",
    description:
      "Behöver extra städhjälp i lägenheten (85 kvm) inför en fest på lördag.",
    price: "600 kr",
    location: "Stockholm, Östermalm",
    time: "3-4 timmar",
    category: "cleaning",
    skills: ["Städning", "Organisation"],
    matchScore: 65,
    author: "David",
    date: "Igår",
    icon: "fas fa-broom",
  },
  {
    id: 5,
    title: "Måla om ett rum",
    description:
      "Behöver hjälp att måla om ett sovrum på ca 15 kvm. All material finns på plats.",
    price: "1200 kr",
    location: "Stockholm, Hägersten",
    time: "Helgdag",
    category: "painting",
    skills: ["Måleri", "Renovering"],
    matchScore: 88,
    author: "Sofia",
    date: "2 dagar sedan",
    icon: "fas fa-paint-roller",
  },
  {
    id: 6,
    title: "Hjälp med flytt",
    description:
      "Behöver hjälp att bära möbler och kartonger från 3:e våningen (hiss finns).",
    price: "900 kr",
    location: "Stockholm, Bromma",
    time: "Halvdag",
    category: "moving",
    skills: ["Flytt", "Lastning"],
    matchScore: 91,
    author: "Johan",
    date: "2 dagar sedan",
    icon: "fas fa-box-open",
  },
  {
    id: 7,
    title: "Barnpassning för två barn",
    description:
      "Behöver barnvakt för två barn (5 och 8 år) på fredag kväll. Lek, matlagning och sängdags.",
    price: "400 kr",
    location: "Stockholm, Gamla stan",
    time: "4 timmar",
    category: "trending",
    skills: ["Barnpassning", "Lek"],
    matchScore: 85,
    author: "Maria",
    date: "Idag",
    icon: "fas fa-child",
  },
  {
    id: 8,
    title: "Bilvård och tvätt",
    description:
      "Behöver hjälp att tvätta och vaxa bilen både utvändigt och invändigt. Har alla material.",
    price: "550 kr",
    location: "Stockholm, Solna",
    time: "2-3 timmar",
    category: "trending",
    skills: ["Bilvård", "Rengöring"],
    matchScore: 72,
    author: "Erik",
    date: "Igår",
    icon: "fas fa-car",
  },
];

// Sample categories
const categories = [
  {
    id: "assembly",
    name: "Assembly",
    icon: "fas fa-tools",
    count: 24,
    startingPrice: "Från 200 kr",
  },
  {
    id: "mounting",
    name: "Mounting",
    icon: "fas fa-cog",
    count: 18,
    startingPrice: "Från 150 kr",
  },
  {
    id: "moving",
    name: "Moving",
    icon: "fas fa-truck-moving",
    count: 32,
    startingPrice: "Från 300 kr",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    icon: "fas fa-broom",
    count: 15,
    startingPrice: "Från 250 kr",
  },
  {
    id: "outdoor",
    name: "Outdoor Help",
    icon: "fas fa-leaf",
    count: 12,
    startingPrice: "Från 180 kr",
  },
  {
    id: "repairs",
    name: "Home Repairs",
    icon: "fas fa-wrench",
    count: 9,
    startingPrice: "Från 220 kr",
  },
  {
    id: "painting",
    name: "Painting",
    icon: "fas fa-paint-roller",
    count: 11,
    startingPrice: "Från 280 kr",
  },
  {
    id: "trending",
    name: "Trending",
    icon: "fas fa-fire",
    count: 7,
    startingPrice: "Från 100 kr",
  },
];

// General subcategories (shown when no filter is selected)
const generalSubcategories = ["Populära", "Nya", "Snabbt", "Lokalt", "Betyg"];

// Service filters
const serviceFilters = [
  {
    id: "stad",
    name: "Städ",
    icon: "fas fa-broom",
    subcategories: ["Städning", "Fönsterputs", "Trädgård", "Kök", "Badrum"],
  },
  {
    id: "flytt",
    name: "Flytt",
    icon: "fas fa-truck-moving",
    subcategories: [
      "Flytt",
      "Transport",
      "Möbelmontering",
      "Packning",
      "Upphämtning",
    ],
  },
  {
    id: "barnpassning",
    name: "Barnpassning",
    icon: "fas fa-child",
    subcategories: [
      "Barnpassning",
      "Hundpassning",
      "Äldrevård",
      "Lektioner",
      "Hushåll",
    ],
  },
  {
    id: "bilvard",
    name: "Bilvård",
    icon: "fas fa-car",
    subcategories: [
      "Bilvård",
      "Cykelreparation",
      "Motoreparation",
      "Däckbyte",
      "Polering",
    ],
  },
  {
    id: "hem-teknik",
    name: "Hem & teknik",
    icon: "fas fa-home",
    subcategories: [
      "Tekniksupport",
      "Installation",
      "Reparationer",
      "Wifi",
      "Smart Home",
    ],
  },
  {
    id: "tradgard",
    name: "Trädgård",
    icon: "fas fa-leaf",
    subcategories: [
      "Trädgård",
      "Snöskottning",
      "Gräsklippning",
      "Plantering",
      "Trädvård",
    ],
  },
  {
    id: "fler",
    name: "Fler",
    icon: "fas fa-ellipsis-h",
    subcategories: ["Övrigt", "Fest", "Evenemang", "Special"],
  },
];

export function initJobs(state) {
  console.log("📋 Initializing jobs module...");

  // Load jobs into state
  state.jobs = [...sampleJobs];
  state.currentFilter = "all";
  state.currentSubcategory = null;

  // Initialize UI
  renderCategories();
  renderServiceFilters();
  renderSubcategories(state);
  renderJobs(state);

  // Setup event listeners
  setupJobEventListeners(state);
}

function renderCategories() {
  const container = document.getElementById("categoryGrid");
  if (!container) return;

  const html = categories
    .map(
      (category) => `
        <div class="category-card" data-category="${category.id}">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h4>${category.name}</h4>
            <span class="category-count">${category.count} uppdrag</span>
        </div>
    `,
    )
    .join("");

  container.innerHTML = html;
}

function renderServiceFilters() {
  const container = document.getElementById("filtersList");
  if (!container) return;

  const html = serviceFilters
    .map(
      (filter) => `
        <div class="filter-item" data-filter="${filter.id}">
            <div class="filter-icon">
                <i class="${filter.icon}"></i>
            </div>
            <span class="filter-name">${filter.name}</span>
        </div>
    `,
    )
    .join("");

  container.innerHTML = html;
}

function renderSubcategories(state) {
  const container = document.getElementById("subcategoriesList");
  if (!container) return;

  let subcategories = [];

  if (state.currentFilter === "all") {
    // Show general subcategories when no filter is selected
    subcategories = generalSubcategories;
  } else {
    // Find the active filter and show its specific subcategories
    const activeFilter = serviceFilters.find((filter) => {
      const filterToCategoryMap = {
        stad: "cleaning",
        flytt: "moving",
        barnpassning: "trending",
        bilvard: "trending",
        "hem-teknik": "repairs",
        tradgard: "outdoor",
        fler: "all",
      };
      return filterToCategoryMap[filter.id] === state.currentFilter;
    });

    if (activeFilter) {
      subcategories = activeFilter.subcategories;
    }
  }

  const html = subcategories
    .map(
      (sub) =>
        `<span class="subcategory-item" data-subcategory="${sub}">${sub}</span>`,
    )
    .join("");

  container.innerHTML = html;
}

function renderJobs(state) {
  const container = document.getElementById("jobGrid");
  if (!container) return;

  let filteredJobs = state.jobs;

  // Filter by category
  if (state.currentFilter !== "all") {
    filteredJobs = filteredJobs.filter(
      (job) => job.category === state.currentFilter,
    );
  }

  // Filter by subcategory
  if (state.currentSubcategory) {
    filteredJobs = filteredJobs.filter((job) =>
      job.skills.includes(state.currentSubcategory),
    );
  }

  // Render jobs
  const html = filteredJobs
    .map(
      (job) => `
        <div class="job-card" data-job-id="${job.id}">
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
                    ${job.skills.map((skill) => `<span class="job-tag">${skill}</span>`).join("")}
                </div>

            </div>
        </div>
    `,
    )
    .join("");

  container.innerHTML = html;
}

function setupJobEventListeners(state) {
  // Category cards
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.dataset.category;
      state.currentFilter = category;
      renderJobs(state);

      // Scroll to job listings
      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Service filters
  document.addEventListener("click", function (e) {
    const subcategoryItem = e.target.closest(".subcategory-item");
    if (subcategoryItem) {
      const subcategory = subcategoryItem.dataset.subcategory;

      // Check if this subcategory is already active
      const isActive = subcategoryItem.classList.contains("active");

      if (isActive) {
        // If clicking the active subcategory, deselect it
        state.currentSubcategory = null;
        renderJobs(state);

        // Update active subcategory visual
        document
          .querySelectorAll(".subcategory-item")
          .forEach((item) => item.classList.remove("active"));

        window.showToast?.("Visar alla uppdrag i kategorin");
      } else {
        // Select the new subcategory
        state.currentSubcategory = subcategory;
        renderJobs(state);

        // Update active subcategory visual
        document
          .querySelectorAll(".subcategory-item")
          .forEach((item) => item.classList.remove("active"));
        subcategoryItem.classList.add("active");

        window.showToast?.(`Visar ${subcategory} uppdrag`);
      }
      return;
    }

    const filterItem = e.target.closest(".filter-item");
    if (filterItem) {
      const filterId = filterItem.dataset.filter;

      // Map filter IDs to category IDs
      const filterToCategoryMap = {
        stad: "cleaning",
        flytt: "moving",
        barnpassning: "trending", // or create a new category
        bilvard: "trending", // or create a new category
        "hem-teknik": "repairs",
        tradgard: "outdoor",
        fler: "all",
      };

      const category = filterToCategoryMap[filterId] || "all";

      // Check if this filter is already active
      const isActive = filterItem.classList.contains("active");

      if (isActive) {
        // If clicking the active filter, deselect it and show all jobs
        state.currentFilter = "all";
        state.currentSubcategory = null;
        renderSubcategories(state);
        renderJobs(state);

        // Update active filter visual
        document
          .querySelectorAll(".filter-item")
          .forEach((item) => item.classList.remove("active"));

        // Reset subcategory active states
        document
          .querySelectorAll(".subcategory-item")
          .forEach((item) => item.classList.remove("active"));

        window.showToast?.("Visar alla uppdrag");
      } else {
        // Select the new filter
        state.currentFilter = category;
        state.currentSubcategory = null; // Reset subcategory when main filter is clicked
        renderSubcategories(state); // Update subcategories
        renderJobs(state);

        // Update active filter visual
        document
          .querySelectorAll(".filter-item")
          .forEach((item) => item.classList.remove("active"));
        filterItem.classList.add("active");

        // Reset subcategory active states
        document
          .querySelectorAll(".subcategory-item")
          .forEach((item) => item.classList.remove("active"));

        window.showToast?.(
          `Visar ${filterItem.querySelector(".filter-name").textContent} uppdrag`,
        );
      }
    }
  });

  // Job cards (delegated)
  document.addEventListener("click", function (e) {
    const jobCard = e.target.closest(".job-card");
    if (jobCard) {
      const jobId = parseInt(jobCard.dataset.jobId);
      const job = state.jobs.find((j) => j.id === jobId);

      if (job) {
        showJobDetails(job);
      }
    }
  });

  // Load more button
  const loadMoreBtn = document.getElementById("loadMoreJobs");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      loadMoreBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Laddar...';
      loadMoreBtn.disabled = true;

      // Simulate loading more jobs
      setTimeout(() => {
        // In a real app, this would load from an API
        loadMoreBtn.innerHTML =
          '<i class="fas fa-redo"></i> Ladda fler uppdrag';
        loadMoreBtn.disabled = false;

        window.showToast?.("Fler uppdrag laddade!");
      }, 1000);
    });
  }
}

function showJobDetails(job) {
  // This would open a modal in a real implementation
  console.log("Showing job details:", job);

  window.showToast?.(`Visar detaljer för: ${job.title}`);
}

function toggleSaveJob(jobId, button, state) {
  const isSaved = state.savedJobs.includes(jobId);
  const icon = button.querySelector("i");

  if (isSaved) {
    // Remove from saved
    state.savedJobs = state.savedJobs.filter((id) => id !== jobId);
    icon.className = "far fa-bookmark";
    window.showToast?.("Uppdrag borttaget från sparade");
  } else {
    // Add to saved
    state.savedJobs.push(jobId);
    icon.className = "fas fa-bookmark";
    window.showToast?.("Uppdrag sparat!");
  }

  // Save state
  if (window.PACT) {
    window.PACT.saveState();
  }
}
