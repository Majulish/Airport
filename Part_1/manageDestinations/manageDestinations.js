import { destinations } from '../Data/DestinationsData.js';

function renderDestinations() {
    const tableBody = document.querySelector('#destinationsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Handle empty or invalid destinations array
    if (!Array.isArray(destinations) || destinations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No destinations available.</td></tr>';
        return;
    }

    destinations.forEach(destination => {
        const row = document.createElement('tr');

        // Destination Code
        const destCodeCell = document.createElement('td');
        destCodeCell.textContent = destination.destCode;
        row.appendChild(destCodeCell);

        // Destination Name
        const destNameCell = document.createElement('td');
        destNameCell.textContent = destination.destName;
        row.appendChild(destNameCell);

        // Airport Name
        const airportNameCell = document.createElement('td');
        airportNameCell.textContent = destination.airportName;
        row.appendChild(airportNameCell);

        // Airport URL
        const airportUrlCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = destination.airportUrl;
        link.textContent = "Visit";
        link.target = "_blank";
        link.ariaLabel = `Visit ${destination.airportName} website`;
        airportUrlCell.appendChild(link);
        row.appendChild(airportUrlCell);

        // Image
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = destination.imageUrl;
        img.alt = `Image of ${destination.destName}`;
        img.style.width = "100px"; // Adjust size as needed
        img.style.height = "auto";
        img.style.objectFit = "cover";
        img.loading = "lazy"; // Improve performance
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', renderDestinations);
