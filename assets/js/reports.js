
// for adding loader
const loader = document.getElementById('loader');

document.addEventListener("DOMContentLoaded", function () {
    fetchReports();
});

// Add event listeners to the filter elements
document.getElementById("statusFilter").addEventListener("change", function () {
    fetchReports();
});

document.getElementById("reasonFilter").addEventListener("change", function () {
    fetchReports();
});
document.getElementById("searchInput").addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchReports();
    }
});

function truncateString(str, num) {
    if (str) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }
}

let currentPage = 1;

function getAuthToken() {
    return localStorage.getItem("authToken"); // Fetch token from localStorage
}

function fetchReports(page = 1) {
    const status = document.getElementById("statusFilter").value;
    const reason = document.getElementById("reasonFilter").value;
    const search = document.getElementById("searchInput").value.trim();

    // loader.classList.remove('d-none'); // Show loader

    const reportsTable = document.getElementById("reportsTable");
    reportsTable.innerHTML = `<p class="my-2">Loading data...</p>`

    let apiUrl = `${root_api}/api/reports/?page=${page}`;

    if (status) apiUrl += `&status=${encodeURIComponent(status)}`;
    if (reason) apiUrl += `&reason=${encodeURIComponent(reason)}`;
    if (search) apiUrl += `&search=${encodeURIComponent(search)}`;

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Token ${getAuthToken()}`,
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {

            if (!data || !data.results || !Array.isArray(data.results)) {
                console.error("Invalid response structure:", data);
                return;
            }

            reportsTable.innerHTML = ""; // Clear previous entries
            if (data.results.length === 0) {
                reportsTable.innerHTML = `<p class="my-2">Not found</p>`
                return;
            }
            data.results.forEach(report => {
                const row = document.createElement("tr");

                row.innerHTML = `
                <td>${report.id}</td>
                <td>${report.reporter_username}</td>
                <td>${truncateString(report.post_title, 20)}</td>
                <td>${report.reason}</td>
                <td>${truncateString(report.description, 20)}</td>
                <td>${new Date(report.created_at).toLocaleString()}</td>
                <td>${report.status}</td>
                <td>${truncateString(report.admin_feedback, 20)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick='openEditModal(\`${JSON.stringify(report).replace(/'/g, "&apos;")}\`)'>Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteReport(${report.id})">Delete</button>
                </td>
            `;

                reportsTable.appendChild(row);
            });

            document.getElementById("prevPage").disabled = !data.previous;
            document.getElementById("nextPage").disabled = !data.next;

            currentPage = page;
        })
        .catch(error => console.error("Error fetching reports:", error))
        .finally(() => {
            // Hide loader
            loader.classList.add('d-none');
        });
}

function openEditModal(reportJson) {
    const report = JSON.parse(reportJson);

    document.getElementById("editReportId").value = report.id;
    document.getElementById("editStatus").value = report.status;
    document.getElementById("editFeedback").value = report.admin_feedback || "";
    document.getElementById("editPostId").value = report.post;
    document.getElementById("editReason").value = report.reason;
    document.getElementById("editPostTitle").value = report.post_title;
    document.getElementById("editDescription").value = report.description;

    new bootstrap.Modal(document.getElementById("editReportModal")).show();
}

document.getElementById("saveChanges").addEventListener("click", function () {
    const reportId = document.getElementById("editReportId").value;
    const updatedStatus = document.getElementById("editStatus").value;
    const updatedFeedback = document.getElementById("editFeedback").value;
    const postId = document.getElementById("editPostId").value;  // Get the post ID
    const reason = document.getElementById("editReason").value;  // Get the reason

    loader.classList.remove('d-none'); // Show loader

    // Prepare the data in the desired format
    const requestData = {
        id: reportId,
        post: postId,
        reason: reason,
        status: updatedStatus,
        admin_feedback: updatedFeedback
    };

    // Send the PATCH request
    fetch(`${root_api}/api/reports/${reportId}/`, {
        method: "PATCH",
        headers: {
            "Authorization": `Token ${getAuthToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to update report");
            }
        })
        .then(() => {
            showAlert("Report updated successfully!", "success");
            fetchReports(currentPage);  // Refresh the reports to show updated data
            bootstrap.Modal.getInstance(document.getElementById("editReportModal")).hide();  // Close the modal
        })
        .catch(error => {
            console.error("Error updating report:", error);
            showAlert("There was an issue updating the report.");
        })
        .finally(() => {
            // Hide loader
            loader.classList.add('d-none');
        });
});

function deleteReport(reportId) {
    if (!confirm("Are you sure you want to delete this report?")) return;

    loader.classList.remove('d-none'); // Show loader

    fetch(`${root_api}/api/reports/${reportId}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${getAuthToken()}`,
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (!response.ok) {
                // If the response is not okay, throw an error
                return response.json().then(errorData => {
                    throw new Error(errorData.detail || "Error deleting report");
                });
            }
            showAlert("Report deleted successfully!", "success");
            fetchReports(currentPage);  // Refresh the reports
        })
        .catch(error => {
            console.error("Error deleting report:", error);
            showAlert("Failed to delete the report: " + error.message);
        })
        .finally(() => {
            // Hide loader
            loader.classList.add('d-none');
        });
}


document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) fetchReports(currentPage - 1);
});

document.getElementById("nextPage").addEventListener("click", function () {
    fetchReports(currentPage + 1);
});
