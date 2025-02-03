// Fetch user profile data and populate the card
document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = `${root_api}/api/auth/profile/`; // Update the URL as per your backend setup
    const authToken = localStorage.getItem("authToken"); // Assuming authToken is stored in localStorage

    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    // Fetch profile data
    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${authToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch profile data");
            }
            return response.json();
        })
        .then((data) => {
            populateProfileCard(data);
            localStorage.setItem("username", data.username);
        })
        .catch((error) => {
            console.error("Error fetching profile data:", error);
        })
        .finally(() => {
            document.getElementById("loader").classList.add("d-none");
        });
});

// Function to populate the profile card
function populateProfileCard(data) {
    let joined = new Date(data.date_joined).toLocaleString("en-US", {
        dateStyle: "medium",  // or "full", "long", "short"
        timeStyle: "short"    // or "full", "long", "medium", "short"
    });
    document.getElementById("full_name").textContent = data.first_name + " " + data.last_name || "N/A";
    document.getElementById("username").textContent = data.username || "N/A";
    document.getElementById("email").textContent = data.email || "N/A";
    document.getElementById("birthday").textContent = data.birthday || "N/A";
    document.getElementById("address").textContent = data.address || "N/A";
    document.getElementById("mobile").textContent = data.mobile || "N/A";
    document.getElementById("joined").textContent = joined || "N/A";
    document.getElementById("user_img").src = data.user_img || "./assets/img/blank-profile-picture.png";
}
