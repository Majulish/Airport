import { getFlights, saveToLocalStorage } from '../common.js';

function addFlight() {
    const flightNo = document.getElementById("flightNo").value;
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const boardingDate = document.getElementById("boardingDate").value;
    const boardingTime = document.getElementById("boardingTime").value;
    const arrivalDate = document.getElementById("arrivalDate").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
    const seatCount = parseInt(document.getElementById("seatCount").value);

    if (!flightNo || !origin || !destination || !boardingDate || !boardingTime || !arrivalDate || !arrivalTime || isNaN(seatCount) || seatCount < 1) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const newFlight = { flightNo, origin, destination, boardingDate, boardingTime, arrivalDate, arrivalTime, seatCount };
    const flights = getFlights();
    flights.push(newFlight);

    saveToLocalStorage("flights", flights);
    alert("Flight added successfully!");
    window.location.href = "manageFlights.html";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addFlightButton").addEventListener("click", addFlight);
});
