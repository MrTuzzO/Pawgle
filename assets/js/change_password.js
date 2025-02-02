document.getElementById('changePasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showAlert('Passwords do not match!');
        loader.classList.add('d-none');
        return;
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword) || !/[!@#$%^&*.+\-\/?]/.test(newPassword)) {
        showAlert('Password does not meet the required criteria!');
        return;
    }

    try {
        const response = await fetch(`${root_api}/api/auth/password/change/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                new_password1: newPassword,
                new_password2: confirmPassword
            })
        });

        if (response.ok) {
            showAlert('Password changed successfully!', 'success');
            document.getElementById('changePasswordForm').reset();

            // Delay redirection for 3 seconds to display the message
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            const errorData = await response.json();
            showAlert(`Error: ${errorData.detail || 'Failed to change password'}`);
        }
    } catch (error) {
        showAlert('An error occurred while changing the password. Please try again later.');
        console.error(error);
    } finally {
        loader.classList.add('d-none');
    }
});
