// Extract ID from URL
const urlParams = new URLSearchParams(window.location.search);
const catId = urlParams.get("id");

// Base API URL
let apiUrl = `${root_api}/api/pet/cats/${catId}/`;

// Fetch cat details
const fetchCatDetails = async () => {
  const loader = document.getElementById('loader');
  loader.classList.remove('d-none'); // Show loader

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    renderCatDetails(data);
  } catch (error) {
    console.error("Failed to fetch cat details:", error);
  } finally {
    document.getElementById("loader").classList.add("d-none");
  }
};

// Render cat details to the page
const renderCatDetails = (cat) => {
  const carouselInner = document.querySelector(".carousel-inner");
  const infoHeader = document.querySelector(".info-header");

  document.title = `${cat.name} - ${cat.description}`;
  
  // Add images to the carousel
  const images = [cat.image_1, cat.image_2, cat.image_3, cat.image_4].filter(
    (img) => img !== null
  );

  if (cat.adoption_status && localStorage.getItem("username") !== cat.author_username) {
    document.getElementById("apply-btn").classList.add("disabled");
    document.getElementById("apply-btn").textContent = "Already Adopted";
  }
  if (localStorage.getItem("username") === cat.author_username) {
    const applyBtn = document.getElementById("apply-btn");
    applyBtn.textContent = "Edit";
    applyBtn.addEventListener("click", () => {
      window.location.href = `edit_cat.html?id=${catId}`;
    });
  }

  if (images.length > 0) {
    images.forEach((imgUrl, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.className = `carousel-item${index === 0 ? " active" : ""}`;
      carouselItem.innerHTML = `<img src="${imgUrl}" class="d-block w-100 cat-image" alt="${cat.name} Image ${index + 1}">`;
      carouselInner.appendChild(carouselItem);
    });
  } else {
    document.querySelector("#catCarousel").classList.add("d-none");
  }


  // Fill in cat details
  infoHeader.innerHTML = `
    <div class="info-item d-flex justify-content-between">
      <h2 class="text-primary">${cat.name}</h2>
      <p class="badge bg-${!cat.adoption_status ? "primary" : "secondary"} fs-5 rounded-pill mt-1">
        ${!cat.adoption_status ? "Available to adopt" : "Adopted"}
      </p>
    </div>
    <div class="info-item"><strong>Color:</strong> ${cat.color_names.join(", ")}</div>
    <div class="info-item"><strong>Age:</strong> 
      <span>
        ${cat.year === 0 && cat.month === 0
      ? "Age not mentioned"
      : cat.year === 0
        ? `${cat.month} Month`
        : cat.month === 0
          ? `${cat.year} Year`
          : `${cat.year} Year ${cat.month} Month`}
      </span>
    </div>
    <div class="info-item"><strong>Food Habit:</strong> ${cat.food_habit}</div>
    <div class="info-item"><strong>Is potty trained:</strong> ${cat.is_potty_trained ? "Yes" : "No"}</div>
    <div class="info-item"><strong>Gender:</strong> ${cat.gender}</div>
    <div class="info-item"><strong>Arrived Date:</strong> ${new Date(cat.date_added).toLocaleDateString()}</div>
    <div class="info-item"><strong>Location:</strong> ${cat.location}</div>
    <div class="info-item"><strong>Adoption Cost:</strong> $${cat.adoption_cost}</div>
    <div class="info-item"><strong>Author:</strong> ${cat.author_username}</div>
    <div class="info-item"><strong class="det_wrap">Description:</strong> ${cat.description}</div>
  `;
};

// Initialize the script
fetchCatDetails();
