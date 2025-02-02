const params = new URLSearchParams(window.location.search);
const catId = params.get('id');
const apiURL = `${root_api}/api/pet/cats/`;
const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${apiURL}${catId}/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch cat details");
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
            document.getElementById("isPottyTrained").checked = data.is_potty_trained;
            document.getElementById("adoption_status").checked = data.adoption_status;
            document.getElementById("description").value = data.description;
        })
        .catch((error) => showAlert("Error fetching cat details!"));
});

document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
        name: document.getElementById("name").value,
        year: parseInt(document.getElementById("year").value),
        month: parseInt(document.getElementById("month").value),
        gender: document.getElementById("gender").value,
        adoption_cost: parseFloat(document.getElementById("adoptionCost").value),
        location: document.getElementById("location").value,
        food_habit: document.getElementById("foodHabit").value,
        is_potty_trained: document.getElementById("isPottyTrained").checked,
        adoption_status: document.getElementById("adoption_status").checked,
        description: document.getElementById("description").value,
    };

    fetch(`${apiURL}${catId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update cat details");
            }
            showAlert("Cat details updated successfully!", 'success');
            setInterval(() => {
                window.location.href = `/cats_details.html?id=${catId}`;
            }, 2000);
        })
        .catch((error) => showAlert("Error updating cat details!"));
});

document.getElementById("deleteButton").addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this cat?")) return;

    fetch(`${apiURL}${catId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete cat");
            }
            showAlert("Cat deleted successfully!", 'success');
            window.location.href = "/user_profile.html"; // Redirect to cats listing page
        })
        .catch((error) => showAlert("Error deleting cat!"));
});