import sqlite3


connection = sqlite3.connect("database.db")


with open("schema.sql") as f:
    connection.executescript(f.read())

cur = connection.cursor()

File_object = open(r"allStudents.txt", "r")  # r stands for read only

listOfNames = File_object.readlines()

# Loop through the strings and remove the last two characters & inserts each name from text file into db
for i in range(len(listOfNames)):
    listOfNames[i] = listOfNames[i][:-1]
    cur.execute("INSERT INTO students VALUES ('" + listOfNames[i] + "')")
File_object.close()


connection.commit()
connection.close()
