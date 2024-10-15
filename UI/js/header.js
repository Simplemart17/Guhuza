document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const authButtons = document.querySelector(".auth-buttons");

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
