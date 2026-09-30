// =========================================
// ADMIN DASHBOARD
// =========================================

async function loadDashboardStats() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/admin/dashboard-stats"
        );

        if (!response.ok) {
            throw new Error("Failed to load dashboard statistics");
        }

        const data = await response.json();

        console.log("Dashboard statistics:", data);

        updateDashboardStats(data);

    } catch (error) {

        console.error(
            "Dashboard connection error:",
            error
        );

    }
}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateDashboardStats(data) {

    const statCards =
        document.querySelectorAll(".stat-card");

    if (statCards.length < 4) {
        return;
    }

    // Total Students
    statCards[0]
        .querySelector("strong")
        .textContent = data.total_students;

    // Total Rooms
    statCards[1]
        .querySelector("strong")
        .textContent = data.total_rooms;

    // Open Complaints
    statCards[2]
        .querySelector("strong")
        .textContent = data.open_complaints;

    // Visitors Today
    statCards[3]
        .querySelector("strong")
        .textContent = data.visitors_today;
}


// =========================================
// LOGOUT
// =========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "../login.html";

        }
    );

}


// =========================================
// LOAD DATA
// =========================================

loadDashboardStats()