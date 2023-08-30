from flask import Flask, render_template, jsonify, request, redirect, session, url_for
import sqlite3
from datetime import datetime

app = Flask(__name__)
app.secret_key = "asdf"  # Used to encrypt session data


# connects to db -> returns conn, cursor
def get_db_connection():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    conn.row_factory = sqlite3.Row
    return conn, cursor


# Returns a list of all the names from the DB as strings - used for search functionality
def getListOfNamesFromDB():
    conn, cursor = get_db_connection()
    students = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    listOfNames = []
    for name in students:
        listOfNames.append(name["studentName"])

    return listOfNames


# This recieves the name that the student clicks on from the JS studentSearchScript
@app.route("/send_name", methods=["POST"])
def send_name():
    data = request.json
    received_name = data.get("name")

    conn, cursor = get_db_connection()
    cursor.execute("SELECT * FROM students WHERE studentName = ?", (received_name,))
    student = cursor.fetchone()

    if student:
        # stores student data in session
        session["student"] = student
        return "success"
    else:
        print("student not found")
        return "Student not found."


@app.route("/add_location", methods=["POST"])
def add_location():
    conn, cursor = get_db_connection()

    data = request.json
    received_location = data.get("location")

    print(received_location)

    student = session.get("student")

    if student:
        # current timestamp
        current_time = datetime.now()

        # Update the student's location in the database
        cursor.execute(
            "INSERT INTO student_history (student_id, locationGoingTo, timeLeft, teacher) VALUES (?, ?, ?, ?)",
            (student[0], received_location, current_time, "Brem"),
        )
        conn.commit()

        session.clear()
        return "Location added successfully."
    else:
        session.clear()
        return "Student not found."


@app.route("/location_page")
def location_page():
    return render_template("location.html")


@app.route("/end_page")
def end_page():
    return render_template("endPage.html")


# index
@app.route("/")
def index():
    listOfNames = getListOfNamesFromDB()
    return render_template("index.html", listOfNames=listOfNames)

@app.route("/teacher/<teacherName>")
def studentIndex(teacherName):
    return str(teacherName)


def testFunction(student_id):
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

    if history_rows:
        print(f"Student History for Student ID {student_id}:")
        for row in history_rows:
            history_id, location, time, student_name, teacher = row
            print(
                f"History ID: {history_id}, Student Name: {student_name}, Location: {location}, Time: {time}, Teacher: {teacher}"
            )
    else:
        print("No history found for the student.")


if __name__ == "__main__":
    app.run()
