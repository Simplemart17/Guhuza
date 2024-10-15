// Check the user's progress from local storage
window.onload = function () {
  const beginnerCompleted = localStorage.getItem("beginnerCompleted");
  const intermediateCompleted = localStorage.getItem("intermediateCompleted");

  // If Beginner is completed, enable the Intermediate button
  if (beginnerCompleted) {
    document.getElementById("startIntermediate").disabled = false;
  }

  // If Intermediate is completed, enable the Advanced button
  if (intermediateCompleted) {
    document.getElementById("startAdvanced").disabled = false;
  }
};

// Function to mark Beginner as completed
function completeBeginner() {
  localStorage.setItem("beginnerCompleted", true);
  alert("Beginner level completed! Intermediate unlocked.");
  window.location.href = "UI/level3.html"; // Redirect to the next level
}

// Function to mark Intermediate as completed
function completeIntermediate() {
  localStorage.setItem("intermediateCompleted", true);
  alert("Intermediate level completed! Advanced unlocked.");
  window.location.href = "level7.html"; // Redirect to the next level
}

// Copy the referral link to clipboard
function copyReferral() {
  const referralLink = document.getElementById("referral-link");
  referralLink.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

// Share the web link on social media
function shareOnSocial(platform) {
  let url = "";
  if (platform === "facebook") {
    url =
      "https://www.facebook.com/sharer/sharer.php?u=" + document.location.href;
  } else if (platform === "twitter") {
    url = "https://twitter.com/intent/tweet?url=" + document.location.href;
  } else if (platform === "linkedin") {
    url =
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      document.location.href;
  }
  window.open(url, "_blank");
}
