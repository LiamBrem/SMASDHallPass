DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    studentName TEXT NOT NULL,
    locationGoingTo TEXT NOT NULL, 
    timeLeft DATETIME NOT NULL
);