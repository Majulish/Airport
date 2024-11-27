import { destinations } from '../Data/DestinationsData.js';
import { flights } from '../Data/FlightsData.js';

function validateDestination(destinationCode) {
    // Check if the destination exists in the destinations list
    const destinationExists = destinations.some(dest => dest.destCode.toLowerCase() === destinationCode.toLowerCase());
    return destinationExists;
}

function addFlight(event) {
    event.preventDefault(); // Prevent default form submission

    const flightNo = document.getElementById("flightNo").value.trim();
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const boardingDate = document.getElementById("boardingDate").value;
    const boardingTime = document.getElementById("boardingTime").value;
    const arrivalDate = document.getElementById("arrivalDate").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const seatCount = parseInt(document.getElementById("seatCount").value, 10);

    // Validate destination code
    if (!validateDestination(destination)) {
        alert(`Sorry, we do not fly to the destination (${destination}) yet.`);
        return;
    }

    // Create a new flight object
    const newFlight = {
        flightNo,
        origin,
        destination,
        boardingDate,
        boardingTime,
        arrivalDate,
        arrivalTime,
        seatCount,
        takenSeats: 0 // Default booked seats
    };

    // Add the new flight to the flights array (or save to localStorage/server)
    flights.push(newFlight);

    // Show success message
    alert("Flight added successfully!");

    // Redirect to manage flights page
    window.location.href = "../manageFlights/manageFlights.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const addFlightForm = document.getElementById("addFlightForm");
    addFlightForm.addEventListener("submit", addFlight);
});
