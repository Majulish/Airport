import { getDestinations, saveToLocalStorage } from '../common.js';

function addDestination() {
    const destCode = document.getElementById("destCode").value;
    const destName = document.getElementById("destName").value;
    const airportName = document.getElementById("airportName").value;
    const airportUrl = document.getElementById("airportUrl").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (!destCode || !destName || !airportName || !airportUrl || !imageUrl) {
        alert("Please fill out all fields.");
        return;
    }

    const newDestination = { destCode, destName, airportName, airportUrl, imageUrl };
    const destinations = getDestinations();
    destinations.push(newDestination);

    saveToLocalStorage("destinations", destinations);
    alert("Destination added successfully!");
    window.location.href = "manageDestinations.html";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addDestinationButton").addEventListener("click", addDestination);
});
