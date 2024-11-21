const url = "http://localhost:3000/api/v1";
// const url = "https://guhuza.onrender.com/api/v1";

const acceptInviteForm = document.getElementById("accept-invite-form");

// Validation for Sign Up Form
function validateSignUp() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  if (!validatePassword(password)) {
    alert(
      "Password must be 8-10 characters long"
    );
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  return true; // Form is valid
}

// Password validation function
function validatePassword(password) {
  const passwordPattern = /^[A-Za-z0-9]{8,10}$/;
  return passwordPattern.test(password);
}

acceptInviteForm.onsubmit = async (event) => {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get('email');

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value;
  const error = document.getElementById("error");
  const success = document.getElementById("success");

  const login = {
    email,
    password,
    fullname
  };

  try {
    const response = await fetch(`${url}/accept-invite?email=${userEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    const res = await response.json();

    if (res.status !== 201) {
      error.innerHTML = res.message;
      error.style.display = "block";
      setTimeout(() => {
        error.style.display = "none";
      }, 3000);
    }

    if (res.status === 201) {
      success.style.display = "block";
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 3000);
    }
  } catch (error) {
    console.log(error);
  }
};
