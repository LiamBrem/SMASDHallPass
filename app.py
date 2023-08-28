from flask import Flask, render_template, jsonify
import sqlite3

app = Flask(__name__)

@app.route("/")
def index():
    listOfNames = ["Liam", "Dawson", "Luke", "James"]

    return render_template("index.html", listOfNames=listOfNames)


if __name__ == "__main__":
    app.run()
