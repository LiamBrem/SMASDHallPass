document.addEventListener("DOMContentLoaded", () => {
    const allStudents = listOfNames;

    const searchInput = document.getElementById("searchInput");
    const studentList = document.getElementById("studentList");
    const selectedStudentField = document.getElementById("selectedStudent");

    let selectedStudent = ""; // Initialize the variable


    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        studentList.innerHTML = "";

        const filteredStudents = allStudents.filter(student => student.toLowerCase().includes(searchTerm));

        filteredStudents.sort();

        filteredStudents.forEach(student => {
            const li = document.createElement("li");
            li.textContent = student;
            li.addEventListener("click", () => {
                selectedStudent = student; // Update the variable
                selectedStudentField.value = selectedStudent;
                console.log(selectedStudent)


                /*
                // makes an ajax request to send the variable to a flask route
                $.ajax({
                    type: "POST",
                    url: "/send_name",
                    data: JSON.stringify({ name: selectedStudent }),
                    contentType: "application/json",
                    success: function(response) {
                        console.log("Variable sent successfully!");
                    }
                });
                */


                var studentData = { "name": "liam", "age": 18, "activityHistory": "bathroom" } // Call a function to retrieve student data
                updateStudentProfile(studentData);



            });

            function updateStudentProfile(studentData) {
                // Update the student profile section with the retrieved data
                $('.student-profile').html('<h2>' + studentData.name + '</h2><p>Age: ' + studentData.age + '</p><p>Activity History: ' + studentData.activityHistory + '</p>');
            }



            studentList.appendChild(li);
        });
    });
});


