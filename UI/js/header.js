
window.onload = async function () {
  const token = localStorage.getItem('token');
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const authButtons = document.querySelector(".auth-buttons");
  const signIn = document.getElementById("signin");
  const signUp = document.getElementById("signup");

  if (token) {
    signIn.innerText = "Log Out"
    signIn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "signin.html";
    })
  } else {
    signIn.innerText = "Sign In"
    signIn.addEventListener("click", () => {
      window.location.href = "signin.html";
    })
  }

  signUp.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "signup.html";
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
};
