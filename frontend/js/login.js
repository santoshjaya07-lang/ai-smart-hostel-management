const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "Show";

    }

});


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const userId = document.getElementById("userId").value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "Signing in...";


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: userId,
                    password: password
                })
            }
        );


        const data = await response.json();


        // ===============================
        // LOGIN SUCCESS
        // ===============================

        if (response.ok) {

            loginMessage.textContent =
                "Login successful!";

            console.log("Logged in user:", data);

            if (data.role === "admin") {

                window.location.href =
                    "pages/admin-dashboard.html";

            } else if (data.role === "student") {

                window.location.href =
                    "pages/student-dashboard.html";

            }

        }


        // ===============================
        // LOGIN FAILED
        // ===============================

        else {

            loginMessage.textContent =
                data.detail || "Login failed.";

        }

    }


    // ===============================
    // SERVER ERROR
    // ===============================

    catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Cannot connect to the server.";

    }

});