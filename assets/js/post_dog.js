// Function to dynamically load the dog post form
function DogForm() {
    if (!localStorage.getItem("authToken")) {
        window.location.href = 'login.html';
        return;
    }

    const formHtml = `
    <form id="dog-post-form" enctype="multipart/form-data">
        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="dog-name" class="form-label">Dog Name</label>
                <input type="text" class="form-control" id="dog-name" placeholder="Enter dog's name" required>
            </div>
            <div class="col-md-6">
                <label for="dog-gender" class="form-label">Dog Gender</label>
                <select class="form-select" id="dog-gender" required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>
        </div>

        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="pet-year" class="form-label">Dog Age (Years)</label>
                <input type="number" class="form-control" id="pet-year" placeholder="Years" min="0" required>
            </div>
            <div class="col-md-6">
                <label for="pet-month" class="form-label">Dog Age (Months)</label>
                <input type="number" class="form-control" id="pet-month" placeholder="Months" min="0" required>
            </div>
        </div>

        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="dog-location" class="form-label">Location</label>
                <input type="text" class="form-control" id="dog-location" placeholder="Enter location" required>
            </div>
            <div class="col-md-6">
                <label for="dog-food-habit" class="form-label">Food Habit</label>
                <input type="text" class="form-control" id="dog-food-habit" placeholder="Enter food habit" required>
            </div>
        </div>

         <div class="mb-3 row">
            <div class="col-md-6">
                <label for="dog-size" class="form-label">Size</label>
                <select class="form-select" id="dog-size" required>
                    <option value="Tiny">Tiny (&lt;5kg)</option>
                        <option value="Small">Small (5-10kg)</option>
                        <option value="Medium">Medium (10-25kg)</option>
                        <option value="Large">Large (25-45kg)</option>
                        <option value="Giant">Giant (&gt;45kg)</option>
                </select>
            </div>
            <div class="col-md-6">
                <label for="dog-adoption-cost" class="form-label">Adoption Cost</label>
                <input type="number" class="form-control" id="dog-adoption-cost" placeholder="Enter adoption cost" value="0">
            </div>
        </div>

        <div class="col-md-12">
            <label for="dog-breed" class="form-label">Breed</label>
            <input type="text" class="form-control" id="dog-breed" placeholder="Enter dog's breed" required>
        </div>

        <div class="mb-3">
            <label for="dog-description" class="form-label">Description</label>
            <textarea class="form-control" id="dog-description" rows="3" placeholder="Enter a short description"></textarea>
        </div>


        <div class="mb-3">
            <label for="dog-colors" class="form-label">Dog Colors</label>
            <select class="form-select" id="dog-colors" multiple required></select>
        </div>

        <div class="mb-3">
            <label for="dog-image-1" class="form-label">Upload Main Image</label>
            <input type="file" class="form-control" id="dog-image-1" accept="image/*" required onchange="showPreview(this, 'main-image-preview')">
            <img id="main-image-preview" class="mt-3" style="max-width: 100%; height: auto; display: none;">
        </div>

        <div id="additional-images-container" class="mb-3"></div>

        <button type="button" class="btn btn-secondary mb-3" id="add-more-images-btn">Add More Images</button>

        <button type="submit" class="btn btn-primary w-100">Submit</button>
    </form>
    `;
    document.getElementById('post-form').innerHTML = formHtml;
    
    loadColorOptions("dog-colors");

    // Now attach the "Add More Images" button logic
    const addMoreImagesBtn = document.getElementById('add-more-images-btn');
    const additionalImagesContainer = document.getElementById('additional-images-container');
    let imageCount = 1; // Start from 1 for additional images (main image is already present)

    addMoreImagesBtn.addEventListener('click', () => {
        if (imageCount < 4) {
            imageCount++;

            // Create a new div for the image input and preview
            const newImageDiv = document.createElement('div');
            newImageDiv.classList.add('mb-3');
            newImageDiv.innerHTML = `
                <label for="dog-image-${imageCount}" class="form-label">Upload Additional Image ${imageCount - 1}</label>
                <input type="file" class="form-control" id="dog-image-${imageCount}" accept="image/*" onchange="showPreview(this, 'image-preview-${imageCount}')">
                <img id="image-preview-${imageCount}" class="mt-3" style="max-width: 100%; height: auto; display: none;">
            `;
            additionalImagesContainer.appendChild(newImageDiv);
        }

        if (imageCount === 4) {
            addMoreImagesBtn.disabled = true; // Disable the button after 3 additional images are added
        }
    });
}


// Show image preview
function showPreview(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
    }
}

// Function to upload image to imgBB
async function uploadImageToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=007d7bc669958dec46d34e2a45e235cb', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (response.ok) {
        return data.data.url;
    } else {
        throw new Error(data.error.message);
    }
}

document.getElementById("post-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const formData = new FormData();
    formData.append("name", document.getElementById("dog-name").value);
    formData.append("year", document.getElementById("pet-year").value);
    formData.append("month", document.getElementById("pet-month").value);
    formData.append("gender", document.getElementById("dog-gender").value);
    formData.append("location", document.getElementById("dog-location").value);
    formData.append("description", document.getElementById("dog-description").value);
    formData.append("food_habit", document.getElementById("dog-food-habit").value);
    formData.append("adoption_cost", document.getElementById("dog-adoption-cost").value);
    formData.append("size", document.getElementById("dog-size").value);
    formData.append("breed", document.getElementById("dog-breed").value);

    // Append selected colors
    const selectedColors = Array.from(document.getElementById("dog-colors").selectedOptions).map(option => option.value);
    selectedColors.forEach(color => formData.append("colors", color));

    // Upload images to imgBB and append URLs to formData
    const imageFields = ["dog-image-1", "dog-image-2", "dog-image-3", "dog-image-4"];
    for (let i = 0; i < imageFields.length; i++) {
        const fileInput = document.getElementById(imageFields[i]);
        if (fileInput && fileInput.files[0]) {
            try {
                const imageUrl = await uploadImageToImgBB(fileInput.files[0]);
                formData.append(`image_${i + 1}`, imageUrl);
            } catch (error) {
                console.error("Error uploading image:", error.message);
                showAlert(`Error uploading image: ${error.message}`, 'danger');
                loader.classList.add('d-none');
                return;
            }
        }
    }

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        showAlert("Please log in to continue.", 'danger');
        window.location.href = 'login.html';
        loader.classList.add('d-none');
        return;
    }

    try {
        const response = await fetch(`${root_api}/api/pet/dogs/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: formData
        });

        const responseBody = await response.json();

        if (response.ok) {
            showAlert("Dog posted successfully!", 'success');
            document.getElementById("dog-post-form").reset();
            setInterval(() => {
                window.location.href = `/dogs_details.html?id=${responseBody.id}`;
            }, 2000);
        } else {
            const errorMessages = Object.entries(responseBody)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('');
            showAlert(errorMessages || "Failed to post dog.", 'danger');
        }
    } catch (error) {
        console.error("Error posting dog:", error.message);
        showAlert(`Error: ${error.message}`, 'danger');
    } finally {
        loader.classList.add('d-none');
    }
});