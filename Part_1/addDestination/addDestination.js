import { getDestinations, saveToLocalStorage } from '../common.js';

function validateField(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
        field.classList.add("error");
        alert(errorMessage);
        return false;
    }
    field.classList.remove("error");
    return true;
}

function validateImageUrl(imageUrl) {
    const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const urlExtension = imageUrl.split(".").pop().toLowerCase();
    return validExtensions.includes(urlExtension);
}

function addDestination() {
    const destCode = document.getElementById("destCode").value.trim();
    const destName = document.getElementById("destName").value.trim();
    const airportName = document.getElementById("airportName").value.trim();
    const airportUrl = document.getElementById("airportUrl").value.trim();
    const imageUrl = document.getElementById("imageUrl").value.trim();

    if (
        !validateField("destCode", "Destination Code is required.") ||
        !validateField("destName", "Destination Name is required.") ||
        !validateField("airportName", "Airport Name is required.") ||
        !validateField("airportUrl", "Airport URL is required.") ||
        !validateField("imageUrl", "Image URL is required.")
    ) {
        return;
    }

    if (!validateImageUrl(imageUrl)) {
        alert("The image URL must end with one of the following extensions: jpg, jpeg, png, gif, or webp.");
        document.getElementById("imageUrl").classList.add("error");
        return;
    }
    document.getElementById("imageUrl").classList.remove("error");

    const destinations = getDestinations();
    const destinationExists = destinations.some(destination =>
        destination.destCode.toLowerCase() === destCode.toLowerCase() ||
        destination.destName.toLowerCase() === destName.toLowerCase()
    );

    if (destinationExists) {
        alert("Destination already exists. Please use a different code or name.");
        return;
    }

    const newDestination = { destCode, destName, airportName, airportUrl, imageUrl };
    destinations.push(newDestination);

    saveToLocalStorage("destinations", destinations);
    alert("Destination added successfully!");
    window.location.href = "../manageDestinations/manageDestinations.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", addDestination);
    } else {
        console.error("Save button not found.");
    }
});
