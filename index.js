const scriptURL = 'https://script.google.com/macros/s/AKfycbyeTfiWRrYPKYxN95eF77HPIoBVuwy08dIgVoEcAJjKmB1k2VR1d7SVVQs5Cv1WATTeDw/exec';

const form = document.forms['Attendance-Form'];
const loaderContainer = document.createElement('div');
loaderContainer.className = 'loader-container';
const loader = document.createElement('div');
loader.className = 'loader';

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateForm()) {
        // Append loader container to body
        document.body.appendChild(loaderContainer);
        loaderContainer.appendChild(loader);

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                alert("Thank you! your form is submitted successfully.");
                // Remove loader container
                document.body.removeChild(loaderContainer);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error!', error.message);
                // Remove loader container
                document.body.removeChild(loaderContainer);
            });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the current date and time
    var submissionTime = new Date();
    var formattedSubmissionTime = formatDateForGoogleSheets(submissionTime);
    document.getElementById("Submission Time").value = formattedSubmissionTime;
});


function formatDateForGoogleSheets(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Month is zero-based, so we add 1
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // "0" should be "12"

    // Pad single-digit day, month, hours, minutes, and seconds with leading zeros
    day = padZero(day);
    month = padZero(month);
    hours = padZero(hours);
    minutes = padZero(minutes);
    seconds = padZero(seconds);

    return day + '/' + month + '/' + year + ', ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
}


function validateForm() {
    // Get the current date and time in Bangladesh time zone (UTC+6)
    var currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 6); // Adjust for UTC+6

    var selectedDate = new Date(document.getElementById('Attendance Date').value);
    var maxAllowedDate = new Date(currentDate);

    var currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });
    var userId = document.getElementById("ID").value;
    var password = document.getElementById("Password").value;

    // Create a mapping of user IDs to unique passwords
    var passwordMapping = {
        "STD-000000": "0",
        "STD-000001": "1",
        "STD-000002": "2",
        "STD-000003": "3",
        "STD-000004": "4",
        "STD-000005": "5",
        // Add more mappings as needed
    };

    // Check if the entered password matches the unique password for the selected user ID
    if (password !== passwordMapping[userId]) {
        alert("Invalid password. Please enter your unique password.");
        return false;
    }

    // Calculate the start and end times for attendance submission
    var startTime;
    var endTime;

    if (selectedDate.toDateString() === currentDate.toDateString()) {
        // If attendance date is the same as the current date
        startTime = "07:00"; // 7:00 AM
        endTime = "10:05";   // 10:05 AM
    } else {
        // Attendance date is not within the allowed range
        alert("You can only submit the selected date attendance between 7:00 AM to 10:00 AM on the same day.");
        return false;
    }

    // Check if the current time is within the allowed range
    if (
        (selectedDate.toDateString() === currentDate.toDateString() && currentTime >= startTime && currentTime <= endTime)
    ) {
        // Check the selected radio button
        var clientOfficeRadio = document.getElementById("ClientOffice");
        var homeOfficeRadio = document.getElementById("HomeOffice");
        var naRadio = document.getElementById("NA");

        if (clientOfficeRadio.checked) {
            // Check if the required fields for Client Office are filled in
            var clientOfficeName = document.getElementById("ClientOfficeName").value;
            var clientOfficeAddress = document.getElementById("ClientOfficeAddress").value;

            if (clientOfficeName === "" || clientOfficeAddress === "") {
                // Handle required fields validation
            }
        } else if (homeOfficeRadio.checked) {
            // Check if the required field for Home Office is filled in
            var homeOfficeName = document.getElementById("HomeOfficeName").value;

            if (homeOfficeName === "") {
                // Handle required field validation
            }
        }

        return true; // Attendance submission is allowed
    } else {
        alert("You can only submit the attendance between 7:00 AM to 10:00 AM on the selected day.");
        return false; // Attendance submission is not allowed
    }
}


// Get references to the radio buttons and text fields
const clientOfficeRadio = document.getElementById("ClientOffice");
const homeOfficeRadio = document.getElementById("HomeOffice");
const naRadio = document.getElementById("NA");
const clientOfficeText = document.getElementById("clientOfficeText");
const homeOfficeText = document.getElementById("homeOfficeText");

// Additional text fields for the client office
const clientOfficeName = document.getElementById("ClientOfficeName");
const clientOfficeAddress = document.getElementById("ClientOfficeAddress");
const homeOfficeName = document.getElementById("HomeOfficeName");

// Add event listener to handle radio button changes
function handleRadioChange() {
    if (clientOfficeRadio.checked) {
        clientOfficeText.style.display = "block";
        homeOfficeText.style.display = "none";

        // Make client office fields required
        clientOfficeName.required = true;
        clientOfficeAddress.required = true;
        homeOfficeName.required = false; // Not required
    } else if (homeOfficeRadio.checked) {
        clientOfficeText.style.display = "none";
        homeOfficeText.style.display = "block";

        // Make home office field required
        clientOfficeName.required = false; // Not required
        clientOfficeAddress.required = false; // Not required
        homeOfficeName.required = true;
    } else if (naRadio.checked) {
        clientOfficeText.style.display = "none";
        homeOfficeText.style.display = "none";

        // No fields are required
        clientOfficeName.required = false;
        clientOfficeAddress.required = false;
        homeOfficeName.required = false;
    }
}

// Add event listener to the radio buttons to handle changes
clientOfficeRadio.addEventListener("change", handleRadioChange);
homeOfficeRadio.addEventListener("change", handleRadioChange);
naRadio.addEventListener("change", handleRadioChange);

// Initial setup based on the default checked radio button
handleRadioChange(); 

// Get references to the textarea and scroll button
const textarea = document.querySelector('.textarea textarea');
const scrollButton = document.getElementById('scrollButton');

// Add an event listener to the textarea to check when its content changes
textarea.addEventListener('input', () => {
    // Check if the content exceeds the set height (e.g., 100px)
    if (textarea.scrollHeight > 100) {
        scrollButton.classList.remove('hidden'); // Show the scroll button
    } else {
        scrollButton.classList.add('hidden'); // Hide the scroll button
    }
});

// Add an event listener to the scroll button to scroll to the bottom of the textarea
scrollButton.addEventListener('click', () => {
    textarea.style.height = textarea.scrollHeight + 'px'; // Expand the textarea to show all content
    scrollButton.classList.add('hidden'); // Hide the scroll button
});
