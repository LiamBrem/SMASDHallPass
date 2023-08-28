import sqlite3

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO students VALUES ('Liam')")

cur.execute("INSERT INTO students VALUES ('Dawson')")

connection.commit()
connection.close()