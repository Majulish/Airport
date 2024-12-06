import { destinations } from './Data/DestinationsData.js';




// Populate origin and destination dropdowns
export function populateDropdowns() {
    const originDropdown = document.getElementById("origin");
    const destinationDropdown = document.getElementById("destination");

    const flights = JSON.parse(localStorage.getItem("flights")) || [];
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];

    const origins = [...new Set(flights.map(flight => flight.origin))];
    const destinationNames = [...new Set(destinations.map(dest => dest.destName))];

    originDropdown.innerHTML = `<option value="">Select Origin</option>`;
    destinationDropdown.innerHTML = `<option value="">Select Destination</option>`;

    origins.forEach(origin => {
        const option = document.createElement("option");
        option.value = origin;
        option.textContent = origin;
        originDropdown.appendChild(option);
    });

    destinationNames.forEach(destination => {
        const option = document.createElement("option");
        option.value = destination;
        option.textContent = destination;
        destinationDropdown.appendChild(option);
    });
}

// Get destinations from localStorage
export function getDestinations() {
    return destinations; // Returns the list of destinations
}

// Get flights from localStorage
export function getFlights() {
    return JSON.parse(localStorage.getItem("flights")) || [];
}

// Save to localStorage
export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Utility function to find a destination by name
export function findDestinationByName(destinations, destName) {
    return destinations.find(dest => dest.destName === destName);
}
