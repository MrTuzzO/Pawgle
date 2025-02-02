// Function to dynamically load the cat post form
function CatForm() {
    if (!localStorage.getItem("authToken")) {
        window.location.href = 'login.html';
        return;
    }

    const formHtml = `
    <form id="cat-post-form" enctype="multipart/form-data">
        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="cat-name" class="form-label">Cat Name</label>
                <input type="text" class="form-control" id="cat-name" placeholder="Enter cat's name" required>
            </div>
            <div class="col-md-6">
                <label for="cat-gender" class="form-label">Cat Gender</label>
                <select class="form-select" id="cat-gender" required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>
        </div>

        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="pet-year" class="form-label">Cat Age (Years)</label>
                <input type="number" class="form-control" id="pet-year" placeholder="Years" min="0" required>
            </div>
            <div class="col-md-6">
                <label for="pet-month" class="form-label">Cat Age (Months)</label>
                <input type="number" class="form-control" id="pet-month" placeholder="Months" min="0" required>
            </div>
        </div>

        <div class="mb-3 row">
            <div class="col-md-6">
                <label for="cat-location" class="form-label">Location</label>
                <input type="text" class="form-control" id="cat-location" placeholder="Enter location" required>
            </div>
            <div class="col-md-6">
                <label for="cat-food-habit" class="form-label">Food Habit</label>
                <input type="text" class="form-control" id="cat-food-habit" placeholder="Enter food habit" required>
            </div>
        </div>

         <div class="mb-3 row">
            <div class="col-md-6">
                <label for="cat-is-potty-trained" class="form-label">Is Potty Trained?</label>
                <select class="form-select" id="cat-is-potty-trained" required>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>
            <div class="col-md-6">
                <label for="cat-adoption-cost" class="form-label">Adoption Cost</label>
                <input type="number" class="form-control" id="cat-adoption-cost" placeholder="Enter adoption cost" value="0">
            </div>
        </div>

        <div class="mb-3">
            <label for="cat-description" class="form-label">Description</label>
            <textarea class="form-control" id="cat-description" rows="3" placeholder="Enter a short description"></textarea>
        </div>


        <div class="mb-3">
            <label for="cat-colors" class="form-label">Cat Colors</label>
            <select class="form-select" id="cat-colors" multiple required></select>
        </div>

        <div class="mb-3">
            <label for="cat-image-1" class="form-label">Upload Main Image</label>
            <input type="file" class="form-control" id="cat-image-1" accept="image/*" required onchange="showPreview(this, 'main-image-preview')">
            <img id="main-image-preview" class="mt-3" style="max-width: 100%; height: auto; display: none;">
        </div>

        <div id="additional-images-container" class="mb-3"></div>

        <button type="button" class="btn btn-secondary mb-3" id="add-more-images-btn">Add More Images</button>

        <button type="submit" class="btn btn-primary w-100">Submit</button>
    </form>
    `;
    document.getElementById('post-form').innerHTML = formHtml;

    // loadColorOptions();

    loadColorOptions("cat-colors");

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
                <label for="cat-image-${imageCount}" class="form-label">Upload Additional Image ${imageCount - 1}</label>
                <input type="file" class="form-control" id="cat-image-${imageCount}" accept="image/*" onchange="showPreview(this, 'image-preview-${imageCount}')">
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
    formData.append("name", document.getElementById("cat-name").value);
    formData.append("year", document.getElementById("pet-year").value);
    formData.append("month", document.getElementById("pet-month").value);
    formData.append("gender", document.getElementById("cat-gender").value);
    formData.append("location", document.getElementById("cat-location").value);
    formData.append("description", document.getElementById("cat-description").value);
    formData.append("food_habit", document.getElementById("cat-food-habit").value);
    formData.append("is_potty_trained", document.getElementById("cat-is-potty-trained").value === 'true');
    formData.append("adoption_cost", document.getElementById("cat-adoption-cost").value);

    // Append selected colors
    const selectedColors = Array.from(document.getElementById("cat-colors").selectedOptions).map(option => option.value);
    selectedColors.forEach(color => formData.append("colors", color));

    // Upload images to imgBB and append URLs to formData
    const imageFields = ["cat-image-1", "cat-image-2", "cat-image-3", "cat-image-4"];
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
        const response = await fetch(`${root_api}/api/pet/cats/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: formData
        });

        const responseBody = await response.json();

        if (response.ok) {
            showAlert("Cat posted successfully!", 'success');
            document.getElementById("cat-post-form").reset();
            setInterval(() => {
                window.location.href = `/cats_details.html?id=${responseBody.id}`;
            }, 2000);
        } else {
            const errorMessages = Object.entries(responseBody)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('');
            showAlert(errorMessages || "Failed to post cat.", 'danger');
        }
    } catch (error) {
        console.error("Error posting cat:", error.message);
        showAlert(`Error: ${error.message}`, 'danger');
    } finally {
        loader.classList.add('d-none');
    }
});
