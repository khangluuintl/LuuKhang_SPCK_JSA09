document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("currentUser")) {
        window.location.href = "cars.html";
    }

    document.querySelector("#login-form").addEventListener("submit", function (event) {
        event.preventDefault();
        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value.trim();

        var user = localStorage.getItem(email);

        if (user) {
            var currentUser = JSON.parse(user);
            if (currentUser.password === password) {
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                window.location.href = "cars.html";
            } else {
                alert("Incorrect password");
            }
        } else {
            alert("User not found");
        }
    });
});