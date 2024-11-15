const url = "http://localhost:3000/api/v1";

const signInForm = document.getElementById("sign-in-form");

// Validation for Sign Up Form
function validateSignUp() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!validatePassword(password)) {
    alert(
      "Password must be 8-10 characters long and include at least one special character."
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
  const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,10}$/;
  return passwordPattern.test(password);
}

signInForm.onsubmit = async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");
  const success = document.getElementById("success");

  const login = {
    email,
    password,
  };

  try {
    const response = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    const res = await response.json();

    if (res.status !== 200) {
      error.innerHTML = res.message;
      error.style.display = "block";
      setTimeout(() => {
        error.style.display = "none";
      }, 3000);
    }

    if (res.status === 200) {
      const token = res.token;
      localStorage.setItem("token", token);

      success.style.display = "block";
      setTimeout(() => {
        window.location.href = "quiz.html";
      }, 3000);
    }
  } catch (error) {
    console.log(error);
  }
};
