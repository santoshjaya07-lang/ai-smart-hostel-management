const roomsGrid = document.getElementById("roomsGrid");

const totalRooms = document.getElementById("totalRooms");
const totalCapacity = document.getElementById("totalCapacity");
const occupiedBeds = document.getElementById("occupiedBeds");
const availableBeds = document.getElementById("availableBeds");

const roomForm = document.getElementById("roomForm");
const roomMessage = document.getElementById("roomMessage");


// =========================================
// LOAD ROOMS
// =========================================

async function loadRooms() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/rooms"
        );

        const data = await response.json();

        displayRooms(data.rooms);

    } catch (error) {

        console.error("Room loading error:", error);

        roomsGrid.innerHTML = `
            <div class="empty">
                Unable to connect to the server.
            </div>
        `;
    }
}


// =========================================
// DISPLAY ROOMS
// =========================================

function displayRooms(rooms) {

    roomsGrid.innerHTML = "";

    const capacityPerRoom = 4;

    let occupied = 0;

    rooms.forEach(room => {

        const studentCount =
            Number(room.student_count);

        occupied += studentCount;

        const percentage =
            Math.min(
                (studentCount / capacityPerRoom) * 100,
                100
            );

        const card =
            document.createElement("div");

        card.className = "room-card";

        card.innerHTML = `

            <div class="room-top">

                <span class="room-number">
                    Room ${room.room_number}
                </span>

                <span class="room-status">
                    ${studentCount}/4
                </span>

            </div>


            <div class="room-info">

                <p>
                    ${room.block_name || "No block assigned"}
                </p>

                <p>
                    Floor ${room.floor_number || 0}
                </p>

            </div>


            <div class="capacity">

                <div class="capacity-bar">

                    <div
                        class="capacity-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

                <div class="capacity-text">

                    <span>
                        ${studentCount} occupied
                    </span>

                    <span>
                        ${capacityPerRoom - studentCount} available
                    </span>

                </div>

            </div>
        `;

        roomsGrid.appendChild(card);

    });


    // SUMMARY

    totalRooms.textContent = rooms.length;

    totalCapacity.textContent =
        rooms.length * capacityPerRoom;

    occupiedBeds.textContent =
        occupied;

    availableBeds.textContent =
        (rooms.length * capacityPerRoom) - occupied;


    if (rooms.length === 0) {

        roomsGrid.innerHTML = `
            <div class="empty">
                No rooms created yet.
            </div>
        `;
    }
}


// =========================================
// CREATE ROOM
// =========================================

roomForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const roomNumber =
            document.getElementById("roomNumber").value.trim();

        const blockName =
            document.getElementById("blockName").value.trim();

        const floorNumber =
            document.getElementById("floorNumber").value || 0;


        roomMessage.textContent =
            "Creating room...";


        try {

            const url =
                `http://127.0.0.1:8000/rooms` +
                `?room_number=${encodeURIComponent(roomNumber)}` +
                `&block_name=${encodeURIComponent(blockName)}` +
                `&floor_number=${floorNumber}`;


            const response =
                await fetch(url, {
                    method: "POST"
                });


            const data =
                await response.json();


            if (!response.ok) {

                roomMessage.textContent =
                    data.detail || "Could not create room.";

                return;
            }


            roomMessage.textContent =
                "Room created successfully!";


            roomForm.reset();

            loadRooms();

        } catch (error) {

            console.error(error);

            roomMessage.textContent =
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