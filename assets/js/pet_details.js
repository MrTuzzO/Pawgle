// Extract ID from URL
const urlParams = new URLSearchParams(window.location.search);
const petId = urlParams.get("id");

// Base API URL
const apiUrl = `${root_api}/api/pets/${petId}/`;
console.log(apiUrl);

// Fetch pet details
const fetchpetDetails = async () => {
  const loader = document.getElementById('loader');
  loader.classList.remove('d-none'); // Show loader

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    renderpetDetails(data);
  } catch (error) {
    console.error("Failed to fetch pet details:", error);
  } finally {
    document.getElementById("loader").classList.add("d-none");
  }
};

// Render pet details to the page
const renderpetDetails = (pet) => {
  const carouselInner = document.querySelector(".carousel-inner");
  const infoHeader = document.querySelector(".info-header");

  document.title = `${pet.name} - ${pet.description}`;

  // Add images to the carousel
  const images = [pet.image_1, pet.image_2, pet.image_3, pet.image_4].filter(
    (img) => img !== null
  );

  if (pet.adoption_status && localStorage.getItem("username") !== pet.author_username  && !localStorage.getItem("adminSecure")) {
    document.getElementById("apply-btn").classList.add("disabled");
    document.getElementById("apply-btn").textContent = "Already Adopted";
  }
  if (localStorage.getItem("username") === pet.author_username || localStorage.getItem("adminSecure")) {
    const applyBtn = document.getElementById("apply-btn");
    applyBtn.textContent = "Edit";
    applyBtn.addEventListener("click", () => {
      window.location.href = `edit_pet.html?id=${petId}`;
    });
  }



  if (images.length > 0) {
    images.forEach((imgUrl, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.className = `carousel-item${index === 0 ? " active" : ""}`;
      carouselItem.innerHTML = `<img src="${imgUrl}" class="d-block w-100 pet-image" alt="${pet.name} Image ${index + 1}">`;
      carouselInner.appendChild(carouselItem);
    });
  } else {
    document.querySelector("#petCarousel").classList.add("d-none");
  }

  // Fill in pet details
  infoHeader.innerHTML = `
    <div class="info-item d-flex justify-content-between">
      <h2 class="text-primary">${pet.name}</h2>
      <p class="badge bg-${!pet.adoption_status ? "primary" : "secondary"} fs-5 rounded-pill mt-1">
        ${!pet.adoption_status ? "Available to adopt" : "Adopted"}
      </p>
    </div>
    <div class="info-item"><strong>Age:</strong> 
      <span>
        ${pet.year === 0 && pet.month === 0
      ? "Age not mentioned"
      : pet.year === 0
        ? `${pet.month} Month`
        : pet.month === 0
          ? `${pet.year} Year`
          : `${pet.year} Year ${pet.month} Month`}
      </span>
    </div>
    <div class="info-item"><strong>Food Habit:</strong> ${pet.food_habit}</div>
    <div class="info-item"><strong>Gender:</strong> ${pet.gender}</div>
    <div class="info-item"><strong>Arrived Date:</strong> ${new Date(pet.date_added).toLocaleDateString()}</div>
    <div class="info-item"><strong>Lopetion:</strong> ${pet.location}</div>
    <div class="info-item"><strong>Adoption Cost:</strong> $${pet.adoption_cost}</div>
    <div class="info-item"><strong>Author:</strong> ${pet.author_username}</div>
    <div class="info-item"><strong>Description:</strong> ${pet.description}</div>
  `;
};

// Initialize the script
fetchpetDetails();
