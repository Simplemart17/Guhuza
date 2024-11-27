// const url = "http://localhost:3000/api/v1";
const url = "https://guhuza.onrender.com/api/v1";

let referralUrl;

//TODO: map completed levels to the badge on the leaderboard
window.onload = async function () {
  const token = localStorage.getItem("token");
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
  referralUrl = `https://simplemart17.github.io/guhuza/accept.html?userId=${res.id}`;
  // referralUrl = `http://localhost:5500/UI/accept.html?userId=${res.id}`;

  await fetchLeaderboard();
};

async function fetchLeaderboard() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${url}/leaderboard`, {
      headers: {
        "Content-Type": "application/json",
        token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard data");
    }

    const data = await response.json();
    displayLeaderboard(data);
  } catch (error) {
    console.error(error);
  }
}

// Share game on social media
function shareGame(platform) {
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

// map images to level
function levelImageMap(level) {
  if (level < 20) {
    return '<img src="images/bolt.png" alt="Fast Learner" class="badge-icon">';
  }
}

// map images to top score
function topScoreImageMap(index) {
  if (index === 0) {
    return '<img src="images/crown.png" alt="Top Recruit" class="badge-icon">';
  } else {
    return "";
  }
}

// map images to top sharer
function topSharerImageMap(number) {
  if (number > 1) {
    return '<img src="images/global-connection.png" alt="Referral Master" class="badge-icon">';
  } else {
    return "";
  }
}

function displayLeaderboard(data) {
  const leaderboardData = document.getElementById("leaderboard-table");

  if (data) {
    data.leaderboard.forEach((board, index) => {
      const inviteEmails = board.user.invite
        .map((invite) => invite.email)
        .join(", ");
      leaderboardData.innerHTML += `
      <table>
        <tbody>
                    <tr>
                        <td data-label="Rank">${index + 1}</td>
                        <td data-label="Full Name">${board.user.fullname}</td>
                        <td data-label="Total Point">${board.total_point}</td>
                        <td data-label="Level">${board.user.level}</td>
                        <td data-label="Badges Earned">
                            ${levelImageMap(board.user.level)}
                            ${topScoreImageMap(index)}
                            ${topSharerImageMap(board.user.invite.length)}
                        </td>
                        <td data-label="Referred Users">
                            ${inviteEmails || "N/A"}
                        </td>
    
                    </tr>
        </tbody>
      </table>
    `;
    });
  }
}
