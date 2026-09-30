from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import verify_password, hash_password
import mysql.connector
from pydantic import BaseModel

from backend.database import get_database_connection
from backend.auth import verify_password


app = FastAPI(title="AI Smart Hostel")


# ===============================
# CORS
# ===============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# LOGIN REQUEST
# ===============================

class LoginRequest(BaseModel):
    user_id: str
    password: str


# ===============================
# HOME
# ===============================

@app.get("/")
def home():
    return {
        "message": "AI Smart Hostel Backend is running!"
    }


# ===============================
# DATABASE TEST
# ===============================

@app.get("/database-test")
def database_test():

    connection = get_database_connection()

    if connection.is_connected():

        connection.close()

        return {
            "status": "success",
            "message": "MySQL database connected successfully!"
        }

    return {
        "status": "failed",
        "message": "Could not connect to MySQL"
    }


# ===============================
# LOGIN
# ===============================

@app.post("/login")
def login(request: LoginRequest):

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, user_id, password_hash, role
        FROM users
        WHERE user_id = %s
        """,
        (request.user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID or password"
        )

    password_correct = verify_password(
        request.password,
        user["password_hash"]
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID or password"
        )

    return {
        "status": "success",
        "message": "Login successful",
        "user_id": user["user_id"],
        "role": user["role"]
    }
    
    # ===============================
# ADMIN DASHBOARD STATISTICS
# ===============================

@app.get("/admin/dashboard-stats")
def dashboard_stats():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    # Count students
    cursor.execute("""
        SELECT COUNT(*) AS total_students
        FROM students
    """)

    student_result = cursor.fetchone()

    # Count rooms
    cursor.execute("""
        SELECT COUNT(*) AS total_rooms
        FROM rooms
    """)

    room_result = cursor.fetchone()

    cursor.close()
    connection.close()

    return {
        "total_students": student_result["total_students"],
        "total_rooms": room_result["total_rooms"],
        "open_complaints": 0,
        "visitors_today": 0
    }
    
    # ===============================
# ROOM MANAGEMENT
# ===============================

@app.get("/rooms")
def get_rooms():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            r.id,
            r.room_number,
            r.block_name,
            r.floor_number,
            COUNT(s.id) AS student_count
        FROM rooms r
        LEFT JOIN students s
            ON r.id = s.room_id
        GROUP BY
            r.id,
            r.room_number,
            r.block_name,
            r.floor_number
        ORDER BY r.room_number
    """)

    rooms = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "rooms": rooms
    }


@app.post("/rooms")
def create_room(room_number: str, block_name: str = "", floor_number: int = 0):

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO rooms
            (room_number, block_name, floor_number)
        VALUES
            (%s, %s, %s)
    """, (
        room_number,
        block_name,
        floor_number
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "status": "success",
        "message": "Room created successfully"
    }
    
    # ===============================
# CREATE STUDENT
# ===============================

@app.post("/students")
def create_student(
    user_id: str,
    password: str,
    student_id: str,
    name: str,
    email: str = "",
    phone: str = "",
    room_id: int | None = None
):

    connection = get_database_connection()
    cursor = connection.cursor()

    try:

        # Hash password before storing it
        password_hash = hash_password(password)

        # Create login account
        cursor.execute("""
            INSERT INTO users
                (user_id, password_hash, role)
            VALUES
                (%s, %s, %s)
        """, (
            user_id,
            password_hash,
            "student"
        ))

        user_database_id = cursor.lastrowid

        # If a room is selected, check 4-student limit
        if room_id is not None:

            cursor.execute("""
                SELECT COUNT(*) AS student_count
                FROM students
                WHERE room_id = %s
            """, (room_id,))

            result = cursor.fetchone()

            if result[0] >= 4:

                connection.rollback()

                raise HTTPException(
                    status_code=400,
                    detail="This room already has 4 students."
                )

        # Create student
        cursor.execute("""
            INSERT INTO students
                (
                    user_id,
                    student_id,
                    name,
                    email,
                    phone,
                    room_id
                )
            VALUES
                (%s, %s, %s, %s, %s, %s)
        """, (
            user_database_id,
            student_id,
            name,
            email,
            phone,
            room_id
        ))

        connection.commit()

        return {
            "status": "success",
            "message": "Student created successfully",
            "student_id": student_id
        }

    except mysql.connector.Error as error:

        connection.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    finally:

        cursor.close()
        connection.close()