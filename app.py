from flask import Flask, render_template, jsonify
import sqlite3

app = Flask(__name__)


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def getListOfNamesFromDB():
    conn = get_db_connection()
    names = conn.execute('SELECT * FROM students').fetchall()
    conn.close()
    #print(names[1]["student"])
    listOfNames = []
    for name in names:
        listOfNames.append(name["student"])

    return listOfNames

@app.route("/")
def index():
    listOfNames = getListOfNamesFromDB()
    print(listOfNames)

    return render_template("index.html", listOfNames=listOfNames)


if __name__ == "__main__":
    listOfNames = getListOfNamesFromDB()
    print(listOfNames)
    app.run()
