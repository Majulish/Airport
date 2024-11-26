import { flights } from '../Data/FlightsData.js';
import { destinations } from "../Data/DestinationsData.js";

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

    console.log('Populated Dropdowns:', { uniqueOrigins, uniqueDestinations }); // Debugging
}


/* Render Flights in the Table */
function renderFlights(filteredFlights) {
    const flightsTableBody = document.querySelector('#flightsTable tbody');
    flightsTableBody.innerHTML = ''; // Clear previous rows

    filteredFlights.forEach((flight, index) => {
        const row = document.createElement('tr');

        // Flight Details
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

    // Attach event listeners to all "Book" buttons
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            const flightIndex = button.getAttribute('data-index');
            const selectedFlight = filteredFlights[flightIndex];
            showBookingForm(selectedFlight);
        });
    });
}

/* Show the Booking Form for a Selected Flight */
function showBookingForm(flight) {
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.style.display = 'block';

    const flightDetails = document.getElementById('flightDetails');
    const availableSeats = flight.seatCount - flight.takenSeats;
    flightDetails.textContent = `Origin: ${flight.origin} Boarding: ${flight.boardingDate} ${flight.boardingTime}
        Destination: ${flight.destination} Landing: ${flight.arrivalDate} ${flight.arrivalTime}
        Available Seats: ${availableSeats}`;

    // Generate Passenger Input Fields
    const passengerFieldsContainer = document.getElementById('passengerFields');
    passengerFieldsContainer.innerHTML = ''; // Clear existing fields

    const numPassengersField = document.getElementById('numPassengers');
    numPassengersField.addEventListener('input', () => {
        const numPassengers = parseInt(numPassengersField.value);
        passengerFieldsContainer.innerHTML = ''; // Clear previous fields

        for (let i = 1; i <= numPassengers; i++) {
            passengerFieldsContainer.innerHTML += `
                <div>
                    <label>Passenger ${i} Name: <input type="text" id="passengerName${i}" required></label><br>
                    <label>Passenger ${i} Passport ID: <input type="text" id="passportId${i}" required></label><br>
                </div>
            `;
        }
    });

    bookingForm.onsubmit = (e) =>saveBooking(e, flight);
}

function saveBooking(e, flight) {
    e.preventDefault(); // Prevent form reload

    const origin = flight.origin;
    const destination = flight.destination;
    const boardingDate = flight.boardingDate;
    const boardingTime = flight.boardingTime;
    const arrivalDate = flight.arrivalDate;
    const arrivalTime = flight.arrivalTime;

    const passengerCount = parseInt(document.getElementById('numPassengers').value);
    if (isNaN(passengerCount) || passengerCount < 1) {
        alert('Please enter a valid number of passengers.');
        return;
    }

    const passengers = [];
    for (let i = 1; i <= passengerCount; i++) {
        const name = document.getElementById(`passengerName${i}`).value;
        const passportId = document.getElementById(`passportId${i}`).value;

        if (!name || !passportId) {
            alert(`Please fill out all fields for Passenger ${i}.`);
            return;
        }

        passengers.push({ name, passportId });
    }

    const destinationData = destinations.find(dest => dest.destName === destination);
    const imageUrl = destinationData ? destinationData.imageUrl : "https://via.placeholder.com/150";

    const booking = {
    origin: flight.origin,
    destination: flight.destination,
    boardingDate: flight.boardingDate,
    boardingTime: flight.boardingTime,
    arrivalDate: flight.arrivalDate,
    arrivalTime: flight.arrivalTime,
    passengerCount,
    passengers,
    imageUrl
};


    console.log('Booking Data:', booking); // Debug log for booking data

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    console.log('Updated Bookings:', bookings); // Debug log for saved bookings

    alert('Booking saved successfully!');
    window.location.href = '../myBookings/myBookings.html';
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

function renderBookings() {
    const bookingsContainer = document.getElementById("bookingsContainer");
    if (!bookingsContainer) return;

    bookingsContainer.innerHTML = ""; // Clear existing bookings

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    console.log('Retrieved Bookings:', bookings); // Debugging

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `<p>No bookings found. Book your first flight!</p>`;
        return;
    }

    bookings.forEach((booking) => {
        const { origin, destination, boardingDate, boardingTime, arrivalDate, arrivalTime, passengers, imageUrl } = booking;

        const bookingCard = document.createElement("div");
        bookingCard.className = "booking-card";

        bookingCard.innerHTML = `
            <div class="booking-image">
                <img src="${imageUrl}" alt="Destination Image"
                     onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found';" />
            </div>
            <div class="booking-details">
                <p><strong>Origin:</strong> ${origin}</p>
                <p><strong>Destination:</strong> ${destination}</p>
                <p><strong>Boarding:</strong> ${boardingDate} ${boardingTime}</p>
                <p><strong>Arrival:</strong> ${arrivalDate} ${arrivalTime}</p>
                <p><strong>No. of Passengers:</strong> ${passengers.length}</p>
            </div>
        `;
        bookingsContainer.appendChild(bookingCard);
    });
}

document.addEventListener("DOMContentLoaded", renderBookings);


/* Initialize Page */
document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    renderFlights(flights); // Show all flights initially

    document.getElementById('origin').addEventListener('change', filterFlights);
    document.getElementById('destination').addEventListener('change', filterFlights);
});
