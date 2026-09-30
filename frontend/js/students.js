const studentForm =
    document.getElementById("studentForm");

const studentMessage =
    document.getElementById("studentMessage");

const roomSelect =
    document.getElementById("roomId");


// =========================================
// LOAD ROOMS
// =========================================

async function loadRooms() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/rooms"
        );

        const data = await response.json();

        roomSelect.innerHTML = `
            <option value="">
                No room assigned
            </option>
        `;

        data.rooms.forEach(room => {

            const students =
                Number(room.student_count);

            const option =
                document.createElement("option");

            option.value = room.id;

            option.textContent =
                `Room ${room.room_number} — ${students}/4 students`;

            // Do not allow full rooms
            if (students >= 4) {

                option.disabled = true;

                option.textContent += " — Full";
            }

            roomSelect.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Could not load rooms:",
            error
        );

    }
}


// =========================================
// CREATE STUDENT
// =========================================

studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        studentMessage.textContent =
            "Creating student account...";


        const userId =
            document.getElementById("userId").value.trim();

        const password =
            document.getElementById("password").value;

        const studentId =
            document.getElementById("studentId").value.trim();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const roomId =
            roomSelect.value;


        let url =
            "http://127.0.0.1:8000/students" +

            `?user_id=${encodeURIComponent(userId)}` +

            `&password=${encodeURIComponent(password)}` +

            `&student_id=${encodeURIComponent(studentId)}` +

            `&name=${encodeURIComponent(name)}` +

            `&email=${encodeURIComponent(email)}` +

            `&phone=${encodeURIComponent(phone)}`;


        if (roomId) {

            url +=
                `&room_id=${encodeURIComponent(roomId)}`;

        }


        try {

            const response =
                await fetch(url, {
                    method: "POST"
                });


            const data =
                await response.json();


            if (!response.ok) {

                studentMessage.textContent =
                    data.detail ||
                    "Could not create student.";

                return;
            }


            studentMessage.textContent =
                "Student account created successfully!";


            studentForm.reset();

            await loadRooms();

        } catch (error) {

            console.error(error);

            studentMessage.textContent =
                "Cannot connect to the server.";
        }

    }
);


// =========================================
// BACK TO DASHBOARD
// =========================================

document
    .getElementById("backButton")
    .addEventListener("click", function () {

        window.location.href =
            "admin-dashboard.html";

    });


// =========================================
// INITIAL LOAD
// =========================================

loadRooms();
