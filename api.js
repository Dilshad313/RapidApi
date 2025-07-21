async function fetchdata() {
    try {
        const res = await fetch('https://dummyjson.com/recipes');
        const data = await res.json();
        console.log(data);

        let str = ``;

        // Check if data.recipes exists and is an array
        if (Array.isArray(data.recipes)) {
            data.recipes.forEach((food) => {
                str += `
                <div class="card">
                    <a href="./details.html?id=${food.id}">
                        <center>
                            <img class="img1" src="${food.image}" alt="${food.name}" width="170px" height="170px"><br>
                            <h2>${food.name}</h2><br>
                            <h3>Price: $${food.userId}</h3><br>
                            <p>Category: ${food.mealType?.join(', ')}</p><br>
                            <p class="rating">Rating: ${food.rating}</p><br>
                            <p class="ingredients">Ingredients: ${food.ingredients}</p><br>
                            <p class="instructions">Instructions: ${food.instructions}</p><br>
                        </center>
                    </a>
                </div>
                `;
            });
        } else {
            console.log('No recipes found in data.');
        }

        document.getElementById("container").innerHTML = str;

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchdata();
