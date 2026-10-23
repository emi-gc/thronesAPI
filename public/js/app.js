import { getCharacters, getCharacter } from "../routes/api.js";

// Offline SVG Fallback for missing/broken sprites
const DEFAULT_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="100%" height="100%" fill="#2b3035"/>
    <circle cx="100" cy="100" r="60" fill="none" stroke="#6c757d" stroke-width="8"/>
    <line x1="40" y1="100" x2="160" y2="100" stroke="#6c757d" stroke-width="8"/>
    <circle cx="100" cy="100" r="18" fill="#2b3035" stroke="#6c757d" stroke-width="8"/>
    <text x="50%" y="185" font-family="sans-serif" font-size="14" fill="#adb5bd" text-anchor="middle">No Image</text>
  </svg>
`);

// DOM Elements
const catalogGrid = document.getElementById('catalog-grid');
const catalogSection = document.getElementById('catalog-section');
const catalogCount = document.getElementById('catalog-count');
const catalogSubtitle = document.getElementById('catalog-subtitle');
const loadingSpinner = document.getElementById('loading-spinner');
const errorView = document.getElementById('error-view');
const errorMessage = document.getElementById('error-message');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const errorResetBtn = document.getElementById('error-reset-btn');
const brandReset = document.getElementById('brand-reset');

// Modal Elements
const modalElement = document.getElementById('characters-modal');
const characterModal = new bootstrap.Modal(modalElement);
const modalName = document.getElementById('modal-name');
const modalId = document.getElementById('modal-id');
const modalImg = document.getElementById('modal-img');
const modalTypes = document.getElementById('modal-types');
const modalExp = document.getElementById('modal-exp');
const modalHeight = document.getElementById('modal-height');
const modalWeight = document.getElementById('modal-weight');
const modalAbilities = document.getElementById('modal-abilities');
const modalBorn = document.getElementById("modal-born");
const modalDied = document.getElementById("modal-died");
const modalAliases = document.getElementById("modal-aliases");
const modalMoves = document.getElementById('modal-moves');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const modalCrest = document.getElementById('modal-crest');

// Navigation state
let currentPrevId = null;
let currentNextId = null;
let isModalOpen = false;
let isLoading = false;

modalElement.addEventListener('shown.bs.modal', () => { isModalOpen = true; });
modalElement.addEventListener('hidden.bs.modal', () => { isModalOpen = false; });

/**
 * Fetch and render the catalog list from the student's Express API
 */
async function loadCatalog(searchQuery = '') {
  if(isLoading) return;

  isLoading = true;
  showLoading(true);
  hideError();

  try {
    // Define your search enpoint here.
    const list = await getCharacters(searchQuery);
    if (list.length === 0) {
      showError(searchQuery ? `No character found matching "${searchQuery}".` : 'The catalog is empty.');
      return;
    } 
    
    renderCatalog(list, searchQuery);
  } catch (err) {
    showError(err.message);
  } finally {
      isLoading = false;
      showLoading(false);
    }
  }


/**
 * Render catalog cards inside the scrollable container
 */
function renderCatalog(characterList, searchQuery) {
  catalogSection.classList.remove('d-none');
  catalogGrid.innerHTML = '';
  catalogCount.textContent = `${characterList.length} entries`;
  catalogSubtitle.textContent = searchQuery ? `Search Results for "${searchQuery}"` : 'All Characters';

  characterList.forEach((character) => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card h-100 char-card bg-body-tertiary border-secondary-subtle text-center p-2';
    card.addEventListener('click', () => openDetail(character.id));

    const img = document.createElement('img');
    img.className = 'card-img-top char-card-img mx-auto my-2';
    img.alt = character.fullName;
    img.onerror = () => { img.onerror = null; img.src = DEFAULT_IMAGE; };
    img.src = character.image || DEFAULT_IMAGE;

    const body = document.createElement('div');
    body.className = 'card-body p-1';

    const idBadge = document.createElement('span');
    idBadge.className = 'badge bg-secondary-subtle text-secondary-emphasis mb-1';
    idBadge.textContent = `#${String(character.id).padStart(3, '0')}`;

    const title = document.createElement('h6');
    title.className = 'card-title text-capitalize mb-1 fw-bold text-truncate';
    title.textContent = character.fullName;

    body.append(idBadge, title);
    card.append(img, body);
    col.appendChild(card);
    catalogGrid.appendChild(col);
  });
}

/**
 * Fetch single Character detail and open/update modal
 */
async function openDetail(identifier) {
  if (identifier === null || identifier === undefined || isLoading) return;
  isLoading = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  try {
    // Set the enpoint for retrieving the information.
    const character = await getCharacter(identifier);

    populateModal(character);

    if (!isModalOpen) {
      characterModal.show();
    }
} catch (err) {
  if (isModalOpen) characterModal.hide();
  showError(err.message);
} finally {
  isLoading=false;
  prevBtn.disabled = currentPrevId === null;
  nextBtn.disabled = currentNextId === null;
}
}

/**
 * Populate modal DOM elements with backend payload
 */
function populateModal(character) {
  modalName.textContent = character.fullName || 'Unknown';
  modalId.textContent = `#${String(character.id).padStart(3, '0')}`;

  modalImg.alt = character.fullName; // accesibility!!!!
  modalImg.onerror = () => { modalImg.onerror = null; modalImg.src = DEFAULT_IMAGE; };
  modalImg.src = character.image || DEFAULT_IMAGE;
  
  modalExp.textContent = character.firstName || 'Not available';
  modalHeight.textContent = character.lastName || 'Not available';
  modalWeight.textContent = character.family || 'Not available';
  modalAbilities.textContent = character.title || 'Not available';
  modalBorn.textContent = character.born || "Not available";
  modalDied.textContent = character.died || "Not available";
  modalAliases.textContent = character.aliases || "Not available";

  modalCrest.src = character.crest || DEFAULT_IMAGE;
  modalCrest.onerror = () => { modalCrest.onerror = null; modalCrest.src = DEFAULT_IMAGE; };

  // Bind Circular Navigation IDs provided by Backend
  currentPrevId = character.prevId ?? null;
  currentNextId = character.nextId ?? null;

  prevBtn.disabled = currentPrevId === null;
  nextBtn.disabled = currentNextId === null;
}

// Event Listeners: Modal Left/Right Navigation
prevBtn.addEventListener('click', () => {
  if (currentPrevId !== null) openDetail(currentPrevId);
});

nextBtn.addEventListener('click', () => {
  if (currentNextId !== null) openDetail(currentNextId);
});

// Keyboard Arrow Navigation inside Modal
document.addEventListener('keydown', (e) => {
  if (!isModalOpen || isLoading) return;
  if (e.key === 'ArrowLeft' && currentPrevId !== null) {
    e.preventDefault(); // stops browser normal action for event
    openDetail(currentPrevId);
  } else if (e.key === 'ArrowRight' && currentNextId !== null) {
    e.preventDefault();
    openDetail(currentNextId);
  }
});

// Event Listeners: Search & Reset
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (isLoading) return;

  const query = searchInput.value.trim();

  if (query) {
    clearSearchBtn.classList.remove('d-none');
    loadCatalog(query);
  } else {
    resetToFullCatalog();
  }
});

function resetToFullCatalog() {
  if (isLoading) return;
  searchInput.value = '';
  clearSearchBtn.classList.add('d-none');
  loadCatalog();
}

clearSearchBtn.addEventListener('click', resetToFullCatalog);
errorResetBtn.addEventListener('click', resetToFullCatalog);

brandReset.addEventListener('click', (e) => {
  e.preventDefault();
  resetToFullCatalog();
});

// UI Helper Functions
function showLoading(isLoading) {
  searchInput.disabled = isLoading;
  clearSearchBtn.disabled = isLoading;
  errorResetBtn.disabled = isLoading;

  loadingSpinner.classList.toggle('d-none', !isLoading);
  if (isLoading) catalogSection.classList.add('d-none');
}

function showError(msg) {
  catalogSection.classList.add('d-none');
  errorMessage.textContent = msg;
  errorView.classList.remove('d-none');
}

function hideError() {
  errorView.classList.add('d-none');
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => loadCatalog());