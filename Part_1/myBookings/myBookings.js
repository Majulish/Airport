import { bookings } from "../Data/BookingData.js";
import { flights } from "../Data/FlightsData.js";
import { destinations } from "../Data/DestinationsData.js";

function renderBookings() {
    const bookingsContainer = document.querySelector(".bookings-container");
    bookingsContainer.innerHTML = ""; // Clear previous bookings

    bookings.forEach((booking) => {
        const flight = flights.find((f) => f.flightNo === booking.flightNo);
        const destination = destinations.find((d) => d.destCode === flight.destination.destCode);

        if (!flight || !destination) {
            console.error(`Flight or destination not found for booking: ${booking.bookingId}`);
            return;
        }

        // Create booking card
        const bookingCard = document.createElement("div");
        bookingCard.className = "booking-card";

        // Create image container
        const imageContainer = document.createElement("div");
        imageContainer.className = "booking-image";
        const image = document.createElement("img");
        image.src = destination.imageUrl;
        image.alt = destination.destName || "Destination Image";
        image.onerror = () => {
            image.src = "https://via.placeholder.com/150?text=Image+Not+Found";
        };
        imageContainer.appendChild(image);

        // Create details container
        const detailsContainer = document.createElement("div");
        detailsContainer.className = "booking-details";

        detailsContainer.innerHTML = `
            <p><strong>Origin:</strong> ${flight.origin} <strong>Boarding:</strong> ${flight.boardingDate} ${flight.boardingTime}</p>
            <p><strong>Destination:</strong> ${destination.destName} <strong>Landing:</strong> ${flight.arrivalDate} ${flight.arrivalTime}</p>
            <p><strong>No. of Passengers:</strong> ${booking.passengerCount}</p>
        `;

        // Append image and details to the booking card
        bookingCard.appendChild(imageContainer);
        bookingCard.appendChild(detailsContainer);

        // Append booking card to the container
        bookingsContainer.appendChild(bookingCard);
    });
}

document.addEventListener("DOMContentLoaded", renderBookings);
