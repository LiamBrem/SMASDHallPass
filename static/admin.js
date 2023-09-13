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

                removeGraph();

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
                                    //console.log(studentData);
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
                                    //console.log(teacherData);
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
                // Check if dateTime is a Date object
                if (dateTime instanceof Date) {
                    // Extract date and time components
                    const datePart = dateTime.toDateString(); // Get the date part
                    const timePart = dateTime.toLocaleTimeString(); // Get the time part
                    return { date: datePart, time: timePart };
                }

                // Check if dateTime is a string
                if (typeof dateTime === 'string') {
                    // Convert the string to a Date object
                    const dateObject = new Date(dateTime);

                    // Check if the conversion was successful
                    if (!isNaN(dateObject.getTime())) {
                        // Extract date and time components
                        const datePart = dateObject.toDateString(); // Get the date part
                        const timePart = dateObject.toLocaleTimeString(); // Get the time part
                        return { date: datePart, time: timePart };
                    } else {
                        console.error('Invalid date/time string format.');
                        return null;
                    }
                }
                console.error('Input is not a valid Date object or string.');
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
                    makeGraph(dataList.slice().reverse());
                    makeGraph2(dataList.slice().reverse());

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
                for (var i = 0; i < dataList.length - 1 && i < 50; i++) {
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

            function getTotalUniqueDays(data) {
                var uniqueDates = {}; // Object to store unique dates as keys

                // Iterate through the data and record unique dates
                data.forEach(function (d) {
                    // Format the date as YYYY-MM-DD to make it unique
                    var dateKey = d.time.toISOString().split('T')[0];
                    uniqueDates[dateKey] = true; // Store unique dates as keys
                });

                // Calculate the count of unique dates
                var count = Object.keys(uniqueDates).length;

                return count;
            }

            function everyNthDate(totalDays) {
                return Math.floor(totalDays / 10);

            }



            function makeGraph(data) {
                var margin = { top: 20, right: 20, bottom: 60, left: 25 };
                var width = 600 - margin.left - margin.right;
                var height = 300 - margin.top - margin.bottom;

                // Parse the time strings into Date objects
                data.forEach(function (d) {
                    d.time = new Date(d.time); // Convert time strings to Date objects
                });

                // Group data by date and count the number of times the student left each day
                var dataByDate = d3.nest()
                    .key(function (d) {
                        return d3.timeDay(d.time); // Group by date
                    })
                    .rollup(function (leaves) {
                        return leaves.length; // Count the number of leaves
                    })
                    .entries(data);

                // Sort data by date
                dataByDate.sort(function (a, b) {
                    return d3.ascending(new Date(a.key), new Date(b.key));
                });

                // Create an SVG element inside the 'graph-container' div
                var svg = d3.select("#graph-container")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right) // Include margin in width
                    .attr("height", height + margin.top + margin.bottom); // Include margin in height

                // Create a group for the main chart
                var chart = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Define scales and axes
                var xScale = d3.scaleBand()
                    .domain(dataByDate.map(function (d) { return new Date(d.key); })) // Use all dates as domain
                    .range([0, width]) // Adjusted for margin
                    .padding(0.1); // Adjust the padding between bars as needed

                var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataByDate, function (d) { return d.value; })])
                    .range([height, 0]); // Adjusted for margin



                var n;
                var totalDays = getTotalUniqueDays(data);
                if (totalDays > 10) {
                    n = everyNthDate(totalDays); // shows every nth day - adjust as needed
                } else {
                    n = 1;
                }

                var xAxis = d3.axisBottom(xScale)
                    .tickFormat(function (d, i) {
                        if (i % n === 0) {
                            var formatDate = d3.timeFormat("%a %b %d");
                            return formatDate(d);
                        } else {
                            return ""; // Hide labels for other days
                        }
                    })
                    .tickPadding(10) // Add padding as needed
                    .tickSize(5); // Add a tick size for better visibility


                var yAxis = d3.axisLeft(yScale);

                // Create bars
                chart.selectAll(".bar")
                    .data(dataByDate)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d) { return xScale(new Date(d.key)); })
                    .attr("y", function (d) { return yScale(d.value); })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) { return height - yScale(d.value); })
                    .attr("fill", "#54B4D3");

                // Add x and y axes
                chart.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "end");

                chart.append("g")
                    .attr("class", "y-axis")
                    .call(yAxis);
            }

            function makeGraph2(data){
                // Create an object to store the count of each location
                var locationCounts = {
                    bathroom: 0,
                    nurse: 0,
                    main: 0,
                    teacher: 0,
                    other: 0
                };

                // Count the number of times a student has been to each location
                data.forEach(function (d) {
                    var location = d.location.toLowerCase(); // Convert to lowercase for consistency
                    console.log(location);
                    if (location in locationCounts) {
                        locationCounts[location]++;
                    }
                });

                // Convert locationCounts object to an array of objects
                var locationData = Object.keys(locationCounts).map(function (location) {
                    return {
                        location: location,
                        count: locationCounts[location]
                    };
                });

                // Set up the dimensions and margins
                var margin = { top: 20, right: 20, bottom: 60, left: 40 };
                var width = 600 - margin.left - margin.right;
                var height = 300 - margin.top - margin.bottom;

                // Create an SVG element inside the 'graph-container2' div
                var svg = d3.select("#graph-container2")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                // Create a group for the main chart
                var chart = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Define scales and axes
                var xScale = d3.scaleBand()
                    .domain(locationData.map(function (d) { return d.location; }))
                    .range([0, width])
                    .padding(0.1);

                var yScale = d3.scaleLinear()
                    .domain([0, d3.max(locationData, function (d) { return d.count; })])
                    .range([height, 0]);

                var xAxis = d3.axisBottom(xScale);
                var yAxis = d3.axisLeft(yScale);

                // Create bars
                chart.selectAll(".bar")
                    .data(locationData)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d) { return xScale(d.location); })
                    .attr("y", function (d) { return yScale(d.count); })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) { return height - yScale(d.count); })
                    .attr("fill", "#54B4D3");

                // Add x and y axes
                chart.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                chart.append("g")
                    .attr("class", "y-axis")
                    .call(yAxis);

            }




            function removeGraph() {
                d3.select("#graph-container").selectAll("*").remove();
                d3.select("#graph2-container").selectAll("*").remove();
            }




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


