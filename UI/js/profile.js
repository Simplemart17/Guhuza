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
function editProfile() {
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
