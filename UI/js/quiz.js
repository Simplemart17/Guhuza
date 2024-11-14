const url = "http://localhost:3000";
let res;

let currentQuestion = 0;
let score = 0;
let level = 1;
let correctAnswersInLevel = 0;
const questionsPerLevel = 10;
const levelThreshold = 8; // Minimum score to pass the level
const levelStartButton = document.getElementById('level-button');

// Load the first question
window.onload = function() {
    loadQuestion(currentQuestion);
    updateScoreboard();

    levelStartButton.addEventListener('click', () => {
        console.log("the button is clicking");
        level++
    })
}

async function loadQuestion(index) {
    const quizQuestion = await fetch(`${url}/quiz`);
    res = await quizQuestion.json();

    const questionEl = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answers button');
    const feedbackEl = document.getElementById('feedback');
    const nextButton = document.getElementById('next-question');

    // Load question and answers
    questionEl.innerText = res[index].question;
    
    // Update each answer button with the corresponding options
    answerButtons.forEach((button, idx) => {
        if (res[index].answers[idx]) {
            button.innerText = res[index].answers[idx]; // Set button text to the option
            button.disabled = false; // Re-enable the button in case it was disabled
            button.style.display = 'block'; // Ensure the button is visible
        } else {
            button.style.display = 'none'; // Hide unused buttons if options are less than 4
        }
    });

    // Hide feedback and next button initially
    feedbackEl.style.display = 'none';
    nextButton.style.display = 'none';
}

function checkAnswer(selectedIndex) {
    const feedbackEl = document.getElementById('feedback');
    const correctAnswer = res[currentQuestion].test_answer;
    const nextButton = document.getElementById('next-question');
    const answerButtons = document.querySelectorAll('.answers button');

    // Disable all buttons after an answer is selected
    answerButtons.forEach(button => button.disabled = true);

    if (selectedIndex === correctAnswer) {
        feedbackEl.innerText = "Correct answer 👍";
        feedbackEl.className = 'feedback correct';
        score++;
        correctAnswersInLevel++; // Increment correct answers for this level
    } else {
        feedbackEl.innerText = "Incorrect answer 👎";
        feedbackEl.className = 'feedback incorrect';
    }

    feedbackEl.style.display = 'block';
    nextButton.style.display = 'block';
    updateScoreboard();

    // Check if Level 1 is complete
    if (level === 1 && currentQuestion === questionsPerLevel - 1) {
        checkLevelProgression();
        nextButton.style.display = 'none';
    }
}

function loadNextQuestion() {
    currentQuestion++;

    if (currentQuestion < res.length) {
        loadQuestion(currentQuestion);
    } else {
        displayFinalScore();
    }
}

function checkLevelProgression() {
    const levelButton = document.getElementById('level-button');
    const levelStatusEl = document.getElementById('level-status');

     // Check if the user passed Level 1 (minimum 3 correct answers)
     if (correctAnswersInLevel >= levelThreshold) {
         levelStatusEl.innerText = `Level ${level} Achieved!`;
         levelButton.innerHTML = `Start level ${level + 1}`
         levelButton.style.display = 'block'; // Show Level 2 button if the user passes
     } else {
         levelStatusEl.innerText = `Level ${level} Failed. You need at least 3 correct answers.`;
     }
     levelStatusEl.style.display = 'block';

    setTimeout(() => {
        levelStatusEl.style.display = 'none';
    }, 3000); // Show the level status for 3 seconds
}

function updateScoreboard() {
    const starsContainer = document.getElementById('stars');
    const levelInfo = document.getElementById('level-info');

    // Clear current stars
    starsContainer.innerHTML = '';

    // Add stars based on the current score
    for (let i = 0; i < score; i++) {
        const starImg = document.createElement('img');
        starImg.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Plain_Yellow_Star.png';
        starImg.style.width = '20px'; // Adjust size of stars if necessary
        starImg.style.height = '20px';
        starsContainer.appendChild(starImg);
    }

    // Update level information
    levelInfo.innerText = `Level: ${level}`;
}

function displayFinalScore() {
    const questionEl = document.getElementById('question');
    const answerButtons = document.getElementById('answers');
    const feedbackEl = document.getElementById('feedback');
    const nextButton = document.getElementById('next-question');

    // Hide question, answers, and feedback
    questionEl.innerText = `Quiz Complete! You scored ${score} out of ${res.length}!`;
    answerButtons.style.display = 'none';
    feedbackEl.style.display = 'none';
    nextButton.style.display = 'none';
}
