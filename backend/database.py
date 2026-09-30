import mysql.connector


def get_database_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="santoshoelp",
        database="ai_smart_hostel"
    )

    return connection