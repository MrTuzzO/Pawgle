document.addEventListener("DOMContentLoaded", function () {
    const sentRequestsContainer = document.getElementById('sentRequests');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const paginationContainer = document.getElementById('sent_req_pg');

    let currentPage = 1;
    let previousPage = null;
    let nextPage = null;

    function updatePagination() {
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&#9664; Prev';
        prevButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'my-2');
        if (!previousPage) prevButton.classList.add('d-none');
        prevButton.onclick = () => {
            if (previousPage) {
                currentPage = previousPage;
                fetchRequests(currentPage);
            }
        };

        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next &#9654;';
        nextButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'my-2', 'ms-2');
        if (!nextPage) nextButton.classList.add('d-none');
        nextButton.onclick = () => {
            if (nextPage) {
                currentPage = nextPage;
                fetchRequests(currentPage);
            }
        };

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(nextButton);
    }

    function fetchRequests(page = 1) {
        loadingIndicator.style.display = 'block';
        sentRequestsContainer.innerHTML = '';

        fetch(`${root_api}/api/adoptions/adoption-request/sent-requests/?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('authToken')
            }
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';

            if (data.results.length === 0) {
                sentRequestsContainer.innerHTML = '<p>No adoption requests found.</p>';
            } else {
                data.results.forEach(request => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                    const requestContent = document.createElement('div');
                    requestContent.innerHTML = `
                        <h5 class="card-title text-primary my-1">Pet Name: ${request.pet_name}</h5>
                        <p class="card-text mb-1"><strong>Message:</strong> ${request.message || 'No message provided.'}</p>
                        <p class="card-text mb-1"><strong>Author:</strong> ${request.author || 'No owner provided.'}</p>
                        <small class="text-muted">Requested on: ${new Date(request.date_requested).toLocaleString()}</small>
                    `;

                    const badge = document.createElement('span');
                    badge.classList.add('badge', 'position-absolute', 'top-0', 'end-0', 'm-3', 'rounded-pill');
                    switch (request.status) {
                        case 'Pending': badge.classList.add('bg-primary'); badge.textContent = 'Pending'; break;
                        case 'Approved': badge.classList.add('bg-success'); badge.textContent = 'Approved'; break;
                        case 'Rejected': badge.classList.add('bg-danger'); badge.textContent = 'Rejected'; break;
                        default: badge.textContent = 'Unknown Status';
                    }

                    listItem.appendChild(requestContent);
                    listItem.appendChild(badge);
                    sentRequestsContainer.appendChild(listItem);
                });
            }

            previousPage = data.previous ? page - 1 : null;
            nextPage = data.next ? page + 1 : null;
            currentPage = page;

            updatePagination();
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            showAlert('Error fetching adoption requests. Please try again later.', 'danger');
        });
    }
    fetchRequests();
});
