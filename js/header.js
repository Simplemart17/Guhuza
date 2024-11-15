const token = localStorage.getItem('token');

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const authButtons = document.querySelector(".auth-buttons");
  const signIn = document.getElementById("btn-signin");
  const signUp = document.getElementById("btn-signup");

  if (token) {
    signIn.innerText = "Log Out"
    signIn.addEventListener("click", () => {
      localStorage.clear();
      window.location = "/UI/signin.html";
    })
  } else {
    signIn.innerText = "Sign In"
    signIn.addEventListener("click", () => {
      window.location = "/UI/signin.html";
    })
  }

  signUp.addEventListener("click", () => {
    localStorage.clear();
    window.location = "/UI/signup.html";
  })

  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active");
    authButtons.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) {
      mainNav.classList.remove("active");
      authButtons.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Prevent dropdown from closing when clicking inside it
  mainNav.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  authButtons.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});
