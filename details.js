async function fetchRecipeDetails() {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (!recipeId) {
        document.getElementById('details-container').innerHTML = '<p>No recipe ID found.</p>';
        return;
    }

    try {
        const res = await fetch(`https://dummyjson.com/recipes/${recipeId}`);
        const recipe = await res.json();

        const html = `
            <div class="card" style="max-width: 600px; margin: 20px auto;">
                <img class="img1" src="${recipe.image}" alt="${recipe.name}">
                <h2>${recipe.name}</h2>
                <h3>Rating: ${recipe.rating}</h3>
                <p><strong>Category:</strong> ${recipe.mealType?.join(', ') || 'N/A'}</p>
                <p class="ingredients"><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                <p class="instructions"><strong>Instructions:</strong> ${recipe.instructions}</p>
            </div>
        `;

        document.getElementById('container2').innerHTML = html;

    } catch (error) {
        console.error('Error fetching recipe details:', error);
        document.getElementById('details-container').innerHTML = '<p>Error loading recipe details.</p>';
    }
}

fetchRecipeDetails();
