document.addEventListener("DOMContentLoaded", () => {

    const adoptionForm = document.getElementById("adoptionForm");
    const submitButton = document.getElementById("submitBtn");
    const loader = document.getElementById("loader");
    const feedbackSection = document.getElementById("feedbackSection");

    function showFeedback(message, type = "error") {
        feedbackSection.innerHTML = `<div class="alert alert-${type === "success" ? "success" : "danger"}">
            ${message}
        </div>`;
        feedbackSection.classList.remove("d-none");
    }

    function clearFeedback() {
        feedbackSection.innerHTML = "";
        feedbackSection.classList.add("d-none");
    }

    function closeModal() {
        const modalElement = document.getElementById("adoptionFormModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide(); // Close the modal
    }

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        clearFeedback();

        const petId = getIdFromURL();
        if (!petId) {
            showFeedback("Pet ID not found in the URL.");
            return;
        }

        const useDefaultInfo = document.getElementById("defaultContactCheckbox").checked;
        const phoneNumber = document.getElementById("phoneNumber").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!useDefaultInfo && (!email || !phoneNumber)) {
            showFeedback("Email and Phone Number are required when not using default contact info.");
            return;
        }

        const contactInfo = useDefaultInfo ? null : `Email: ${email}, Phone: ${phoneNumber}`;

        const requestBody = {
            pet: petId,
            use_default_info: useDefaultInfo,
            contact_info: contactInfo,
            message: message,
        };

        loader.classList.remove("d-none");

        try {
            const response = await fetch(`${root_api}/api/adoptions/adoption-request/${petId}/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                closeModal(); // Close the modal on success
                showAlert("Adoption request submitted successfully!", "success");
                adoptionForm.reset();
            } else {
                const errorData = await response.json();
                let errorMessage = "Failed to submit the adoption request.";
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (typeof errorData === "object") {
                    errorMessage = Object.values(errorData)
                        .flat()
                        .join("<br>");
                }
                showFeedback(errorMessage);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            showFeedback("An unexpected error occurred. Please try again later.");
        } finally {
            loader.classList.add("d-none");
        }
    });

    // Helper function to extract pet ID from URL
    function getIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    }
});
