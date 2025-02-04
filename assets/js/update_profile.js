document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-profile-form');
    const authToken = localStorage.getItem('authToken');

    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    if (!authToken) {
        alert('You are not logged in. Please log in to update your profile.');
        window.location.href = 'login.html';
        return;
    }

    // Function to pre-fill form with existing profile data
    async function fetchProfileData() {
        try {
            const response = await fetch(`${root_api}/api/auth/profile/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('profile_pic_preview').src = data.user_img || './assets/img/blank-profile-picture.png';
                document.getElementById('first_name').value = data.first_name || '';
                document.getElementById('last_name').value = data.last_name || '';
                document.getElementById('age').value = data.birthday || '';
                document.getElementById('address').value = data.address || '';
                document.getElementById('mobile').value = data.mobile || '';
            } else {
                showAlert('Failed to fetch profile data. Please try again.', 'danger');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            showAlert('An error occurred while fetching profile data. Please try again later.', 'danger');
        } finally {
            loader.classList.add('d-none'); // Hide loader
        }
    }
    fetchProfileData();
});

// Function to show image preview
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

document.getElementById("update-profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const formData = new FormData();
    formData.append("first_name", document.getElementById("first_name").value);
    formData.append("last_name", document.getElementById("last_name").value);
    formData.append("birthday", document.getElementById("age").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("mobile", document.getElementById("mobile").value);

    const fileInput = document.getElementById("profile_pic");
    let user_img_url = null;

    if (fileInput && fileInput.files[0]) {
        try {
            user_img_url = await uploadImageToImgBB(fileInput.files[0]);
        } catch (error) {
            console.error("Error uploading image:", error.message);
            showAlert(`Error uploading image: ${error.message}`, 'danger');
            loader.classList.add('d-none');
            return;
        }
    }

    const payload = {
        user_img: user_img_url,
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        birthday: formData.get("birthday"),
        address: formData.get("address"),
        mobile: formData.get("mobile")
    };

    console.log("Payload:", payload); // Log the payload to check the data

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        showAlert("Please log in to continue.", 'danger');
        window.location.href = 'login.html';
        loader.classList.add('d-none');
        return;
    }

    try {
        const response = await fetch(`${root_api}/api/auth/profile/`, {
            method: "PUT",
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        let responseBody;
        try {
            responseBody = await response.json();
        } catch (e) {
            responseBody = null;
        }

        if (response.ok) {
            showAlert("Profile updated successfully!", 'success');
            setInterval(() => {
                window.location.href = 'user_profile.html';
            }, 2000);
        } else {
            const errorMessages = responseBody ? Object.entries(responseBody)
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('') : "Failed to update profile.";
            showAlert(errorMessages, 'danger');
        }
    } catch (error) {
        console.error("Error updating profile:", error.message);
        showAlert(`Error: ${error.message}`, 'danger');
    } finally {
        loader.classList.add('d-none');
    }
});