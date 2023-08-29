from flask import Flask, render_template, jsonify, request, redirect, session, url_for
import sqlite3

app = Flask(__name__)
app.secret_key = 'asdf'  # Used to encrypt session data



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
        #stores student data in session
        session['student'] = student
        return "success"
    else:
        print("student not found")
        return "Student not found."



@app.route("/add_location", methods=['POST'])
def add_location():
    conn, cursor = get_db_connection()

    data = request.json
    received_location = data.get("location")

    print(received_location)

    student = session.get('student')

    if student:
        # Update the student's location in the database
        cursor.execute("UPDATE students SET locationGoingTo = ? WHERE id = ?", (received_location, student[0]))
        conn.commit()
        return "Location added successfully."
    else:
        return "Student not found."


@app.route("/location_page")
def location_page():
    return render_template('location.html')


# index
@app.route("/")
def index():
    listOfNames = getListOfNamesFromDB()
    return render_template("index.html", listOfNames=listOfNames)


if __name__ == "__main__":
    app.run()
