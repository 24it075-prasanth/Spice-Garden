// ==========================================
// SPICE GARDEN - ADMIN DASHBOARD
// ==========================================

const API_URL = "https://spice-garden-production-57b1.up.railway.app/api/reservations";

let currentReservationId = null;

// Store all reservations
let allReservations = [];

// Current filter
let currentFilter = "ALL";


// ==========================================
// LOAD RESERVATIONS
// ==========================================

async function loadReservations() {

    console.log("Loading reservations...");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load reservations");
        }

        const reservations = await response.json();

        console.log("Reservations loaded:", reservations);

        // Store all reservations
        allReservations = reservations;

        // Display according to current filter
        applyFilter();

        // Statistics always use all reservations
        updateStatistics(reservations);

    } catch (error) {

        console.error("Error loading reservations:", error);

        alert("Unable to load reservations");

    }
}


// ==========================================
// APPLY FILTER
// ==========================================

function applyFilter() {

    let filteredReservations = allReservations;

    if (currentFilter !== "ALL") {

        filteredReservations =
            allReservations.filter(function(reservation) {

                return reservation.status === currentFilter;

            });

    }

    console.log(
        "Current filter:",
        currentFilter
    );

    console.log(
        "Filtered reservations:",
        filteredReservations
    );

    displayReservations(filteredReservations);
}


// ==========================================
// FILTER RESERVATIONS
// ==========================================

function filterReservations(status) {

    currentFilter = status;

    applyFilter();

    updateActiveNav(status);

}


// ==========================================
// UPDATE ACTIVE SIDEBAR BUTTON
// ==========================================

function updateActiveNav(status) {

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {

        item.classList.remove("active");

    });

    navItems.forEach(function(item) {

        const text =
            item.textContent.trim().toUpperCase();

        if (
            (status === "ALL" && text === "DASHBOARD") ||
            (status === "ALL" && text === "RESERVATIONS") ||
            text === status
        ) {

            item.classList.add("active");

        }

    });

}


// ==========================================
// DISPLAY RESERVATIONS
// ==========================================

function displayReservations(reservations) {

    const table =
        document.getElementById("reservationTable");

    if (!table) {

        console.error(
            "reservationTable not found"
        );

        return;
    }

    table.innerHTML = "";


    if (reservations.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No reservations found
                </td>
            </tr>
        `;

        return;
    }


    reservations.forEach(function(reservation) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${reservation.id}</td>

            <td>${reservation.name}</td>

            <td>${reservation.email}</td>

            <td>${reservation.phone}</td>

            <td>${reservation.guests}</td>

            <td>${reservation.reservationDate}</td>

            <td>${reservation.reservationTime}</td>

            <td>
                <span class="status ${getStatusClass(reservation.status)}">
                    ${reservation.status}
                </span>
            </td>

            <td>
                <button
                    class="view-btn"
                    onclick="window.viewReservation(${reservation.id})">
                    View
                </button>
            </td>
        `;


        table.appendChild(row);

    });

}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    if (status === "PENDING") {
        return "pending-status";
    }

    if (status === "CONFIRMED") {
        return "confirmed-status";
    }

    if (status === "COMPLETED") {
        return "completed-status";
    }

    if (status === "CANCELLED") {
        return "cancelled-status";
    }

    return "";

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(reservations) {

    let pending = 0;

    let confirmed = 0;

    let completed = 0;

    let cancelled = 0;


    reservations.forEach(function(reservation) {

        if (reservation.status === "PENDING") {

            pending++;

        }

        else if (reservation.status === "CONFIRMED") {

            confirmed++;

        }

        else if (reservation.status === "COMPLETED") {

            completed++;

        }

        else if (reservation.status === "CANCELLED") {

            cancelled++;

        }

    });


    document.getElementById("totalReservations").textContent =
        reservations.length;

    document.getElementById("pendingReservations").textContent =
        pending;

    document.getElementById("confirmedReservations").textContent =
        confirmed;

    document.getElementById("completedReservations").textContent =
        completed;

    document.getElementById("cancelledReservations").textContent =
        cancelled;

}


// ==========================================
// REFRESH DASHBOARD
// ==========================================

function refreshDashboard() {

    loadReservations();

}


// ==========================================
// VIEW RESERVATION
// ==========================================

async function viewReservation(id) {

    console.log("View clicked. ID =", id);

    currentReservationId = id;


    try {

        const response =
    await fetch(`https://spice-garden-production-57b1.up.railway.app/api/reservations/${id}`);

console.log(
    "Response status =",
    response.status
);


        if (!response.ok) {

            throw new Error(
                "Reservation not found"
            );

        }


        const reservation =
            await response.json();


        console.log(
            "Reservation details:",
            reservation
        );


        // ==========================================
        // FILL MODAL
        // ==========================================

        document.getElementById("modalId").textContent =
            reservation.id;

        document.getElementById("modalName").textContent =
            reservation.name;

        document.getElementById("modalEmail").textContent =
            reservation.email;

        document.getElementById("modalPhone").textContent =
            reservation.phone;

        document.getElementById("modalGuests").textContent =
            reservation.guests;

        document.getElementById("modalDate").textContent =
            reservation.reservationDate;

        document.getElementById("modalTime").textContent =
            reservation.reservationTime;

        document.getElementById("modalStatus").textContent =
            reservation.status;

        document.getElementById("modalSpecialRequest").textContent =
            reservation.specialRequest || "None";


        // ==========================================
        // SHOW MODAL
        // ==========================================

        document.getElementById("reservationModal").style.display =
            "flex";


    }

    catch (error) {

        console.error(
            "View error:",
            error
        );

        alert(
            "Unable to load reservation details"
        );

    }

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeReservationModal() {

    document.getElementById("reservationModal").style.display =
        "none";

}


// ==========================================
// UPDATE RESERVATION STATUS
// ==========================================

async function updateReservationStatus(status) {

    if (!currentReservationId) {

        alert(
            "Reservation ID not found"
        );

        return;
    }


    const confirmAction = confirm(
        "Are you sure you want to mark this reservation as " +
        status +
        "?"
    );


    if (!confirmAction) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/${currentReservationId}/status?status=${status}`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to update status"
            );

        }


        const updatedReservation =
            await response.json();


        console.log(
            "Updated reservation:",
            updatedReservation
        );


        alert(
            "Reservation #" +
            updatedReservation.id +
            " is now " +
            updatedReservation.status
        );


        closeReservationModal();


        // Reload from database
        loadReservations();

    }


    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "Unable to update reservation status"
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    window.location.href =
        "admin-login.html";

}


// ==========================================
// SIDEBAR BUTTONS
// ==========================================

function setupSidebar() {

    const navItems =
        document.querySelectorAll(".nav-item");


    if (navItems.length < 6) {

        console.error(
            "Sidebar navigation items not found"
        );

        return;

    }


    // Dashboard
    navItems[0].onclick = function() {

        filterReservations("ALL");

    };


    // Reservations
    navItems[1].onclick = function() {

        filterReservations("ALL");

    };


    // Pending
    navItems[2].onclick = function() {

        filterReservations("PENDING");

    };


    // Confirmed
    navItems[3].onclick = function() {

        filterReservations("CONFIRMED");

    };


    // Completed
    navItems[4].onclick = function() {

        filterReservations("COMPLETED");

    };


    // Cancelled
    navItems[5].onclick = function() {

        filterReservations("CANCELLED");

    };

}


// ==========================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================

window.viewReservation =
    viewReservation;

window.closeReservationModal =
    closeReservationModal;

window.updateReservationStatus =
    updateReservationStatus;

window.refreshDashboard =
    refreshDashboard;

window.logout =
    logout;


// ==========================================
// START DASHBOARD
// ==========================================

console.log(
    "admin.js loaded successfully"
);

setupSidebar();

loadReservations();