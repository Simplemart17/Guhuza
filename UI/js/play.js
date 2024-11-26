const url = "http://localhost:3000/api/v1";
// const url = "https://guhuza.onrender.com/api/v1";

let referralUrl;

// Check the user's progress from local storage
window.onload = async function () {
  const token = localStorage.getItem("token");
  const referralId = document.getElementById("referral-link");

  if (!token) {
    window.location.href = "signin.html";
  }
  // get user profile
  const userDetails = await fetch(`${url}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token,
    },
  });

  const res = await userDetails.json();
  referralUrl = `http://localhost:5500/UI/accept.html?userId=${res.id}`;
  if (res.id) {
    referralId.value = referralUrl;
  }

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

// Copy the referral link to clipboard
function copyReferral() {
  const referralLink = document.getElementById("referral-link");
  referralLink.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

// open invite friends modal
function inviteFriend() {
  document.getElementById("inviteModal").style.display = "block";
}

// Close the modal
function closeModal() {
  document.getElementById("inviteModal").style.display = "none";
}

// Send the invite
async function sendInvite() {
  const token = localStorage.getItem("token");
  const button = document.getElementById("sendInviteButton");
  const email = document.getElementById("friendEmail").value;

  if (email) {
    button.disabled = true;
    button.style.background = "gray";
    button.textContent = "Sending...";

    const response = await fetch(`${url}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ email }),
    });

    const res = await response.json();

    // Close the modal after sending the invite
    closeModal();
  } else {
    alert("Please enter a valid email address.");
  }
}

// Share the web link on social media
function shareOnSocial(platform) {
  let url = "";
  if (platform === "facebook") {
    url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralUrl
    )}`;
  } else if (platform === "twitter") {
    url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      referralUrl
    )}`;
  } else if (platform === "linkedin") {
    url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      referralUrl
    )}`;
  }
  window.open(
    url,
    `${platform}-share`,
    "width=600, height=400, resizable=yes, scrollbars=yes"
  );
}
