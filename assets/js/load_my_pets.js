// Base API URL
const baseApiUrl = `${root_api}/api/pets/my_pets/`;

// Function to fetch data from the API with authentication token
async function fetchPets(page = 1) {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

    if (!token) {
        alert('You must be logged in to view pets.');
        return;
    }

    const response = await fetch(`${baseApiUrl}?page=${page}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`, // Include the token in the headers
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        alert('Failed to fetch pets. Please check your authentication.');
        return;
    }

    const data = await response.json();
    return data;
}

// Function to create pet cards
function createPetCard(pet) {
    return `
    <div class="col">
        <a href="${pet.pet_type}_details.html?id=${pet.id}" class="text-decoration-none">
            <div class="card">
                <img src="${pet.image_1}" class="card-img-top" alt="Pet Image" style="height: 250px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title text-primary fw-bold">${pet.name}</h5>
                    <p class="card-text text-dark mb-0">
                        <span>
                             ${pet.year === 0 && pet.month === 0 
                             ? "Age not mentioned" 
                             : pet.year === 0 
                             ? `${pet.month} Month` 
                             : pet.month === 0 
                             ? `${pet.year} Year` 
                             : `${pet.year} Year ${pet.month} Month`}
                        </span>
                    </p>
                    <p class="card-text text-dark">
                        <i class="fas fa-map-marker-alt text-primary"></i> ${pet.location}
                    </p>
                </div>
            </div>
        </a>
    </div>`;
}

// Function to display pets on the page
function displayPets(pets) {
    const petContainer = document.getElementById('petCardsHolder');
    petContainer.innerHTML = '';

    pets.forEach(pet => {
        petContainer.innerHTML += createPetCard(pet);
    });
}

let currentPage = 1;
const petsPerPage = 18; // Number of pets per page

// Function to create pagination buttons
function createPagination(totalCount, currentPage) {
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalCount / petsPerPage);

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
            loadPets(page);
        });
    });
}

// Function to load pets and handle pagination
async function loadPets(page = 1) {
    const data = await fetchPets(page);

    if (data) {
        displayPets(data.results);
        createPagination(data.count, page);
    }
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
    loadPets(); // Load all pets on page load
});
