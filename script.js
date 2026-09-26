
// ===============================
// NAVIGATION MENU
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}


// ===============================
// FOOTER YEAR
// ===============================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ===============================
// RESERVATION FORM
// ===============================

const reservationForm = document.getElementById("reservationForm");
const formMessage = document.getElementById("formMessage");

if (reservationForm) {

    reservationForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get values from HTML form
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const guests = document.getElementById("guests").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const message = document.getElementById("message").value.trim();

        // Create object to send to Spring Boot
        const reservationData = {

            name: name,

            email: email,

            phone: phone,

            guests: parseInt(guests),

            reservationDate: date,

            reservationTime: time,

            specialRequest: message
        };

        console.log("Sending reservation:", reservationData);

        try {

            // Send data to Spring Boot backend
            const response = await fetch(
                "http://localhost:8080/api/reservations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(reservationData)
                }
            );

            // Check response
            if (!response.ok) {

                const errorText = await response.text();

                console.error("Server error:", errorText);

                throw new Error("Failed to save reservation");
            }

            // Get saved reservation
            const savedReservation = await response.json();

            console.log("Saved reservation:", savedReservation);

            // Show success message
            formMessage.textContent =
                "✅ Reservation successfully saved!";

            // Clear form
            reservationForm.reset();

        } catch (error) {

            console.error("Reservation error:", error);

            formMessage.textContent =
                "❌ Unable to save reservation. Please try again.";
        }

    });
}


// ===============================
// ORDER BUTTONS
// ===============================

const orderButtons = document.querySelectorAll(".order-btn");

orderButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const foodName = button.getAttribute("data-food");

        alert(
            foodName +
            " selected! Please use the reservation section to book your table."
        );

    });

});