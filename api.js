// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Recipe Data and Pagination
let currentPage = 1;
const recipesPerPage = 9;
let allRecipes = [];

async function fetchData() {
    try {
        const res = await fetch('https://dummyjson.com/recipes?limit=50');
        const data = await res.json();
        allRecipes = data.recipes;
        displayRecipes();
        updatePagination();
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById("container").innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading recipes. Please try again later.</p>
            </div>
        `;
    }
}

function displayRecipes() {
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const paginatedRecipes = allRecipes.slice(startIndex, endIndex);
    
    let str = '';
    
    if (paginatedRecipes.length > 0) {
        paginatedRecipes.forEach(recipe => {
            const prepTime = `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins`;
            
            str += `
            <div class="card">
                ${recipe.difficulty === 'Hard' ? `<div class="card-badge">Chef's Choice</div>` : ''}
                <a href="./details.html?id=${recipe.id}">
                    <img class="img1" src="${recipe.image}" alt="${recipe.name}" loading="lazy">
                    <div class="card-content">
                        <h2>${recipe.name}</h2>
                        <h3><i class="fas fa-tag"></i> ${recipe.cuisine}</h3>
                        <p>${recipe.mealType.join(', ')}</p>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            ${recipe.rating} (${recipe.reviewCount} reviews)
                        </div>
                        <div class="time">
                            <i class="fas fa-clock"></i>
                            ${prepTime}
                        </div>
                    </div>
                </a>
            </div>
            `;
        });
    } else {
        str = `
        <div class="no-results">
            <i class="fas fa-utensils"></i>
            <p>No recipes found. Try a different search.</p>
        </div>
        `;
    }
    
    document.getElementById("container").innerHTML = str;
}

function updatePagination() {
    const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayRecipes();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayRecipes();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Search Functionality
document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        displayRecipes();
        return;
    }
    
    const filteredRecipes = allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.mealType.some(type => type.toLowerCase().includes(searchTerm)) ||
        recipe.cuisine.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
    
    allRecipes = filteredRecipes;
    currentPage = 1;
    displayRecipes();
    updatePagination();
}

// Category Filtering
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        filterByCategory(category);
    });
});

function filterByCategory(category) {
    const filteredRecipes = allRecipes.filter(recipe => 
        recipe.mealType.some(type => type.toLowerCase().includes(category)) ||
        recipe.difficulty.toLowerCase() === category ||
        recipe.cuisine.toLowerCase() === category
    );
    
    allRecipes = filteredRecipes;
    currentPage = 1;
    displayRecipes();
    updatePagination();
    window.scrollTo({ top: document.querySelector('.container').offsetTop, behavior: 'smooth' });
}

// Initialize
fetchData();