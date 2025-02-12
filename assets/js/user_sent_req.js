// fetchRequests.js

document.addEventListener("DOMContentLoaded", function () {
    const sentRequestsContainer = document.getElementById('sentRequests');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Show loading indicator
    loadingIndicator.style.display = 'block';
    sentRequestsContainer.innerHTML = ''; // Clear previous content

    // Fetch data from the API
    fetch(`${root_api}/api/adoptions/adoption-request/sent-requests/`, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('authToken') // assuming you're using token-based authentication
        }
    })
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator once data is loaded
            loadingIndicator.style.display = 'none';

            // Clear existing requests in the list
            if (data.length === 0) {
                sentRequestsContainer.innerHTML = '<p>No adoption requests found.</p>';
            } else {
                // Loop through the data and create list items dynamically
                data.forEach(request => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                    // Create the content for the request
                    const requestContent = document.createElement('div');
                    requestContent.innerHTML = `
                        <h5 class="card-title text-primary my-1">Pet Name: ${request.pet_name}</h5>
                        <p class="card-text mb-1"><strong>Message:</strong> ${request.message || 'No message provided.'}</p>
                        <p class="card-text mb-1"><strong>Author:</strong> ${request.author || 'No owner provided.'}</p>
                        <small class="text-muted">Requested on: ${new Date(request.date_requested).toLocaleString()}</small>
                `;

                    // Create the badge for status
                    const badge = document.createElement('span');
                    badge.classList.add('badge', 'position-absolute', 'top-0', 'end-0', 'm-3', 'rounded-pill');

                    switch (request.status) {
                        case 'Pending':
                            badge.classList.add('bg-primary');
                            badge.textContent = 'Pending';
                            break;
                        case 'Approved':
                            badge.classList.add('bg-success');
                            badge.textContent = 'Approved';
                            break;
                        case 'Rejected':
                            badge.classList.add('bg-danger');
                            badge.textContent = 'Rejected';
                            break;
                        default:
                            badge.textContent = 'Unknown Status';
                    }

                    // Append the content and badge to the list item
                    listItem.appendChild(requestContent);
                    listItem.appendChild(badge);

                    // Append the list item to the sent requests container
                    sentRequestsContainer.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            // Hide loading indicator and show error message
            loadingIndicator.style.display = 'none';
            showAlert('Error fetching adoption requests. Please try again later.', 'danger');
        });
});