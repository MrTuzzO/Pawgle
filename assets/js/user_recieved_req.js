document.addEventListener("DOMContentLoaded", function () {
    const receivedRequestsContainer = document.getElementById('receivedRequests');
    const loadingIndicator = document.getElementById('loadingIndicator');

    loadingIndicator.style.display = 'block';
    receivedRequestsContainer.innerHTML = '';

    fetch(`${root_api}/api/adoptions/adoption-request/received-requests/`, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('authToken')
        }
    })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';

            if (data.length === 0) {
                receivedRequestsContainer.innerHTML = '<p>No received adoption requests found.</p>';
            } else {
                data.forEach(request => {
                    const cardCol = document.createElement('div');
                    cardCol.classList.add('col-12');

                    const card = document.createElement('div');
                    card.classList.add('card', 'position-relative');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const requestContent = document.createElement('div');
                    requestContent.innerHTML = `
                        <h5 class="card-title text-primary">Pet Name: ${request.pet_name}</h5>
                        <p class="card-text mb-1"><strong>Message:</strong> ${request.message || 'No message provided.'}</p>
                        <p class="card-text mb-1"><strong>Contact:</strong> ${request.contact_info || 'No message provided.'}</p>
                        <p class="card-text mb-1"><strong>Requester:</strong> ${request.requester || 'No owner provided.'}</p>
                        <small class="text-muted">Requested on: ${new Date(request.date_requested).toLocaleString()}</small>
                    `;

                    const actionContainer = document.createElement('div');
                    actionContainer.classList.add('mt-2', 'd-flex', 'gap-2');

                    const badge = document.createElement('span');
                    badge.classList.add('badge', 'position-absolute', 'top-0', 'end-0', 'm-3', 'rounded-pill');

                    switch (request.status) {
                        case 'Pending':
                            const approveButton = document.createElement('button');
                            approveButton.classList.add('btn', 'btn-success', 'btn-sm');
                            approveButton.textContent = 'Approve';
                            approveButton.onclick = () => updateStatus(request.id, 'approve');

                            const rejectButton = document.createElement('button');
                            rejectButton.classList.add('btn', 'btn-danger', 'btn-sm');
                            rejectButton.textContent = 'Reject';
                            rejectButton.onclick = () => updateStatus(request.id, 'reject');

                            actionContainer.appendChild(approveButton);
                            actionContainer.appendChild(rejectButton);
                            break;

                        case 'Approved':
                        case 'Rejected':
                            badge.classList.add(request.status === 'Approved' ? 'bg-success' : 'bg-danger');
                            badge.textContent = request.status;

                            const editButton = document.createElement('button');
                            editButton.classList.add('btn', 'btn-sm', 'border', 'text-secondary');
                            editButton.textContent = 'Edit';
                            editButton.onclick = () => {
                                actionContainer.innerHTML = ''; // Clear existing actions

                                const radioAccept = document.createElement('input');
                                radioAccept.type = 'radio';
                                radioAccept.name = `status-${request.id}`;
                                radioAccept.value = 'approve';
                                radioAccept.checked = request.status === 'Approved';

                                const labelAccept = document.createElement('label');
                                labelAccept.textContent = 'Accept';
                                labelAccept.classList.add('ms-2');
                                labelAccept.prepend(radioAccept);

                                const radioReject = document.createElement('input');
                                radioReject.type = 'radio';
                                radioReject.name = `status-${request.id}`;
                                radioReject.value = 'reject';
                                radioReject.checked = request.status === 'Rejected';

                                const labelReject = document.createElement('label');
                                labelReject.textContent = 'Reject';
                                labelReject.classList.add('ms-2');
                                labelReject.prepend(radioReject);

                                // pending
                                // const radioPending = document.createElement('input');
                                // radioPending.type = 'radio';
                                // radioPending.name = `status-${request.id}`;
                                // radioPending.value = 'pending';
                                // radioPending.checked = request.status === 'Pending';

                                // const labelPending = document.createElement('label');
                                // labelPending.textContent = 'Pending';
                                // labelPending.classList.add('ms-2');
                                // labelPending.prepend(radioPending);
                                // Pending end


                                const saveButton = document.createElement('button');
                                saveButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-auto');
                                saveButton.textContent = 'Save';
                                saveButton.onclick = () => {
                                    const selectedStatus = document.querySelector(`input[name="status-${request.id}"]:checked`).value;
                                    updateStatus(request.id, selectedStatus);
                                };

                                actionContainer.appendChild(labelAccept);
                                actionContainer.appendChild(labelReject);
                                // actionContainer.appendChild(labelPending);
                                actionContainer.appendChild(saveButton);
                            };

                            actionContainer.appendChild(editButton);
                            break;

                        default:
                            badge.textContent = 'Unknown Status';
                    }

                    cardBody.appendChild(requestContent);
                    cardBody.appendChild(actionContainer);
                    card.appendChild(badge);
                    card.appendChild(cardBody);
                    cardCol.appendChild(card);
                    receivedRequestsContainer.appendChild(cardCol);
                });
            }
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            showAlert('Error fetching received adoption requests. Please try again later.', 'danger');
        });
});
function updateStatus(requestId, action) {
    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    console.log(`Updating request status to ${action} for request ID: ${requestId}`);
    fetch(`${root_api}/api/adoptions/adoption-request/${requestId}/update/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({ action: action.toLowerCase() }) // Send 'approve' or 'reject' in lowercase
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update request status');
            }
            return response.json();
        })
        .then(data => {
            document.location.reload();
            showAlert(`Request status updated to ${action}.`, 'success');
        })
        .catch(error => {
            showAlert(error.message, 'danger');
        })
        .finally(() => {
            loader.classList.add('d-none'); // Hide loader
        });
}
