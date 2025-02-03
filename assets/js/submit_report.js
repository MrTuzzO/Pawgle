document.getElementById("reportForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const loader = document.getElementById('loader');
    loader.classList.remove('d-none'); // Show loader

    const urlParams = new URLSearchParams(window.location.search);
    const post = parseInt(urlParams.get('id')); // Ensure it's an integer
    const reason = document.getElementById("reason").value;
    const description = document.getElementById("rep_description").value;


    console.log("Submitting report:", { post, reason, description });

    try {
        const response = await fetch(`${root_api}/api/reports/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("authToken")}` // Add token for auth
            },
            body: JSON.stringify({ post, reason, description }) // Do not include 'reporter' field
        });

        const responseData = await response.json();
        console.log("Server response:", responseData);

        if (response.ok) {
            showAlert("Report submitted successfully!", "success");
            document.getElementById("reportForm").reset();
            var modal = bootstrap.Modal.getInstance(document.getElementById('reportModal'));
            modal.hide();
        } else {
            showAlert(`Failed: ${JSON.stringify(responseData)}`, "danger");
        }
    } catch (error) {
        console.error("Error submitting report:", error);
        showAlert("Failed to submit report.", "danger");
    } finally {
        loader.classList.add('d-none'); // Hide loader
    }
});
