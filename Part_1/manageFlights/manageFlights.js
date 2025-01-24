import { flights } from '../Data/FlightsData.js';
import { destinations } from '../Data/DestinationsData.js';

function renderFlights() {
    const table = document.getElementById("flightsTable");
    if (!table) return;

    // Add table headers
    table.innerHTML = `
    <tr>
        <th>Flight No.</th>
        <th>Origin</th>
        <th>Destination</th>
        <th>Boarding Date</th>
        <th>Boarding Time</th>
        <th>Arrival Date</th>
        <th>Arrival Time</th>
        <th>No. of Seats</th>
        <th>Booked Seats</th>
    </tr>
  `;

    // Populate the table with data from FlightsData.js
    flights.forEach(flight => {
        const row = table.insertRow();
        row.insertCell(0).textContent = flight.flightNo;
        row.insertCell(1).textContent = flight.origin;
        row.insertCell(2).textContent = flight.destination.destName; // Access destName
        row.insertCell(3).textContent = flight.boardingDate;
        row.insertCell(4).textContent = flight.boardingTime;
        row.insertCell(5).textContent = flight.arrivalDate;
        row.insertCell(6).textContent = flight.arrivalTime;
        row.insertCell(7).textContent = flight.seatCount;
        row.insertCell(8).textContent = flight.takenSeats;
    });
}

function validateDestination(destinationCode) {
    // Check if the destination exists in the destinations list
    const destinationExists = destinations.some(dest => dest.destCode === destinationCode);
    if (!destinationExists) {
        alert(`We do not fly to the destination (${destinationCode}) at this moment.`);
    }
    return destinationExists;
}

document.addEventListener("DOMContentLoaded", () => {
    renderFlights();

    const addFlightButton = document.querySelector(".actions-end .button");
    addFlightButton.addEventListener("click", (event) => {
        const destinationCode = prompt("Enter the destination code for validation:");
        if (!validateDestination(destinationCode)) {
            event.preventDefault(); // Stop navigation if destination is invalid
        }
    });
});



