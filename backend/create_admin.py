from backend.database import get_database_connection
from backend.auth import hash_password


def create_admin():

    user_id = "admin"
    password = "Admin@123"

    password_hash = hash_password(password)

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO users (user_id, password_hash, role)
        VALUES (%s, %s, %s)
    """, (user_id, password_hash, "admin"))

    connection.commit()

    cursor.close()
    connection.close()

    print("Admin account created successfully!")


if __name__ == "__main__":
    create_admin()