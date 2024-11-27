// const url = "http://localhost:3000/api/v1";
const url = "https://guhuza.onrender.com/api/v1";

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
  const userId = urlParams.get('userId');
  const token = urlParams.get('token');

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value;
  const button = document.getElementById('accept-btn');

  const error = document.getElementById("error");
  const success = document.getElementById("success");

  const userInfo = {
    email,
    password,
    fullname
  };

  try {
    const inviteToken = token ? `&token=${token}` : '';
    button.disabled = true;
    button.style.background = "gray";
    button.textContent = 'Accepting...';

    const response = await fetch(`${url}/accept-invite?userId=${userId}${inviteToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const res = await response.json();

    if (res.status !== 201) {
      error.innerHTML = res.message;
      button.disabled = false;
      error.style.display = "block";
      button.style.background = "";
      button.textContent = 'Accept Invite';
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
