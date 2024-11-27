// const url = "http://localhost:3000/api/v1";
const url = "https://guhuza.onrender.com/api/v1";
const token = localStorage.getItem("token");

// Preview uploaded profile image
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById("profile-pic");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

// Edit profile function (shows editable fields)
function editProfile() { //TODO: complete profile update api
  const form = document.querySelector(".profile-edit-section");
  form.style.display = form.style.display === "block" ? "none" : "block";
}

// Save profile changes (basic functionality)
document
  .getElementById("profile-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    document.getElementById("name").textContent =
      document.getElementById("name-input").value;
    document.getElementById("email").textContent =
      document.getElementById("email-input").value;
    document.getElementById("phone").textContent =
      document.getElementById("phone-input").value;
    document.getElementById("employment-status").textContent =
      document.getElementById("employment-status-input").value;

    alert("Profile updated successfully!");
  });

document.addEventListener("DOMContentLoaded", function () {
  const skillsInput = document.getElementById("skills-input");
  const skillsContainer = document.getElementById("skills-container");
  let selectedSkills = [];

  if (!token) {
    window.location.href = "signin.html";
  }

  skillsInput.addEventListener("change", function () {
    const selectedSkill = skillsInput.value;

    // Ensure the skill is not already added and is valid
    if (selectedSkill && !selectedSkills.includes(selectedSkill)) {
      selectedSkills.push(selectedSkill);
      renderSkills();
    }

    // Reset dropdown
    skillsInput.value = "";
  });

  // Function to render the selected skills as tags
  function renderSkills() {
    skillsContainer.innerHTML = ""; // Clear previous tags

    selectedSkills.forEach((skill, index) => {
      const skillTag = document.createElement("div");
      skillTag.classList.add("skill-tag");
      skillTag.innerHTML = `
                ${skill} <button onclick="removeSkill(${index})">x</button>
            `;
      skillsContainer.appendChild(skillTag);
    });
  }

  // Function to remove skill from selectedSkills array
  window.removeSkill = function (index) {
    selectedSkills.splice(index, 1);
    renderSkills();
  };
});
