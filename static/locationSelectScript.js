document.addEventListener('DOMContentLoaded', function() {
    // Get references to the location buttons
    const bathroomButton = document.getElementById('bathroom');
    const nurseButton = document.getElementById('nurse');
    const officeButton = document.getElementById('main');
    const teacherButton = document.getElementById('teacher')
    const otherButton = document.getElementById('other');

    // Add event listeners to the buttons
    bathroomButton.addEventListener('click', function() {
        sendLocation('bathroom');
    });

    nurseButton.addEventListener('click', function() {
        sendLocation('nurse');
    });

    officeButton.addEventListener('click', function() {
        sendLocation('main');
    });

    teacherButton.addEventListener('click', function() {
        sendLocation('teacher');
    });

    otherButton.addEventListener('click', function() {
        sendLocation('other');
    });

    // Function to send location to the backend
    function sendLocation(location) {
        $.ajax({
            type: "POST",
            url: "/add_location",
            data: JSON.stringify({ location: location }),
            contentType: "application/json",
            success: function(response) {
                console.log("Variable sent successfully!");
            }
        });
    }
});
