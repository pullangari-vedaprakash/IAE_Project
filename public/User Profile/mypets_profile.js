function selectButton(button, inputId, value) {
    document.getElementById(inputId).value = value;
    let buttons = button.parentElement.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

function addPet() {
    document.querySelector(".container").classList.remove("hidden");
    document.querySelector(".pets_container").classList.add("hidden");
}

function cancel() {
    document.querySelector(".container").classList.add("hidden");
    document.querySelector(".pets_container").classList.remove("hidden");
}

document.getElementById("petForm").addEventListener("submit", function(event) {
    let requiredHiddenInputs = [
        "pet_type", "pet_gender", "pet_size", "pet_aggression", 
        "pet_vaccinated", "pet_neutered", "pet_sociable", "pet_potty_trained"
    ];
        
    let missingFields = [];
        
    // Check if required hidden inputs are filled
    for (let i = 0; i < requiredHiddenInputs.length; i++) {
        let input = document.getElementById(requiredHiddenInputs[i]);
        if (!input.value) {
            missingFields.push(input.name.replace("_", " "));
        }
    }

    let petImageInput = document.querySelector("input[name='pet_image']");
    if (!petImageInput.files || petImageInput.files.length === 0) {
        missingFields.push("pet image");
    }

    let uploadedImages = Array.from(document.querySelectorAll(".add_photo.uploaded"));
    if (uploadedImages.length === 0) {
        missingFields.push("at least one photo");
    }


    if (missingFields.length > 0) {
        alert("Please select values for: " + missingFields.join(", "));
        event.preventDefault(); // Prevent form submission
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const uploadSlots = document.querySelectorAll(".add_photo");

    uploadSlots.forEach((slot, index) => {
        const hiddenInput = slot.querySelector('.file_upload_input');
        const removeBtn = slot.querySelector(".remove_photo_btn");
        const cameraIcon = slot.querySelector(".add_camera");

        slot.addEventListener('click', () => {
            if (!slot.classList.contains("uploaded")) {
                hiddenInput.click();
            }
        });

        hiddenInput.addEventListener('change', () => {
            const image = hiddenInput.files[0];
            if (image) {
                const reader = new FileReader();
                reader.onload = () => {
                    slot.classList.add("uploaded");
                    cameraIcon.style.display = "none";
                    removeBtn.style.display = "block";

                    const img = document.createElement('img');
                    img.classList.add('preview');
                    img.src = reader.result;
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";

                    const existingPreview = slot.querySelector('.preview');
                    if (existingPreview) slot.removeChild(existingPreview);
                    slot.appendChild(img);

                    hiddenInput.value = "";
                    reorderSlots(); // Ensure correct order
                };
                reader.readAsDataURL(image);
            }
        });

        removeBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            slot.classList.remove("uploaded");
            cameraIcon.style.display = "block";
            removeBtn.style.display = "none";

            const previewImg = slot.querySelector(".preview");
            if (previewImg) slot.removeChild(previewImg);

            hiddenInput.value = ""; 

            reorderSlots(); // Reorganize images
        });
    });

    function reorderSlots() {
        let images = [];
        uploadSlots.forEach(slot => {
            let img = slot.querySelector(".preview");
            if (img) images.push(img.src);
        });

        uploadSlots.forEach(slot => {
            slot.classList.remove("uploaded");
            slot.querySelector(".add_camera").style.display = "block";
            slot.querySelector(".remove_photo_btn").style.display = "none";

            const previewImg = slot.querySelector(".preview");
            if (previewImg) slot.removeChild(previewImg);
        });

        images.forEach((src, index) => {
            const slot = uploadSlots[index];
            slot.classList.add("uploaded");
            slot.querySelector(".add_camera").style.display = "none";
            slot.querySelector(".remove_photo_btn").style.display = "block";

            const img = document.createElement('img');
            img.classList.add('preview');
            img.src = src;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            slot.appendChild(img);
        });
    }
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerText = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    
    document.getElementById("location").innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;

    
    document.getElementById("latitude").value = latitude;
    document.getElementById("longitude").value = longitude;
}

function showError(error) {
    let errorMsg = "";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMsg = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMsg = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMsg = "An unknown error occurred.";
            break;
    }
    document.getElementById("location").innerText = errorMsg;
}

function setLocation() {
    if (!document.getElementById("latitude").value || !document.getElementById("longitude").value) {
        alert("Please get your location before submitting!");
        event.preventDefault(); // Prevent form submission if location is not set
    }
}


window.onload = function () {
    populateStates();
};






const stateCityData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangalore"],
    // Add more states as needed
};

document.getElementById('state').addEventListener('change', function () {
    const selectedState = this.value;
    populateCities(selectedState);
});

// Function to populate the state dropdown
function populateStates() {
    const stateSelect = document.getElementById('state');
    stateSelect.innerHTML = '<option value="" disabled selected>Select a state...</option>';
    Object.keys(stateCityData).forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Function to populate the city dropdown based on selected state
function populateCities(selectedState) {
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = '<option value="" disabled selected>Select a city...</option>';
    
    if (selectedState && stateCityData[selectedState]) {
        stateCityData[selectedState].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}





document.getElementById('menuIcon').addEventListener('click', function() {
    document.getElementById('sideNavbar').classList.toggle('open');
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('sideNavbar').classList.remove('open');
});

document.getElementById('sidebar_btn').addEventListener('click', function() {
    document.querySelector('.mobile_sidebar').classList.toggle('open');
});

document.querySelector('#mobile_sidebar_close-btn').addEventListener('click', function() {
    document.querySelector('.mobile_sidebar').classList.remove('open');
});