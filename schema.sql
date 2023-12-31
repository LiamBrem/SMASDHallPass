DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS student_history;

-- Define the students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    studentName TEXT NOT NULL
);

-- Define the student_history table
CREATE TABLE student_history (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    locationGoingTo TEXT NOT NULL,
    timeLeft DATETIME NOT NULL,
    teacher TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);