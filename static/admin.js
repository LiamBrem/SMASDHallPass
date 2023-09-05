document.addEventListener("DOMContentLoaded", () => {
    let mode = "student";
    const studentNames = listOfStudentNames;
    const teacherNames = listOfTeacherNames

    let allPeople;

    if (mode === "student") {
        allPeople = studentNames;
    } else {
        allPeople = teacherNames;
    }


    const searchInput = document.getElementById("searchInput");
    const personList = document.getElementById("personList");
    const selectedPersonField = document.getElementById("selectedPerson");

    let selectedPerson = ""; // Initialize the variable

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        personList.innerHTML = "";

        const filteredPeople = allPeople.filter(person => person.toLowerCase().includes(searchTerm));

        filteredPeople.sort();

        filteredPeople.forEach(person => {
            const li = document.createElement("li");
            li.textContent = person;
            li.addEventListener("click", () => {
                selectedPerson = person; // Update the variable
                selectedPersonField.value = selectedPerson;
                console.log(selectedPerson)

                if (mode === "student") {
                    // makes an ajax request to send the variable to a flask route
                    $.ajax({
                        type: "POST",
                        url: "/get_student_admin",
                        data: JSON.stringify({ name: selectedPerson }),
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
                } else if (mode === "teacher"){
                    // makes an ajax request to send the variable to a flask route
                    $.ajax({
                        type: "POST",
                        url: "/get_teacher_admin",
                        data: JSON.stringify({ name: selectedPerson }),
                        contentType: "application/json",
                        success: function (response) {
                            console.log("Variable sent successfully!");
                            // makes an ajax request to receive the data using the sent name 
                            $.ajax({
                                url: '/send_teacher_admin',
                                type: 'GET',
                                success: function (data) {
                                    var teacherData = data;
                                    console.log(teacherData);
                                    // Do something with the data in your frontend
                                    //$('#result').text(myJavaScriptVariable);

                                    updateProfile(teacherData);
                                }
                            });
                        }
                    });
                }



            });

                


            function formatDateTime(dateTime) {
                // Split the dateTime string into date and time parts
                const parts = dateTime.split(' ');
            
                if (parts.length === 2) {
                    const datePart = parts[0]; // Get the date part
                    const timePart = parts[1]; // Get the time part
            
                    return { date: datePart, time: timePart };
                }
            
                // Return null or handle invalid input as needed
                return null;
            }


            function updateProfile(dataList) {

                if (mode === "student"){
                    console.log(datal)
                    mainName = dataList[0].student_name;
                    cardName = "teacher_name";
                    
                } else {
                    mainName = dataList[0].teacher;
                    cardName = "student_name";

                }


                // Clear the existing student profile section
                $('.student-profile').empty();

                var studentDisplayName = '<div class="display-name"><h2>' + mainName + '</h2></div>';
                $('.student-profile').append(studentDisplayName);

                // Reverse the dataList
                dataList = dataList.slice().reverse();

                // Loop through the list of dictionaries and create HTML elements for each student
                dataList.forEach(function (personData) {
                    var profileHtml = '<div class="student-info">';
                    profileHtml += '<p>Teacher: ' + personData.cardName + '</p>'; // this isn't working 
                    profileHtml += '<p>Location: ' + personData.location + '</p>';
                    profileHtml += '<p>Date: ' + formatDateTime(personData.time).date + '</p>';
                    profileHtml += '<p>Time: ' + formatDateTime(personData.time).time + '</p>';
                    profileHtml += '<br></br>'
                    profileHtml += '</div>';

                    // Append the student profile HTML to the .student-profile element
                    $('.student-profile').append(profileHtml);
                });
            }



            personList.appendChild(li);
        });
    });

    const navigateButton = document.getElementById("switch-button");
    // Add a click event listener to the button
    navigateButton.addEventListener("click", () => {
        if (mode==="teacher"){
            mode = "student";
            allPeople = listOfStudentNames;
        } else {
            mode = "teacher";
            allPeople = listOfTeacherNames;
        }
        console.log(mode)
    });
});


