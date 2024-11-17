// Load flights from localStorage or use default flights
let flights = JSON.parse(localStorage.getItem("flights")) || [
    { flightNo: "W61283", origin: "Tel Aviv", destination: "Krakow", boardingDate: "2025-07-16", boardingTime: "20:00", arrivalDate: "2025-07-17", arrivalTime: "01:00", seatCount: 200 },
    { flightNo: "LX8396", origin: "Larnaca", destination: "Zurich", boardingDate: "2025-08-10", boardingTime: "15:30", arrivalDate: "2025-08-10", arrivalTime: "18:45", seatCount: 150 }
];

// Load destinations from localStorage or use default destinations
let destinations = JSON.parse(localStorage.getItem("destinations")) || [
    { destCode: "TLV", destName: "Tel Aviv", airportName: "Ben Gurion Airport", airportUrl: "https://www.iaa.gov.il/en/", imageUrl: "image1.jpg" },
    { destCode: "JFK", destName: "New York", airportName: "John F. Kennedy International Airport", airportUrl: "https://www.jfkairport.com/", imageUrl: "image2.jpg" }
];

// Function to render flights in the table
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

// Function to populate origin and destination dropdowns
function populateDropdowns() {
    const originDropdown = document.getElementById("origin");
    const destinationDropdown = document.getElementById("destination");

    // Load flights and destinations from localStorage
    const flights = JSON.parse(localStorage.getItem("flights")) || [];
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];

    // Collect unique origins from flights
    const origins = [...new Set(flights.map(flight => flight.origin))];
    // Collect unique destination names from destinations
    const destinationNames = [...new Set(destinations.map(dest => dest.destName))];

    // Populate the origin dropdown
    origins.forEach(origin => {
        const option = document.createElement("option");
        option.value = origin;
        option.textContent = origin;
        originDropdown.appendChild(option);
    });

    // Populate the destination dropdown
    destinationNames.forEach(destination => {
        const option = document.createElement("option");
        option.value = destination;
        option.textContent = destination;
        destinationDropdown.appendChild(option);
    });
}

// Function to book a flight
function bookFlight() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const passengerCount = parseInt(document.getElementById("passengerCount").value);

    // Validate inputs
    if (!origin || !destination || isNaN(passengerCount) || passengerCount < 1) {
        alert("Please select valid origin, destination, and number of passengers.");
        return;
    }

    // Create passenger details dynamically based on the passenger count
    const passengerFields = document.getElementById("passengerFields");
    passengerFields.innerHTML = ""; // Clear existing fields

    for (let i = 1; i <= passengerCount; i++) {
        const nameLabel = document.createElement("label");
        nameLabel.textContent = `Passenger ${i} Name:`;
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = `passengerName${i}`;
        nameInput.required = true;

        const passportLabel = document.createElement("label");
        passportLabel.textContent = `Passenger ${i} Passport ID:`;
        const passportInput = document.createElement("input");
        passportInput.type = "text";
        passportInput.id = `passportId${i}`;
        passportInput.required = true;

        passengerFields.appendChild(nameLabel);
        passengerFields.appendChild(nameInput);
        passengerFields.appendChild(document.createElement("br"));
        passengerFields.appendChild(passportLabel);
        passengerFields.appendChild(passportInput);
        passengerFields.appendChild(document.createElement("br"));
    }

    alert("Passenger fields generated. Fill out the details and click Save again.");
}

// Call populateDropdowns when the page loads
document.addEventListener("DOMContentLoaded", populateDropdowns);
