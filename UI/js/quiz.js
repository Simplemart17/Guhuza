const url = "http://localhost:3000/api/v1";
// const url = "https://guhuza.onrender.com/api/v1";
let res;

let currentQuestion;
let answeredQuestion;
let score = 0;
let level;
let correctAnswersInLevel = 0;
// const questionsPerLevel = 10;
const levelThreshold = 5; // Minimum score to pass the level // TODO: set the variable in env for flexibility
const levelStartButton = document.getElementById("level-button");

let timer;
let timeLeft = 60;

//TODO: randomize quiz answer options
//TODO: store correctly answered questions and remove from questions shown to the user
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
  currentQuestion = res.question_answered;
  level = res.level;
  loadQuestion(currentQuestion);
  updateLevelInfo();
  startTimer(); // Start the timer when the quiz loads

  levelStartButton.addEventListener("click", async () => {
    const levelButton = document.getElementById("level-button");
    const answerButtons = document.querySelectorAll(".answers button");

    // Reset the timer to 60 seconds
    timeLeft = 60;
    clearInterval(timer);
    startTimer();

    // reset question number
    currentQuestion = 0;
    correctAnswersInLevel = 0;
    level++;
    updateLevelInfo();
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

        // hide the button to continue new game level
        levelButton.style.display = "none";

        answerButtons.forEach((button) => {
          button.classList.remove("no-hover");
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

async function loadQuestion(index) {
  // answeredQuestion = currentQuestion.split(",");
  const quizQuestion = await fetch(`${url}/quiz?level=${level}`);
  res = await quizQuestion.json();

  const questionEl = document.getElementById("question");
  const answerButtons = document.querySelectorAll(".answers button");
  const feedbackEl = document.getElementById("feedback");
  const nextButton = document.getElementById("next-question");

  if (currentQuestion === res.length) {
    checkLevelProgression();
    nextButton.style.display = "none";
  }

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
  answerButtons.forEach((button) => {
    button.disabled = true;
    button.classList.add("no-hover");
  });

  currentQuestion++;

  const responseTime = 60 - timeLeft;
  let points = 5;

  if (responseTime > 30) {
    points = 2;
  } else if (responseTime > 45) {
    points = 1;
  }

  if (selectedIndex === correctAnswer) {
    // // convert the question index/id to string, push to the answered question array
    // answeredQuestion.push(currentQuestion.toString());
    feedbackEl.innerText = "Correct answer 👍";
    feedbackEl.className = "feedback correct";
    score++;
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
  updateLevelInfo();

  // Check if Level 1 is complete
  if (currentQuestion === res.length) {
    checkLevelProgression();
    nextButton.style.display = "none";
  }
}

async function loadNextQuestion() {
  const answerButtons = document.querySelectorAll(".answers button");

  answerButtons.forEach((button) => {
    button.classList.remove("no-hover");
  });

  // Reset the timer to 60 seconds
  timeLeft = 60;
  clearInterval(timer);
  startTimer();

  if (currentQuestion < res.length) {
    loadQuestion(currentQuestion);
  }
}

async function tryAgain() {
  currentQuestion = 0;
  loadQuestion(0);
}

function checkLevelProgression() {
  const levelButton = document.getElementById("level-button");
  const levelStatusEl = document.getElementById("level-status");
  const questionEl = document.getElementById("question");
  const answerButtons = document.getElementById("answers");
  const feedbackEl = document.getElementById("feedback");
  const nextButton = document.getElementById("next-question");
  const tryAgainButton = document.getElementById("try-again");
  const timerEl = document.getElementById("timer");
  const levelInfo = document.getElementById("level-info");

  // Check if the user passed Level 1 (minimum 5 correct answers)
  if (correctAnswersInLevel >= levelThreshold) {
    displayFinalScore();
    levelStatusEl.innerText = `Level ${level} Achieved!`;
    levelButton.innerHTML = `Start level ${level + 1}`;
    levelButton.style.display = "block";
  } else {  
    clearInterval(timer);
  
    // Hide question, answers, and feedback
    questionEl.innerText = `Level ${level} Failed! \nYou got ${score} out of ${res.length} questions correctly! \n\nYou need at least 5 correct answers.`;
    answerButtons.style.display = "none";
    feedbackEl.style.display = "none";
    nextButton.style.display = "none";
    timerEl.style.display = "none";
    tryAgainButton.style.display = "block";
    levelInfo.innerHTML = "";
  }
  levelStatusEl.style.display = "block";

  setTimeout(() => {
    levelStatusEl.style.display = "none";
  }, 3000);
}

function updateLevelInfo() {
  const levelInfo = document.getElementById("level-info");

  // Update level information
  levelInfo.innerText = `Level: ${level}`;
}

async function displayFinalScore() {
  const questionEl = document.getElementById("question");
  const answerButtons = document.getElementById("answers");
  const feedbackEl = document.getElementById("feedback");
  const nextButton = document.getElementById("next-question");
  const timerEl = document.getElementById("timer");

  clearInterval(timer);

  // Hide question, answers, and feedback
  questionEl.innerText = `Level ${level} Completed! \nYou got ${score} out of ${res.length} questions correctly!`;
  answerButtons.style.display = "none";
  feedbackEl.style.display = "none";
  nextButton.style.display = "none";
  timerEl.style.display = "none";
}

// Add this function to start the countdown timer
function startTimer() {
  const feedbackEl = document.getElementById("feedback");
  const nextButton = document.getElementById("next-question");
  const timerEl = document.getElementById("timer");
  const answerButtons = document.querySelectorAll(".answers button");

  timer = setInterval(() => {
    if (timeLeft <= 0) {
      // Disable all buttons after an answer is selected
      answerButtons.forEach((button) => {
        button.disabled = true;
        button.classList.add("no-hover");
      });

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
        timerEl.style.color = "";
      }
      timeLeft--;
    }
  }, 1000);
}
