if (localStorage.getItem('authToken')) {
    window.location.href = 'user_profile.html';
}

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // for adding loader
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const email = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${root_api}/api/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save the authentication token to localStorage
            localStorage.setItem('authToken', data.key);
            // Redirect to the profile page
            window.location.href = 'login.html';
        } else {
            // Handle API errors
            showAlert(`Login failed: ${data.detail || 'Please check your credentials.'}`);
        }
    } catch (error) {
        // Handle network or other unexpected errors
        console.error('Unexpected error:', error);
        showAlert('An unexpected error occurred. Please try again later.');
    } finally {
        loader.classList.add('d-none'); // Hide loader
    }
});