
// Save the initial destinations to localStorage
// Load flights from localStorage or use default flights
let flights = JSON.parse(localStorage.getItem("flights")) || [
    { flightNo: "W61283", origin: "Tel Aviv", destination: "Krakow", boardingDate: "2025-07-16", boardingTime: "20:00", arrivalDate: "2025-07-17", arrivalTime: "01:00", seatCount: 200 },
    { flightNo: "LX8396", origin: "Larnaca", destination: "Zurich", boardingDate: "2025-08-10", boardingTime: "15:30", arrivalDate: "2025-08-10", arrivalTime: "18:45", seatCount: 150 }
];

// Load destinations from localStorage or use default destinations
let destinations = JSON.parse(localStorage.getItem("destinations")) || [
    {
        destCode: "TLV",
        destName: "Tel Aviv",
        airportName: "Ben Gurion Airport",
        airportUrl: "https://www.iaa.gov.il/en/",
        imageUrl: "https://via.placeholder.com/400?text=Tel+Aviv"
    },
    {
        destCode: "JFK",
        destName: "New York",
        airportName: "John F. Kennedy International Airport",
        airportUrl: "https://www.jfkairport.com/",
        imageUrl: "https://thenewyorktravelguide.com/wp-content/uploads/2021/02/statue-of-liberty-nyc-usa_1476328154.jpeg"
    }
];

// Save the initial destinations to localStorage
localStorage.setItem("destinations", JSON.stringify(destinations));

function renderFlights() {
    const table = document.getElementById("flightsTable");
    if (!table) return; // Check if the table exists

    // Clear existing rows (except the header)
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
    </tr>
  `;

    // Add each flight to the table
    flights.forEach(flight => {
        const row = table.insertRow();
        row.insertCell(0).textContent = flight.flightNo;
        row.insertCell(1).textContent = flight.origin;
        row.insertCell(2).textContent = flight.destination;
        row.insertCell(3).textContent = flight.boardingDate;
        row.insertCell(4).textContent = flight.boardingTime;
        row.insertCell(5).textContent = flight.arrivalDate;
        row.insertCell(6).textContent = flight.arrivalTime;
        row.insertCell(7).textContent = flight.seatCount;
    });
}

// Function to render destinations in the table
function renderDestinations() {
    const table = document.getElementById("destinationsTable");
    if (!table) return; // Check if the table exists

    // Clear existing rows (except the header)
    table.innerHTML = `
    <tr>
      <th>Destination Code</th>
      <th>Destination Name</th>
      <th>Airport Name</th>
      <th>Airport URL</th>
      <th>Image URL</th>
    </tr>
  `;

    // Add each destination to the table
    destinations.forEach(destination => {
        const row = table.insertRow();
        row.insertCell(0).textContent = destination.destCode;
        row.insertCell(1).textContent = destination.destName;
        row.insertCell(2).textContent = destination.airportName;
        const linkCell = row.insertCell(3);
        const link = document.createElement("a");
        link.href = destination.airportUrl;
        link.textContent = "Visit";
        link.target = "_blank"; // Open in a new tab
        linkCell.appendChild(link);
        row.insertCell(4).textContent = destination.imageUrl;
    });
}

// Function to add a new flight
function addFlight() {
    // Get input values
    const flightNo = document.getElementById("flightNo").value;
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const boardingDate = document.getElementById("boardingDate").value;
    const boardingTime = document.getElementById("boardingTime").value;
    const arrivalDate = document.getElementById("arrivalDate").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const seatCount = parseInt(document.getElementById("seatCount").value);

    // Validate inputs
    if (!flightNo || !origin || !destination || !boardingDate || !boardingTime || !arrivalDate || !arrivalTime || isNaN(seatCount) || seatCount < 1) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Create new flight object
    const newFlight = { flightNo, origin, destination, boardingDate, boardingTime, arrivalDate, arrivalTime, seatCount };

    // Add new flight to the flights array
    flights.push(newFlight);

    // Save updated flights array to localStorage
    localStorage.setItem("flights", JSON.stringify(flights));

    // Alert confirmation
    alert("Flight added successfully!");

    // Redirect to the manageFlights.html page
    window.location.href = "manageFlights.html";
}

// Function to add a new destination
function addDestination() {
    // Get input values
    const destCode = document.getElementById("destCode").value;
    const destName = document.getElementById("destName").value;
    const airportName = document.getElementById("airportName").value;
    const airportUrl = document.getElementById("airportUrl").value;
    const imageUrl = document.getElementById("imageUrl").value;

    // Validate inputs
    if (!destCode || !destName || !airportName || !airportUrl || !imageUrl) {
        alert("Please fill out all fields.");
        return;
    }

    // Create new destination object
    const newDestination = { destCode, destName, airportName, airportUrl, imageUrl };

    // Add new destination to the destinations array
    destinations.push(newDestination);

    // Save updated destinations array to localStorage
    localStorage.setItem("destinations", JSON.stringify(destinations));

    // Alert confirmation
    alert("Destination added successfully!");

    // Redirect to the manageDestinations.html page
    window.location.href = "manageDestinations.html";
}

// Call render functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("flightsTable")) renderFlights();
    if (document.getElementById("destinationsTable")) renderDestinations();
});


// Function to save a booking and validate all inputs
function saveBooking() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const boardingDate = document.getElementById("boardingDate").value;
    const boardingTime = document.getElementById("boardingTime").value;
    const arrivalDate = document.getElementById("arrivalDate").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const passengerCount = parseInt(document.getElementById("passengerCount").value);

    if (!origin || !destination || isNaN(passengerCount) || passengerCount < 1) {
        alert("Please fill in all required fields.");
        return;
    }

    const passengers = [];
    for (let i = 1; i <= passengerCount; i++) {
        const name = document.getElementById(`passengerName${i}`).value;
        const passportId = document.getElementById(`passportId${i}`).value;
        if (!name || !passportId) {
            alert(`Please fill details for Passenger ${i}`);
            return;
        }
        passengers.push({ name, passportId });
    }

    const destinationData = destinations.find(dest => dest.destName === destination);
    const imageUrl = destinationData ? destinationData.imageUrl : "https://via.placeholder.com/150";

    const booking = {
        origin,
        destination,
        boardingDate,
        boardingTime,
        arrivalDate,
        arrivalTime,
        passengerCount,
        passengers,
        imageUrl
    };

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Booking saved successfully!");
    window.location.href = "myBookings.html";
}

// Updated renderBookings with `imageSrc`
function renderBookings() {
    const bookingsContainer = document.getElementById("bookingsContainer");
    if (!bookingsContainer) return;

    bookingsContainer.innerHTML = ""; // Clear existing bookings

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];

    bookings.forEach(booking => {
        const bookingCard = document.createElement("div");
        bookingCard.className = "booking-card";

        const imageSrc = destinations.find((d) => d.destName === booking.destination)?.imageUrl || "https://via.placeholder.com/150?text=Image+Not+Found";

        const imageDiv = document.createElement("div");
        imageDiv.className = "booking-image";
        imageDiv.innerHTML = `
            <img src="${imageSrc}" alt="Destination Image" 
                 onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found';" />
        `;

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "booking-details";
        detailsDiv.innerHTML = `
            <p><strong>Origin:</strong> ${booking.origin} 
               <strong>Boarding:</strong> ${booking.boardingDate} ${booking.boardingTime}</p>
            <p><strong>Destination:</strong> ${booking.destination} 
               <strong>Landing:</strong> ${booking.arrivalDate} ${booking.arrivalTime}</p>
            <p><strong>No. of Passengers:</strong> ${booking.passengerCount}</p>
        `;

        bookingCard.appendChild(imageDiv);
        bookingCard.appendChild(detailsDiv);
        bookingsContainer.appendChild(bookingCard);
    });
}

// Updated editPhotoLink
function editPhotoLink() {
    const destCode = document.getElementById("destCode").value.trim();
    const newImageUrl = document.getElementById("newImageUrl").value.trim();

    if (!destCode || !newImageUrl) {
        alert("Please fill out all fields.");
        return;
    }

    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    const destinationIndex = destinations.findIndex(dest => dest.destCode === destCode);

    if (destinationIndex === -1) {
        alert("Destination not found. Please check the destination code.");
        return;
    }

    destinations[destinationIndex].imageUrl = newImageUrl;
    localStorage.setItem("destinations", JSON.stringify(destinations));

    alert("Photo link updated successfully!");
    renderBookings(); // Ensure updated image is reflected in bookings
}

// Function to populate dropdowns for origin and destination
function populateDropdowns() {
    const originDropdown = document.getElementById("origin");
    const destinationDropdown = document.getElementById("destination");

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

// Call functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("bookingsContainer")) renderBookings();
    populateDropdowns();
});

