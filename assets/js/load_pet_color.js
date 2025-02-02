// Function to dynamically load color options
function loadColorOptions(elementId) {
    fetch(`${root_api}/api/pet/colors/`)
        .then(response => response.json())
        .then(data => {
            const colorSelect = document.getElementById(elementId);
            data.forEach(color => {
                const option = document.createElement('option');
                option.value = color.id;
                option.textContent = color.name;
                colorSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching color options:', error));
}