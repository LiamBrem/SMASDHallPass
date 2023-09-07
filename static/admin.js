//global
var exportedDataList;

document.addEventListener("DOMContentLoaded", () => {
    // initial mode student
    let mode = "student";

    // Get lists of student and teacher names from HTML fioe
    const studentNames = listOfStudentNames;
    const teacherNames = listOfTeacherNames;

    let allPeople;

    // Set the 'allPeople' variable based on the current mode
    if (mode === "student") {
        allPeople = studentNames;
    } else {
        allPeople = teacherNames;
    }

    // Get references to HTML elements
    const searchInput = document.getElementById("searchInput");
    const personList = document.getElementById("personList");
    const selectedPersonField = document.getElementById("selectedPerson");

    let selectedPerson = ""; // Initialize the variable

    // Listen for input events on the search input field
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        personList.innerHTML = ""; // clear existing personList

        const filteredPeople = allPeople.filter(person => person.toLowerCase().includes(searchTerm));

        filteredPeople.sort();

        // Iterate through the filtered people and create list items
        filteredPeople.forEach(person => {
            const li = document.createElement("li");
            li.textContent = person;
            li.classList.add("list-group-item")

            // event listener for each person
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

                                    updateProfile(studentData);
                                }
                            });
                        }
                    });
                } else if (mode === "teacher") {
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
                    let timePart = parts[1]; // Get the time part

                     // Split the timePart by the dot (.) to separate seconds and milliseconds
                    const timeComponents = timePart.split('.');
                    
                    if (timeComponents.length >= 1) {
                        // Get the hour, minute, and second components
                        const [hour, minute, second] = timeComponents[0].split(':');
                        
                        // Construct the formatted time string without milliseconds
                        timePart = `${hour}:${minute}:${second}`;
                    }

                    return { date: datePart, time: timePart };
                }

                // Return null or handle invalid input as needed
                return null;
            }



            function updateProfile(dataList) {
                // Reverse the dataList
                dataList = dataList.slice().reverse();

                var mainName;
                var cardName;

                if (mode === "student") {
                    //console.log(data)
                    mainName = dataList[0].student_name;
                    cardName = "teacher";
                    //makeGraph(dataList.slice().reverse());

                } else {
                    mainName = dataList[0].teacher;
                    cardName = "student_name";

                }

                //console.log(mainName)

                // Clear the existing student profile section
                $('.student-profile').empty();

                var displayName = '<div class="display-name"><h2>' + mainName + '</h2></div>';
                $('.student-profile').append(displayName);


                // Loop through the list of dictionaries, excluding the last one
                for (var i = 0; i < dataList.length - 1 && i<50 ; i++) {
                    var personData = dataList[i];
                    var profileHtml = '<div class="panel panel-default">';
                    profileHtml += '<div class="panel-heading">Name: ' + personData[cardName] + '</div>';
                    profileHtml += '<div class="panel-body">'
                    profileHtml += '<p>Location: ' + personData.location + '</p>';
                    profileHtml += '<p>Date: ' + formatDateTime(personData.time).date + '</p>';
                    profileHtml += '<p>Time: ' + formatDateTime(personData.time).time + '</p>';
                    profileHtml += '</div></div>';

                    // Append the student profile HTML to the .student-profile element
                    $('.student-profile').append(profileHtml);
                }
            }
            

            /*
            function makeGraph(data){
                // Convert time strings to Date objects
                data.forEach(entry => {
                    entry.time = new Date(entry.time);
                });
                
                // Group data by week and count leaves per week
                const leavesPerWeek = d3.rollup(
                    data,
                    group => group.length,
                    d => d3.timeWeek(d.time)
                );
                
                // Convert the Map to an array of objects
                const weeklyData = Array.from(leavesPerWeek, ([week, count]) => ({ week, count }));
                
                // Create SVG dimensions
                const width = 800;
                const height = 400;
                const margin = { top: 20, right: 30, bottom: 30, left: 40 };
                
                // Create the SVG element
                const svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
                
                // Define x and y scales
                const xScale = d3.scaleTime()
                    .domain(d3.extent(weeklyData, d => d.week))
                    .range([margin.left, width - margin.right]);
                
                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(weeklyData, d => d.count)])
                    .nice()
                    .range([height - margin.bottom, margin.top]);
                
                // Create x and y axes
                const xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(1));
                const yAxis = d3.axisLeft(yScale);
                
                // Append x axis
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(xAxis);
                
                // Append y axis
                svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(yAxis);
                
                // Create a line generator
                const line = d3.line()
                    .x(d => xScale(d.week))
                    .y(d => yScale(d.count));
                
                // Append the line chart
                svg.append("path")
                    .datum(weeklyData)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("d", line);
                
                // Add labels and title
                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", height - 10)
                    .attr("text-anchor", "middle")
                    .text("Week");
                
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -height / 2)
                    .attr("y", 10)
                    .attr("text-anchor", "middle")
                    .text("Number of Leaves");
                
                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", margin.top)
                    .attr("text-anchor", "middle")
                    .attr("font-weight", "bold")
                    .text("Student Leaves Per Week");
                
                    

                const container = d3.select("#graph-container");
                container.append(() => svg.node());
            }
            */



            personList.appendChild(li);
        });
    });

    const navigateButton = document.getElementById("switch-button");
    // Add a click event listener to the button
    navigateButton.addEventListener("click", () => {
        if (mode === "teacher") {
            mode = "student";
            allPeople = listOfStudentNames;
            navigateButton.textContent = "Search by Teacher Instead"
            searchInput.placeholder = "Type Student Name..."
        } else {
            mode = "teacher";
            allPeople = listOfTeacherNames;
            navigateButton.textContent = "Search by Student Instead"
            searchInput.placeholder = "Type Teacher Name..."
        }
    });
});


