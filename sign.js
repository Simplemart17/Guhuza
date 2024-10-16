// Validation for Sign In Form
function validateSignIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!validatePassword(password)) {
        alert("Password must be 8-10 characters long and include at least one special character.");
        return false;
    }
    
    return true; // Form is valid
}

// Validation for Sign Up Form
function validateSignUp() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!validatePassword(password)) {
        alert("Password must be 8-10 characters long and include at least one special character.");
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
