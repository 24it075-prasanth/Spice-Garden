const loginForm = document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

     if (username === "admin" && password === "admin123") {

    loginMessage.textContent =
        "Login successful";

    loginMessage.style.color = "green";

    setTimeout(function () {
        window.location.href = "admin.html";
    }, 1000);

}else {

        loginMessage.textContent =
            "Invalid username or password";

        loginMessage.style.color = "red";
    }

});