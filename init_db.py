import sqlite3

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO students VALUES ('Liam Brem')")

cur.execute("INSERT INTO students VALUES ('Dawson Krug')")

connection.commit()
connection.close()