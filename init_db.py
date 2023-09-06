import sqlite3
from datetime import datetime


connection = sqlite3.connect("database.db")


with open("schema.sql") as f:
    connection.executescript(f.read())

cur = connection.cursor()

# Read student names and teachers from their respective files
with open("names/allStudents.txt", "r") as student_file:
    student_names = student_file.readlines()
student_names = [name.strip() for name in student_names]

with open("names/allTeachers.txt", "r") as teacher_file:
    teacher_names = teacher_file.readlines()
teacher_names = [name.strip() for name in teacher_names]

# Initialize student and teacher indices to 0
student_index = 0
teacher_index = 0

# Insert students and assign teachers one-to-one until teachers run out
while student_index < len(student_names):
    # Insert the student name into the students table
    cur.execute("INSERT INTO students (studentName) VALUES (?)", (student_names[student_index],))
    student_id = cur.lastrowid  # Get the ID of the inserted student

    # Get the current teacher or "init" if teachers have run out
    if teacher_index < len(teacher_names):
        current_teacher = teacher_names[teacher_index]
    else:
        current_teacher = "init"

    # Insert initial history data for the student
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cur.execute("INSERT INTO student_history (student_id, locationGoingTo, timeLeft, teacher) VALUES (?, ?, ?, ?)", (student_id, 'init', current_time, current_teacher))

    # Increment indices
    student_index += 1
    if current_teacher != "init":
        teacher_index += 1

connection.commit()
connection.close()
