document.addEventListener("DOMContentLoaded", () => {
    const allTeachers = listOfTeacherNames;

    const searchInput = document.getElementById("searchInput");
    const teacherList = document.getElementById("teacherList");
    const selectedTeacherField = document.getElementById("selectedTeacher");

    let selectedTeacher = ""; // Initialize the variable

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        teacherList.innerHTML = "";

        const filteredTeachers = allTeachers.filter(teacher => teacher.toLowerCase().includes(searchTerm));

        filteredTeachers.sort();

        filteredTeachers.forEach(teacher => {
            const li = document.createElement("li");
            li.textContent = teacher;
            li.addEventListener("click", () => {
                selectedTeacher = teacher; // Update the variable
                selectedTeacherField.value = selectedTeacher;
                console.log(selectedTeacher)
            });
            teacherList.appendChild(li);
        });
    });

    const navigateButton = document.getElementById("switch-button");
    // Add a click event listener to the button
    navigateButton.addEventListener("click", () => {
        // Change the page's location to the desired URL
        console.log("click")
        window.location.href = '/admin';
    });
});


