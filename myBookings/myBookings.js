import { getDestinations } from './common.js';

// Function to render bookings
function renderBookings() {
    const bookingsContainer = document.getElementById("bookingsContainer");
    if (!bookingsContainer) return;

    bookingsContainer.innerHTML = ""; // Clear existing bookings

    // Fetch bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const destinations = getDestinations();

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `<p>No bookings found. Book your first flight!</p>`;
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement("div");
        bookingCard.className = "booking-card";

        // Retrieve flight and passenger information
        const { flight, passengers } = booking;

        // Find destination image
        const imageSrc =
            destinations.find(dest => dest.destName === flight.destination)?.imageUrl ||
            "https://via.placeholder.com/150?text=Destination+Image";

        // Booking card content
        const imageDiv = document.createElement("div");
        imageDiv.className = "booking-image";
        imageDiv.innerHTML = `
            <img src="${imageSrc}" alt="Destination Image" 
                 onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found';" />
        `;

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "booking-details";
        detailsDiv.innerHTML = `
            <p><strong>Origin:</strong> ${flight.origin} 
               <strong>Boarding:</strong> ${flight.boardingDate} ${flight.boardingTime}</p>
            <p><strong>Destination:</strong> ${flight.destination} 
               <strong>Landing:</strong> ${flight.arrivalDate} ${flight.arrivalTime}</p>
            <p><strong>No. of passengers:</strong> ${passengers.length}</p>
        `;

        bookingCard.appendChild(imageDiv);
        bookingCard.appendChild(detailsDiv);
        bookingsContainer.appendChild(bookingCard);
    });
}

// Initialize render function on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    renderBookings();
});
