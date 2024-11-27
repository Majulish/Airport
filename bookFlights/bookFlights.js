import { flights } from '../Data/FlightsData.js'; // Ensure the correct path

/* Render the Flights Table */
function renderFlightsTable() {
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
        <h2>Book a Flight</h2>
        <div class="filter">
            <label for="origin">Filter by: Origin:</label>
            <select id="origin">
                <option value="">Select Origin</option>
            </select>

            <label for="destination">Destination:</label>
            <select id="destination">
                <option value="">Select Destination</option>
            </select>
        </div>
        <table id="flightsTable">
            <thead>
                <tr>
                    <th>Flight No.</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- Rows dynamically generated -->
            </tbody>
        </table>
    `;

    populateDropdowns();
    renderFlights(flights);

    // Attach event listeners to the dropdowns
    document.getElementById('origin').addEventListener('change', filterFlights);
    document.getElementById('destination').addEventListener('change', filterFlights);
}

/* Render Flights in the Table */
function renderFlights(filteredFlights) {
    const flightsTableBody = document.querySelector('#flightsTable tbody');
    flightsTableBody.innerHTML = ''; // Clear previous rows

    filteredFlights.forEach((flight, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flight.flightNo}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td>
                <button class="button" data-index="${index}">Book</button>
            </td>
        `;
        flightsTableBody.appendChild(row);
    });

    // Attach event listeners to "Book" buttons
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', (event) => {
            const flightIndex = event.target.dataset.index;
            const selectedFlight = filteredFlights[flightIndex];
            showBookingForm(selectedFlight);
        });
    });
}

/* Populate Dropdowns for Origin and Destination */
function populateDropdowns() {
    const originDropdown = document.getElementById('origin');
    const destinationDropdown = document.getElementById('destination');

    const uniqueOrigins = [...new Set(flights.map(flight => flight.origin))];
    const uniqueDestinations = [...new Set(flights.map(flight => flight.destination))];

    // Populate Origins
    uniqueOrigins.forEach(origin => {
        const option = document.createElement('option');
        option.value = origin;
        option.textContent = origin;
        originDropdown.appendChild(option);
    });

    // Populate Destinations
    uniqueDestinations.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination;
        option.textContent = destination;
        destinationDropdown.appendChild(option);
    });
}

/* Show the Booking Form for a Selected Flight */
function showBookingForm(flight) {
    const mainContent = document.querySelector("main");
    const availableSeats = flight.seatCount - flight.takenSeats;

    mainContent.innerHTML = `
        <h3>Flight Details</h3>
        <p>
            Origin: ${flight.origin}<br>
            Boarding: ${flight.boardingDate} ${flight.boardingTime}<br>
            Destination: ${flight.destination}<br>
            Landing: ${flight.arrivalDate} ${flight.arrivalTime}<br>
            Available Seats: ${availableSeats}
        </p>
        <form id="bookingForm">
            <label for="numPassengers">No. of Passengers:</label>
            <input type="number" id="numPassengers" min="1" max="${availableSeats}" required><br>
            <div id="passengerFields"></div>
            <button type="submit">Save Booking</button>
        </form>
    `;

    const numPassengersField = document.getElementById('numPassengers');
    numPassengersField.addEventListener('input', () => updatePassengerFields(numPassengersField.value));

    document.getElementById('bookingForm').addEventListener('submit', (e) => saveBooking(e, flight));
}

/* Update Passenger Input Fields Dynamically */
function updatePassengerFields(numPassengers) {
    const passengerFieldsContainer = document.getElementById('passengerFields');
    passengerFieldsContainer.innerHTML = ''; // Clear previous fields

    for (let i = 1; i <= numPassengers; i++) {
        passengerFieldsContainer.innerHTML += `
            <div>
                <label>Passenger ${i} Name: <input type="text" id="passengerName${i}" required></label><br>
                <label>Passenger ${i} Passport ID: <input type="text" id="passportId${i}" required></label><br>
            </div>
        `;
    }
}

/* Save Booking Data and Return to the Flight Table */
function saveBooking(e, flight) {
    e.preventDefault(); // Prevent form reload

    const numPassengers = parseInt(document.getElementById('numPassengers').value);
    const passengers = [];

    for (let i = 1; i <= numPassengers; i++) {
        const name = document.getElementById(`passengerName${i}`).value.trim();
        const passportId = document.getElementById(`passportId${i}`).value.trim();

        if (!name || !passportId) {
            alert(`Please fill out all fields for Passenger ${i}.`);
            return;
        }

        passengers.push({ name, passportId });
    }

    console.log('Booking Data:', { flight, passengers }); // Debug log
    alert('Booking saved successfully!');
    renderFlightsTable(); // Return to the flight table
}

/* Filter Flights Based on Origin and Destination */
function filterFlights() {
    const originFilter = document.getElementById('origin').value;
    const destinationFilter = document.getElementById('destination').value;

    const filteredFlights = flights.filter(flight => {
        const matchesOrigin = !originFilter || flight.origin === originFilter;
        const matchesDestination = !destinationFilter || flight.destination === destinationFilter;
        return matchesOrigin && matchesDestination;
    });

    renderFlights(filteredFlights);
}

/* Initialize Page */
document.addEventListener('DOMContentLoaded', () => {
    renderFlightsTable(); // Render the initial flights table
});
