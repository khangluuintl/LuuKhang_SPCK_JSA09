document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("currentUser")) {
    window.location.href = "cars.html";
  }

  document.querySelector("#register-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var username = document.getElementById("username").value.trim();

    let lowerCaseLetter = /[a-z]/g;
    let numbers = /[0-9]/g;

    if (username.length < 6) {
      alert("Username must be at least 6 characters");
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters");
    } else if (!password.match(lowerCaseLetter)) {
      alert("Password must  contain a lowercase letter");
    } else if (!password.match(numbers)) {
      alert("Password must  contain a number or special character");
    } else {
      const user = {
        username: username,
        email: email,
        password: password
      };
      localStorage.setItem(email, JSON.stringify(user));
      alert("User created successfully, please login");
      window.location.href = "login.html";
    }
  });
});
    