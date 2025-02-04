const params = new URLSearchParams(window.location.search);
const petId = params.get('id');
const apiURL = `${root_api}/api/pets/`;
const token = localStorage.getItem("authToken");
const loader = document.getElementById('loader');

document.addEventListener("DOMContentLoaded", () => {
    loader.classList.remove('d-none'); // Show loader

    fetch(`${apiURL}${petId}/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch details");
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById("name").value = data.name;
            document.getElementById("year").value = data.year;
            document.getElementById("month").value = data.month;
            document.getElementById("gender").value = data.gender;
            document.getElementById("adoptionCost").value = data.adoption_cost;
            document.getElementById("location").value = data.location;
            document.getElementById("foodHabit").value = data.food_habit;
            document.getElementById("adoption_status").checked = data.adoption_status;
            document.getElementById("description").value = data.description;
        })
        .catch((error) => showAlert("Error fetching details!"))
        .finally(() => loader.classList.add('d-none'));
});

document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();

    loader.classList.remove('d-none'); // Show loader

    const updatedData = {
        name: document.getElementById("name").value,
        year: parseInt(document.getElementById("year").value),
        month: parseInt(document.getElementById("month").value),
        gender: document.getElementById("gender").value,
        adoption_cost: parseFloat(document.getElementById("adoptionCost").value),
        location: document.getElementById("location").value,
        food_habit: document.getElementById("foodHabit").value,
        adoption_status: document.getElementById("adoption_status").checked,
        description: document.getElementById("description").value,
    };
    console.log(updatedData);

    fetch(`${apiURL}${petId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update pet details");
            }
            showAlert("Updated successfully!", 'success');
            setInterval(() => {
                window.location.href = `/pets_details.html?id=${petId}`;
            }, 2000);
        })
        .catch((error) => showAlert("Error updating details!"))
        .finally(() => loader.classList.add('d-none'));
});

document.getElementById("deleteButton").addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this ?")) return;

    fetch(`${apiURL}${petId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete");
            }
            showAlert("Deleted successfully!", 'success');
            window.location.href = "/user_profile.html"; // Redirect to cats listing page
        })
        .catch((error) => showAlert("Error deleting!"));
});