async function fetchdata() {
    try {
        const res = await fetch('https://dummyjson.com/recipes');
        const data = await res.json();
        console.log(data);

        let str = ``;

        if (Array.isArray(data.recipes)) {
            // Sort recipes by ID ascending
            const sortedRecipes = data.recipes.sort((a, b) => a.id - b.id);

            sortedRecipes.forEach((food) => {
                str += `
                <div class="card">
                    <a href="./details.html?id=${food.id}">
                        <img class="img1" src="${food.image}" alt="${food.name}">
                        <h2>${food.name}</h2>
                        <h3>Price: $${food.userId}</h3>
                        <p>Category: ${food.mealType?.join(', ') || 'N/A'}</p>
                        <p class="rating">Rating: ${food.rating}</p>
                    </a>
                </div>
                `;
            });
        } else {
            str = `<p>No recipes found.</p>`;
        }

        document.getElementById("container").innerHTML = str;

    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById("container").innerHTML = `<p>Error loading recipes.</p>`;
    }
}

fetchdata();
