// const url = "http://localhost:3000/api/v1";
const url = "https://guhuza.onrender.com/api/v1";
let res;

let currentQuestion;
let score = 0;
let level;
let correctAnswersInLevel = 0;
const questionsPerLevel = 10;
const levelThreshold = 5; // Minimum score to pass the level // TODO: set the variable in env for flexibility
const levelStartButton = document.getElementById("level-button");

let timer;
let timeLeft = 60;

//TODO: randomize quiz answer options
//TODO: store correctly answered questions and remove from questions shown to the user
window.onload = async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "signin.html"
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
  currentQuestion = res.last_question_answered;
  level = res.level;
  loadQuestion(currentQuestion);
  updateScoreboard();
  startTimer(); // Start the timer when the quiz loads

  levelStartButton.addEventListener("click", async () => {
    // reset question number
    currentQuestion = 0;
    correctAnswersInLevel = 0;
    level++;
    const token = localStorage.getItem("token");

    try {
      let levelBody = {
        level: level,
      };
      let qtnBody = {
        question: 0,
      };

      loadQuestion(currentQuestion);
      //update level
      const levelUpdate = await fetch(`${url}/updateLevel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(levelBody),
      });

      if (levelUpdate.ok) {
        //update question
        await fetch(`${url}/updateQuestion`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(qtnBody),
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

async function loadQuestion(index) {
  const quizQuestion = await fetch(`${url}/quiz?level=${level}`);
  res = await quizQuestion.json();

  const questionEl = document.getElementById("question");
  const answerButtons = document.querySelectorAll(".answers button");
  const feedbackEl = document.getElementById("feedback");
  const nextButton = document.getElementById("next-question");

  // Load question and answers
  questionEl.innerText = res[index].question;

  // Update each answer button with the corresponding options
  answerButtons.forEach((button, idx) => {
    if (res[index].answers[idx]) {
      button.innerText = res[index].answers[idx];
      button.disabled = false;
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });

  feedbackEl.style.display = "none";
  nextButton.style.display = "none";
}

async function checkAnswer(selectedIndex) {
  const token = localStorage.getItem("token");
  const feedbackEl = document.getElementById("feedback");
  const correctAnswer = res[currentQuestion].test_answer;
  const nextButton = document.getElementById("next-question");
  const answerButtons = document.querySelectorAll(".answers button");

  // Disable all buttons after an answer is selected
  answerButtons.forEach((button) => (button.disabled = true));

  currentQuestion++;

  const responseTime = 60 - timeLeft;
  let points = 5;

  if (responseTime > 30) {
    points = 2;
  } else if (responseTime > 45) {
    points = 1;
  }

  if (selectedIndex === correctAnswer) {
    feedbackEl.innerText = "Correct answer 👍";
    feedbackEl.className = "feedback correct";
    score += points; // Add points based on response time
    correctAnswersInLevel++;
    let body = {
      question: currentQuestion,
      point: points,
    };

    await fetch(`${url}/updateQuestion`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(body),
    });
  } else {
    feedbackEl.innerText = "Incorrect answer 👎";
    feedbackEl.className = "feedback incorrect";

    let body = {
      question: currentQuestion,
      point: 0,
    };

    await fetch(`${url}/updateQuestion`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(body),
    });
  }

  feedbackEl.style.display = "block";
  nextButton.style.display = "block";
  updateScoreboard();

  // Check if Level 1 is complete
  if (currentQuestion === res.length - 1) {
    checkLevelProgression();
    nextButton.style.display = "none";
  }
}

async function loadNextQuestion() {
  // Reset the timer to 60 seconds
  timeLeft = 60;
  clearInterval(timer);
  startTimer();

  if (currentQuestion < res.length) {
    loadQuestion(currentQuestion);
  } else {
    displayFinalScore();
  }
}

function checkLevelProgression() {
  const levelButton = document.getElementById("level-button");
  const levelStatusEl = document.getElementById("level-status");

  // Check if the user passed Level 1 (minimum 5 correct answers)
  if (correctAnswersInLevel >= levelThreshold) {
    levelStatusEl.innerText = `Level ${level} Achieved!`;
    levelButton.innerHTML = `Start level ${level + 1}`;
    levelButton.style.display = "block"; // Show next Level button if the user passes
  } else {
    levelStatusEl.innerText = `Level ${level} Failed. You need at least 5 correct answers.`;
  }
  levelStatusEl.style.display = "block";

  setTimeout(() => {
    levelStatusEl.style.display = "none";
  }, 3000); // Show the level status for 3 seconds
}

function updateScoreboard() {
  const levelInfo = document.getElementById("level-info");

  // Update level information
  levelInfo.innerText = `Level: ${level}`;
}

async function displayFinalScore() {
  const questionEl = document.getElementById("question");
  const answerButtons = document.getElementById("answers");
  const feedbackEl = document.getElementById("feedback");
  const nextButton = document.getElementById("next-question");

  // Hide question, answers, and feedback
  questionEl.innerText = `Quiz Complete! You scored ${score} out of ${res.length}!`;
  answerButtons.style.display = "none";
  feedbackEl.style.display = "none";
  nextButton.style.display = "none";
}

// Add this function to start the countdown timer
function startTimer() {
  const timerEl = document.getElementById("timer");
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      // Handle time up scenario
      feedbackEl.innerText = "Time's up! 👎";
      feedbackEl.className = "feedback incorrect";
      feedbackEl.style.display = "block";
      nextButton.style.display = "block";
    } else {
      timerEl.innerText = `Time left: ${timeLeft}s`;
      // Change timer color to red if less than 20 seconds
      if (timeLeft < 20) {
        timerEl.style.color = "red";
      } else {
        timerEl.style.color = ""; // Reset to default color
      }
      timeLeft--;
    }
  }, 1000);
}
