if (localStorage.getItem('authToken')) {
    alert("You are already registred")
    window.location.href = 'patient_profile.html';
}

document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // for adding loader
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password1 = document.getElementById('password').value;
    const password2 = document.getElementById('confirm_password').value;

    if (password1 !== password2) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch(`${root_api}/auth/registration/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password1,
                password2,
            })
        });

        const data = await response.json();

        if (response.ok) {
            // alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            let errorMessages = '';
            for (const [key, value] of Object.entries(data)) {
                errorMessages += `${key}: ${value}\n`;
            }
            showAlert(`Registration failed:\n${errorMessages}`);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        showAlert('An unexpected error occurred. Please try again.');
    } finally {
        loader.classList.add('d-none');
    }
});
