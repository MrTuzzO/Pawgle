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

    // Handle form submission to update profile
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        loader.classList.remove('d-none'); // Show loader

        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const age = document.getElementById('age').value;
        const address = document.getElementById('address').value;
        const mobile = document.getElementById('mobile').value;

        try {
            const response = await fetch(`${root_api}/api/auth/profile/`, {
                method: 'PUT', // Use PATCH if partial updates are allowed
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    birthday: age || null,
                    address: address || null,
                    mobile: mobile || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setTimeout(() => {
                    window.location.href = 'user_profile.html';
                }, 2000); // 3000 milliseconds = 3 seconds
                
                showAlert('Profile updated successfully!', 'success');
            } else {
                console.error('Error updating profile:', data);
                showAlert(`Update failed: ${data.detail || 'Please check your inputs.'}`, 'danger');
            }
        } catch (error) {
            console.error('Unexpected error during profile update:', error);
            showAlert('An unexpected error occurred. Please try again later.', 'danger');
        } finally {
            loader.classList.add('d-none'); // Hide loader
        }
    });
});
