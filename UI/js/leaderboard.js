const url = "http://localhost:3000";

// Share game on social media
function shareGame(platform) {
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

window.onload = async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "signin.html";
  }

  await fetchLeaderboard();
};

async function fetchLeaderboard() {
  try {
    const response = await fetch(`${url}/leaderboard`, {
      method: "POST",
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

function displayLeaderboard(data) {
  const leaderboardData = document.getElementById("leaderboard-table");

  if (data) {
    data.leaderboard.forEach((board, index) => {
      leaderboardData.innerHTML += `
      <table>
        <tbody>
                    <tr>
                        <td data-label="Rank">${index + 1}</td>
                        <td data-label="Full Name">${board.user.fullname}</td>
                        <td data-label="Total Point">${board.total_point}</td>
                        <td data-label="Level">${board.user.level}</td>
                        <td data-label="Badges Earned">
                            <span class="badge">Job Seeker Pro</span>
                            <span class="badge">Interview Ace</span>
                        </td>
                        <td data-label="Referred Users">
                            gauravarora5@gmail.com<br>
                            md45678@hotmail.com
                        </td>
                        <td data-label="Achievements">Completed all levels, Referred 2 users</td>
                        <td data-label="Profile Visited by Recruiters">10 Visits</td>
                    </tr>
        </tbody>
      </table>
    `;
    });
  }
}
