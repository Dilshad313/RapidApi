// Theme Toggle (same as in api.js)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

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

// Mobile Menu Toggle (same as in api.js)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Recipe Details
async function fetchRecipeDetails() {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (!recipeId) {
        document.getElementById('container2').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No recipe ID found. Please go back to the recipes page.</p>
                <a href="recipes.html" class="btn">Back to Recipes</a>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`https://dummyjson.com/recipes/${recipeId}`);
        const recipe = await res.json();

        // Format instructions with line breaks
        const formattedInstructions = recipe.instructions.replace(/\n/g, '<br><br>');
        
        const prepTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
        
        const html = `
            <div class="recipe-detail">
                <img class="recipe-image" src="${recipe.image}" alt="${recipe.name}" loading="lazy">
                <div class="recipe-header">
                    <h1 class="recipe-title">${recipe.name}</h1>
                    <div class="recipe-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${prepTime} mins</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-utensils"></i>
                            <span>${recipe.servings} servings</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-fire"></i>
                            <span>${recipe.difficulty}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${recipe.rating} (${recipe.reviewCount} reviews)</span>
                        </div>
                    </div>
                    <p>${recipe.mealType.join(' • ')} | ${recipe.cuisine} cuisine</p>
                </div>
                <div class="recipe-content">
                    <div class="recipe-section">
                        <h3>Ingredients</h3>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recipe-section">
                        <h3>Instructions</h3>
                        <ol class="instructions-list">
                            ${recipe.instructions.split('\n').filter(step => step.trim() !== '').map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('container2').innerHTML = html;
        
        // Fetch related recipes
        fetchRelatedRecipes(recipe.mealType[0], recipe.id);

    } catch (error) {
        console.error('Error fetching recipe details:', error);
        document.getElementById('container2').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading recipe details. Please try again later.</p>
                <a href="recipes.html" class="btn">Back to Recipes</a>
            </div>
        `;
    }
}

async function fetchRelatedRecipes(category, excludeId) {
    try {
        const res = await fetch(`https://dummyjson.com/recipes?limit=50`);
        const data = await res.json();
        
        // Filter recipes by same category and exclude current recipe
        const relatedRecipes = data.recipes.filter(recipe => 
            recipe.mealType.includes(category) && recipe.id !== excludeId
        ).slice(0, 4); // Get up to 4 related recipes
        
        if (relatedRecipes.length > 0) {
            let html = '';
            
            relatedRecipes.forEach(recipe => {
                html += `
                <div class="card">
                    <a href="./details.html?id=${recipe.id}">
                        <img class="img1" src="${recipe.image}" alt="${recipe.name}" loading="lazy">
                        <div class="card-content">
                            <h2>${recipe.name}</h2>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                ${recipe.rating}
                            </div>
                        </div>
                    </a>
                </div>
                `;
            });
            
            document.getElementById('related-container').innerHTML = html;
        }
    } catch (error) {
        console.error('Error fetching related recipes:', error);
    }
}

// Recipe Actions
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('print-recipe')?.addEventListener('click', printRecipe);
    document.getElementById('save-recipe')?.addEventListener('click', saveRecipe);
    document.getElementById('share-recipe')?.addEventListener('click', shareRecipe);
});

function printRecipe() {
    window.print();
}

function saveRecipe() {
    const recipeId = new URLSearchParams(window.location.search).get('id');
    if (!recipeId) return;
    
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    if (!savedRecipes.includes(recipeId)) {
        savedRecipes.push(recipeId);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        
        // Show notification
        showNotification('Recipe saved to your collection!');
        
        // Update button
        const saveBtn = document.getElementById('save-recipe');
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
        saveBtn.style.backgroundColor = '#2ecc71';
    } else {
        showNotification('Recipe already saved!');
    }
}

function shareRecipe() {
    const recipeTitle = document.querySelector('.recipe-title')?.textContent || 'Check out this recipe';
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: recipeTitle,
            url: url
        }).catch(err => {
            console.log('Error sharing:', err);
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Link copied to clipboard!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize
fetchRecipeDetails();