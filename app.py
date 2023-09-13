from flask import Flask, render_template, jsonify, request, redirect, session, url_for
import sqlite3
from datetime import datetime, timedelta
from config import DEBUG
import random

app = Flask(__name__)
app.secret_key = "asdf"  # Needed to encrypt session data

# Configuration for serving static files
app.static_folder = "static"


# connects to db -> returns conn, cursor
def get_db_connection():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    conn.row_factory = sqlite3.Row
    return conn, cursor


# Returns a list of all the names from the DB as strings -> used for search functionality, passed in to index.html
def getListOfNamesFromDB():
    conn, cursor = get_db_connection()
    students = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    listOfNames = []
    for name in students:
        listOfNames.append(name["studentName"])

    return listOfNames


def getListOfTeacherNames():
    with open("names/allTeachers.txt", "r") as file:
        listOfTeacherNames = file.readlines()

    # Remove newline characters
    return [item.strip() for item in listOfTeacherNames]


# gets student data from DB
def getAllStudentData(student_id):
    conn, cursor = get_db_connection()

    # Query student_history with student names
    cursor.execute(
        """
        SELECT sh.id, sh.locationGoingTo, sh.timeLeft, s.studentName, sh.teacher
        FROM student_history sh
        INNER JOIN students s ON sh.student_id = s.id
        WHERE sh.student_id = ?
    """,
        (student_id,),
    )
    history_rows = cursor.fetchall()

    conn.close()

    listOfHistory = []

    if history_rows:
        for row in history_rows:
            history_id, location, time, student_name, teacher = row
            history_dict = {
                "history_id": history_id,
                "student_name": student_name,
                "location": location,
                "time": time,
                "teacher": teacher,
            }
            listOfHistory.append(history_dict)
    else:
        print("No history found for the student.")

    return listOfHistory


# gets teacher data from DB
def getAllTeacherData(teacher_name):
    conn, cursor = get_db_connection()

    # Query student_history with teacher name
    cursor.execute(
        """
        SELECT sh.id, sh.locationGoingTo, sh.timeLeft, s.studentName, sh.teacher
        FROM student_history sh
        INNER JOIN students s ON sh.student_id = s.id
        WHERE sh.teacher = ?
    """,
        (teacher_name,),
    )
    history_rows = cursor.fetchall()

    conn.close()

    listOfHistory = []

    if history_rows:
        for row in history_rows:
            history_id, location, time, student_name, teacher = row
            history_dict = {
                "history_id": history_id,
                "student_name": student_name,
                "location": location,
                "time": time,
                "teacher": teacher,
            }
            listOfHistory.append(history_dict)
    else:
        print(f"No history found for students taught by {teacher_name}.")

    return listOfHistory


# This recieves the name that the student clicks on from the JS studentSearchScript
@app.route("/send_name", methods=["POST"])
def send_name():
    data = request.json
    received_name = data.get("name")  # Name received from frontend

    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM students WHERE studentName = ?", (received_name,))
    student = cursor.fetchone()

    if student:  # If student exists in the DB
        # Commented out for development purposes
        '''
        # Check if it has been 5 minutes since the latest addition to the database
        cursor.execute(
            """
            SELECT MAX(timeLeft) FROM student_history
            WHERE student_id = ?""",
            (student[0],)
        )
        latest_timestamp = cursor.fetchone()[0]

        if latest_timestamp:
            latest_timestamp = datetime.strptime(latest_timestamp, "%Y-%m-%d %H:%M:%S.%f")
            current_time = datetime.now()
            if current_time - latest_timestamp > timedelta(minutes=5):
                # If it has been more than 5 minutes, store student data in session
                session["student"] = student
                return "success"
            else:
                print("not 5 minutes")
                return "It has not been 5 minutes since the latest addition."
        else:
            return "No history found for this student."
        '''

        ### REMOVE IN PROD
        # stores student data in session
        session["student"] = student
        return "success"

    else:
        print("student not found")
        return "Student not found."


# Receives the selected location from the student
@app.route("/add_location", methods=["POST"])
def add_location():
    conn, cursor = get_db_connection()

    data = request.json
    received_location = data.get("location")

    # Gets student and teacher from the session
    student = session.get("student")
    teacher = session.get("teacherName")

    if student:
        # current timestamp
        current_time = datetime.now()
        time_difference = timedelta(hours=4)
        current_time -= time_difference  # we have to set it 4 hours behind because current time is 4 hours ahead in python anywhere

        # Update the student's location, time they left, and what teacher in the database
        cursor.execute(
            "INSERT INTO student_history (student_id, locationGoingTo, timeLeft, teacher) VALUES (?, ?, ?, ?)",
            (student[0], received_location, current_time, teacher),
        )
        conn.commit()

        session.clear()
        return "Location added successfully."
    else:
        session.clear()
        return "Student not found."


# gets the selected student's name from the admin
@app.route("/get_student_admin", methods=["POST"])
def get_student_admin():
    data = request.json
    received_name = data.get("name")  # Name received from frontend

    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM students WHERE studentName = ?", (received_name,))
    student = cursor.fetchone()

    if student:  # If student exists in the DB
        # stores student data in session -> (<id>, "<Name>")
        session["studentAdmin"] = student
        return "success"
    else:
        conn.close()
        print("student not found")
        return "Student not found."


# sends student's data to admin
@app.route("/send_student_admin", methods=["GET"])
def send_student_admin():
    student = session["studentAdmin"]  # retreives student from the session
    session.clear()
    data = getAllStudentData(student[0])  # this is the student ID

    return jsonify(data)


# gets selected teacher's name from the admin
@app.route("/get_teacher_admin", methods=["POST"])
def get_teacher_admin():
    data = request.json
    received_teacher = data.get("name")  # Teacher's name received from frontend

    conn, cursor = get_db_connection()
    cursor.execute(
        "SELECT * FROM student_history WHERE teacher = ?", (received_teacher,)
    )
    teacher_data = cursor.fetchall()

    if teacher_data:  # If teacher exists in the student_history table
        session["teacherAdmin"] = received_teacher
        return "success"
    else:
        print("error: not found")
        return "Teacher not found."


# sends list of data to admin
@app.route("/send_teacher_admin")
def send_teacher_admin():
    teacher = session["teacherAdmin"]  # retreives teacher from the session
    # data = getAllStudentData(student[0]) # this is the student ID
    session.clear()
    data = getAllTeacherData(teacher)

    return jsonify(data)


# Select Location
@app.route("/location_page")
def location_page():
    return render_template("location.html")


# Thank you page
@app.route("/end_page")
def end_page():
    return render_template("endPage.html")


# Admin Page
@app.route("/admin")
def admin():
    listOfStudentNames = getListOfNamesFromDB()
    listOfTeacherNames = getListOfTeacherNames()

    return render_template(
        "admin.html",
        listOfStudentNames=listOfStudentNames,
        listOfTeacherNames=listOfTeacherNames,
    )


# index
@app.route("/")
def index():
    listOfNames = getListOfNamesFromDB()
    return render_template("index.html", listOfNames=listOfNames)


# index with teacher
@app.route("/teacher/<teacherName>")
def studentIndex(teacherName):
    session["teacherName"] = teacherName  # stores teacher from URL in a session

    listOfNames = getListOfNamesFromDB()
    return render_template("index.html", listOfNames=listOfNames)


def testFunction(student_id):
    conn, cursor = get_db_connection()

    # Query student_history with student names
    conn, cursor = get_db_connection()

    received_location = "bathrooom"
    teacher = "HBeck"
    current_time = datetime.now()

    for i in range(50):
        diff = timedelta(days=i)
        for j in range(random.randint(1, 4)):
            # Update the student's location, time they left, and what teacher in the database
            cursor.execute(
                "INSERT INTO student_history (student_id, locationGoingTo, timeLeft, teacher) VALUES (?, ?, ?, ?)",
                (1, received_location, current_time + diff, teacher),
            )
            conn.commit()


if __name__ == "__main__" and DEBUG:
    app.run()

# testing
