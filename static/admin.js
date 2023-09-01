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



                // makes an ajax request to send the variable to a flask route
                $.ajax({
                    type: "POST",
                    url: "/get_student_admin",
                    data: JSON.stringify({ name: selectedStudent }),
                    contentType: "application/json",
                    success: function (response) {
                        console.log("Variable sent successfully!");
                        // makes an ajax request to receive the data using the sent name 
                        $.ajax({
                            url: '/send_student_admin',
                            type: 'GET',
                            success: function (data) {
                                var studentData = data;
                                console.log(studentData);
                                // Do something with the data in your frontend
                                //$('#result').text(myJavaScriptVariable);

                                updateStudentProfile(studentData);
                            }
                        });
                    }
                });
            });



            function updateStudentProfile(studentDataList) {
                // Clear the existing student profile section
                $('.student-profile').empty();



                // Loop through the list of dictionaries and create HTML elements for each student
                studentDataList.forEach(function (studentData) {
                    var studentProfileHtml = '<div class="student-info">';
                    studentProfileHtml += '<h2>' + studentData.student_name + '</h2>';
                    studentProfileHtml += '<p>Teacher: ' + studentData.teacher + '</p>';
                    studentProfileHtml += '<p>Location: ' + studentData.location + '</p>';
                    studentProfileHtml += '<p>Time: ' + studentData.time + '</p>';
                    studentProfileHtml += '</div>';

                    // Append the student profile HTML to the .student-profile element
                    $('.student-profile').append(studentProfileHtml);
                });
            }



            studentList.appendChild(li);
        });
    });
});


