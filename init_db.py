import sqlite3


connection = sqlite3.connect("database.db")


with open("schema.sql") as f:
    connection.executescript(f.read())

cur = connection.cursor()

File_object = open(r"allStudents.txt", "r")  # r stands for read only

listOfNames = File_object.readlines()

# Loop through the strings and remove the newline character & inserts each name from text file into db
for i in range(len(listOfNames)):
    listOfNames[i] = listOfNames[i][:-1]

    #The first location and time for students is "init" and "2023-01-01 00:00:00"
    cur.execute("INSERT INTO students (studentName, locationGoingTo, timeLeft) VALUES ('" + listOfNames[i] + "', 'init', '2023-08-08 00:00:00')")
File_object.close()


connection.commit()
connection.close()
