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
                    url: "/send_name",
                    data: JSON.stringify({ name: selectedStudent }),
                    contentType: "application/json",
                    success: function(response) {
                        console.log("Variable sent successfully!");
                    }
                });

                window.location.href = '/location_page';

            });
            studentList.appendChild(li);
        });
    });
});


