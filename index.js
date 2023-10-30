
































































































































































































































































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


function filterIDs() {
    var input, filter, ul, option, i;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById('ID');
    option = ul.getElementsByTagName('option');

    for (i = 0; i < option.length; i++) {
        var id = option[i].value.toUpperCase();
        if (id.indexOf(filter) > -1) {
            option[i].style.display = '';
        } else {
            option[i].style.display = 'none';
        }
    }
}


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
function padZero(num) {
    return (num < 10 ? '0' : '') + num;
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
        "PTN-000008": "sir",
        "EMP-000059": "44876",
        "EMP-000137": "56258",
        "EMP-000292": "22072",
        "EMP-000645": "92312",
        "EMP-000666": "97718",
        "EMP-000670": "94676",
        "EMP-000705": "38730",
        "EMP-000741": "56346",
        "EMP-000747": "76049",
        "EMP-000766": "67549",
        "STD-001229": "14093",
        "STD-001259": "30605",
        "STD-001321": "26271",
        "STD-001331": "31810",
        "STD-001360": "99971",
        "STD-001472": "58388",
        "STD-001475": "41899",
        "STD-001492": "48828",
        "STD-001539": "58757",
        "STD-001567": "71689",
        "STD-001636": "32349",
        "STD-001637": "72502",
        "STD-001641": "49502",
        "STD-001642": "58554",
        "STD-001659": "36603",
        "STD-001808": "92610",
        "STD-001846": "67164",
        "STD-001856": "13207",
        "STD-001864": "82547",
        "STD-001876": "67724",
        "STD-001969": "36386",
        "STD-001982": "86390",
        "STD-001983": "25840",

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
        endTime = "11:00";   // 10:05 AM
    } else {
        // Attendance date is not within the allowed range
        alert("You can only submit the selected date attendance between 7:00 AM to 11:00 AM on the same day.");
        return false;
    }


    var attendanceStatus = document.querySelector('input[name="Attendance Status"]:checked').value;
    var presentOn = document.querySelector('input[name="Present On"]:checked').value;

        if (attendanceStatus === 'Present' && presentOn !== 'Client Office' && presentOn !== 'Home Office') {
            alert("You can only select 'Client Office' or 'Home Office' when 'Present' is chosen.");
            return false;
        }

        if ((attendanceStatus === 'Sick Leave' || attendanceStatus === 'Casual Leave' || attendanceStatus === 'Study Leave') && presentOn !== 'N/A') {
            alert("You can only select 'N/A' when 'Sick Leave,' 'Casual Leave,' or 'Period of Study Leave' is chosen.");
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
        alert("You can only submit the attendance between 7:00 AM to 11:00 AM on the selected day.");
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


function handleRadioChange() {
    // Clear the content of both text fields when radio buttons are changed
    clientOfficeName.value = "";
    clientOfficeAddress.value = "";
    homeOfficeName.value = "";

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



// Add event listener to the radio buttons to manage the "N/A" radio button and clear/hide text fields
document.querySelectorAll('input[name="Attendance Status"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        var naRadio = document.getElementById('NA');
        var clientOfficeText = document.getElementById('clientOfficeText');
        var homeOfficeText = document.getElementById('homeOfficeText');

        // Clear and hide the text fields
        document.getElementById("ClientOfficeName").value = "";
        document.getElementById("ClientOfficeAddress").value = "";
        document.getElementById("HomeOfficeName").value = "";
        clientOfficeText.style.display = "none";
        homeOfficeText.style.display = "none";

        if (this.value === 'Present') {
            naRadio.checked = false; // Uncheck "N/A"
            naRadio.disabled = true; // Disable "N/A"
            document.getElementById('ClientOffice').disabled = false;
            document.getElementById('HomeOffice').disabled = false;
        } else {
            naRadio.checked = true; // Check "N/A"
            naRadio.disabled = false; // Enable "N/A"
            document.getElementById('ClientOffice').disabled = true;
            document.getElementById('HomeOffice').disabled = true;
        }
    });
});


// Add event listener to the radio buttons to manage the "Client Office" and "Home Office" text fields
document.querySelectorAll('input[name="Present On"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        var clientOfficeText = document.getElementById('clientOfficeText');
        var homeOfficeText = document.getElementById('homeOfficeText');

        // Clear and hide the text fields
        document.getElementById("ClientOfficeName").value = "";
        document.getElementById("ClientOfficeAddress").value = "";
        document.getElementById("HomeOfficeName").value = "";
        clientOfficeText.style.display = "none";
        homeOfficeText.style.display = "none";

        if (this.value === 'Client Office') {
            clientOfficeText.style.display = "block";
        } else if (this.value === 'Home Office') {
            homeOfficeText.style.display = "block";
        }
    });
});


// Automatically select "N/A" when "Sick Leave," "Casual Leave," or "Period of Study Leave" is chosen
document.querySelectorAll('input[name="Attendance Status"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        var naRadio = document.getElementById('NA');
        if (this.value === 'Sick Leave' || this.value === 'Casual Leave' || this.value === 'Study Leave') {
            naRadio.checked = true; // Check "N/A"
            naRadio.disabled = false; // Enable "N/A"
        }
    });
});
