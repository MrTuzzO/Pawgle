// Function to fetch pets based on the search query (with pagination)
async function fetchSearchResults(query, page = 1) {
    const loader = document.getElementById('loader');
    const petContainer = document.getElementById('searchResultsHolder'); // Separate container for search results
    petContainer.innerHTML = '<h4 class="text-center w-100 text-muted">Loading pets...</h4>';

    try {
        const response = await fetch(`${root_api}/api/pets/?page=${page}&search=${query}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching pets:", error);
        return null;
    }
}

// Function to create pet card HTML structure
function createPetCard(pet) {
    const today = new Date();
    const dateAdded = new Date(pet.date_added);
    const timeDifference = today - dateAdded;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let badgeText = "";
    if (daysDifference === 0) {
        badgeText = "New Today";
    } else if (daysDifference <= 7) {
        badgeText = "New This Week";
    }

    return `
    <div class="col">
        <a href="${pet.pet_type}_details.html?id=${pet.id}" class="text-decoration-none">
            <div class="card">
                <img src="${pet.image_1}" class="card-img-top" alt="Pet Image" style="height: 250px; object-fit: cover;">
                ${badgeText ? `<span class="badge position-absolute" style="top: 220px; right: 4px; font-size: 0.9rem; background: #c19a6b9b">${badgeText}</span>` : ""}
                <div class="card-body d-flex align-items-center">
                    <div class="me-3">
                        <img src="${pet.author_user_img || 'assets/img/blank-profile-picture.png'}" class="rounded-circle" 
                        style="width: 60px; height: 60px; object-fit: cover;"/>
                    </div>
                    <div>
                        <h5 class="card-title text-primary fw-bold mb-0">${pet.name}</h5>
                        <p class="card-text text-dark mb-0">
                            <span>
                                ${pet.year === 0 && pet.month === 0 ? "Age not mentioned"
            : pet.year === 0 ? `${pet.month} Month`
                : pet.month === 0 ? `${pet.year} Year`
                    : `${pet.year} Year ${pet.month} Month`}
                            </span>
                        </p>
                        <p class="card-text text-dark">
                            <i class="fas fa-map-marker-alt text-primary"></i> ${pet.location}
                        </p>
                    </div>
                </div>
            </div>
        </a>
    </div>`;
}

// Function to display search results in a separate container
function displaySearchResults(pets) {
    const petContainer = document.getElementById('searchResultsHolder'); // Separate container for search results
    petContainer.innerHTML = '';

    if (pets.length === 0) {
        petContainer.innerHTML = `<p class="text-center w-100 text-muted">No pets found for your search</p>`;
    } else {
        pets.forEach(pet => {
            petContainer.innerHTML += createPetCard(pet);
        });
    }
}

// Function to create pagination buttons for search results
function createSearchPagination(totalCount, currentPage) {
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalCount / petsPerPage);

    if (totalPages <= 1) {
        return; // Do not create pagination buttons if there is only one page
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
        <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} mx-1" data-page="${i}">
            ${i}
        </button>`;
    }

    // Add event listeners to pagination buttons
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const page = parseInt(e.target.getAttribute('data-page'));
            searchPets(page); // Load pets with the selected page
        });
    });
}

// Function to handle search when the search button is clicked
async function searchPets(page = 1) {
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (!searchQuery) {
        alert("Please enter a search term");
        return;
    }

    const data = await fetchSearchResults(searchQuery, page);
    if (data) {
        displaySearchResults(data.results);
        createSearchPagination(data.count, page); // Create pagination for search results
    }
}

// Event listener for the search button click
document.getElementById('search-button').addEventListener('click', () => {
    searchPets(); // Trigger search when the button is clicked
});
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchPets(); // Trigger search when "Enter" key is pressed
    }
});