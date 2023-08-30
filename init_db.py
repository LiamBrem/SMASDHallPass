import sqlite3
from datetime import datetime


connection = sqlite3.connect("database.db")


with open("schema.sql") as f:
    connection.executescript(f.read())

cur = connection.cursor()

# Read student names from the file
with open("allStudents.txt", "r") as file:
    listOfNames = file.readlines()

# Remove newline characters and insert each name into the students table
for name in listOfNames:
    student_name = name.strip()  # Remove newline characters

    # Insert the student name into the students table
    cur.execute("INSERT INTO students (studentName) VALUES (?)", (student_name,))
    student_id = cur.lastrowid  # Get the ID of the inserted student

    # Insert initial history data for the student
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cur.execute("INSERT INTO student_history (student_id, locationGoingTo, timeLeft, teacher) VALUES (?, ?, ?, ?)", (student_id, 'init', current_time, 'init'))



connection.commit()
connection.close()
