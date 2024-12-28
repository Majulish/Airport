import {Booking} from '../Model/booking.module';

export const bookings = [
  new Booking(
    "B001",
    "NYC123",
    [
      { name: "John Doe", passportId: "A1234567" },
      { name: "Jane Doe", passportId: "A1234568" },
    ],
    2
  ),
  new Booking(
    "B002",
    "LAX456",
    [
      { name: "Alice Smith", passportId: "B9876543" },
      { name: "Bob Smith", passportId: "B9876544" },
      { name: "Charlie Brown", passportId: "B9876545" },
    ],
    3
  ),
  new Booking(
    "B003",
    "LHR789",
    [
      { name: "Emily Davis", passportId: "C7654321" },
    ],
    1
  ),
  new Booking(
    "B004",
    "DXB101",
    [
      { name: "Michael Johnson", passportId: "D1239876" },
      { name: "Sarah Johnson", passportId: "D1239877" },
      { name: "David Wilson", passportId: "D1239878" },
    ],
    3
  ),
  new Booking(
    "B005",
    "HND202",
    [
      { name: "Anna Lee", passportId: "E4321987" },
      { name: "Chris Lee", passportId: "E4321988" },
      { name: "Sophia Lee", passportId: "E4321989" },
      { name: "William Lee", passportId: "E4321990" },
    ],
    4
  ),
  new Booking(
    "B006",
    "SYD303",
    [
      { name: "Oliver Green", passportId: "F3216547" },
    ],
    1
  ),
  new Booking(
    "B007",
    "CDG404",
    [
      { name: "Liam White", passportId: "G6543217" },
      { name: "Emma White", passportId: "G6543218" },
    ],
    2
  ),
  new Booking(
    "B008",
    "SFO505",
    [
      { name: "Noah Brown", passportId: "H8765432" },
    ],
    1
  ),
  new Booking(
    "B009",
    "SIN606",
    [
      { name: "Ava Miller", passportId: "I5432176" },
      { name: "Isabella Miller", passportId: "I5432177" },
    ],
    2
  ),
  new Booking(
    "B010",
    "FCO707",
    [
      { name: "Ethan Martinez", passportId: "J9876541" },
      { name: "Mia Martinez", passportId: "J9876542" },
      { name: "Lucas Martinez", passportId: "J9876543" },
    ],
    3
  ),
];
