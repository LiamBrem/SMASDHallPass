from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)


# connects to db
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


# Returns a list of all the names from the DB as strings - used for search functionality
def getListOfNamesFromDB():
    conn = get_db_connection()
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

    print("NAME: " + received_name)

    # Process the name as needed

    return jsonify({"message": "Name received successfully"})


@app.route("location_page")
def location_page():
    return render_template('location.html')


# index
@app.route("/")
def index():
    listOfNames = getListOfNamesFromDB()
    return render_template("index.html", listOfNames=listOfNames)


if __name__ == "__main__":
    listOfNames = getListOfNamesFromDB()
    print(listOfNames)
    app.run()
