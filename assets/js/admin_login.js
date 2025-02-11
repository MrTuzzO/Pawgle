
if (localStorage.getItem('authToken')) {
    window.location.href = 'user_profile.html'; // Redirect if already logged in
}

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const email = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/admin-login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Generate a hidden key (for frontend logic)
            const hiddenKey = btoa(new Date().getTime().toString() + "-admin-secure");

            // Save authentication details
            localStorage.setItem("authToken", data.key);
            localStorage.setItem("adminSecure", hiddenKey);

            window.location.href = "admin_home.html"; // Redirect to profile
        } else {
            showAlert(`Login failed: ${data.detail || "Invalid credentials."}`);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        showAlert("An unexpected error occurred. Please try again.");
    } finally {
        loader.classList.add('d-none'); // Hide loader
    }
});

