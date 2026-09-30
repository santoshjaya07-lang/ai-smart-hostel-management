from backend.database import get_database_connection


def create_tables():
    connection = get_database_connection()
    cursor = connection.cursor()

    # -----------------------------
    # USERS TABLE
    # -----------------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('student', 'admin') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # -----------------------------
    # ROOMS TABLE
    # -----------------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_number VARCHAR(20) NOT NULL UNIQUE,
            block_name VARCHAR(100),
            floor_number INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # -----------------------------
    # STUDENTS TABLE
    # -----------------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            student_id VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(150),
            phone VARCHAR(20),
            room_id INT,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            FOREIGN KEY (room_id)
                REFERENCES rooms(id)
                ON DELETE SET NULL
        )
    """)

    connection.commit()

    cursor.close()
    connection.close()

    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()