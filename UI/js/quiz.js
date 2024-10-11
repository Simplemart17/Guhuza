// Questions and Answers for Level 1
const level1Questions = [
    {
        question: "How long should a professional resume typically be?",
        options: ["1 page", "2-3 pages", "As long as necessary", "No limit"],
        correct: 0,
        feedback: [
            "Correct! For most professionals, a concise, 1-page resume is ideal.",
            "Incorrect! A resume should usually be 1 page for most professionals.",
            "Incorrect! Try to keep your resume concise and focused.",
            "Incorrect! It's best to stick to 1 page unless you have extensive experience."
        ]
    },
    {
        question: "What is the best way to follow up after an interview?",
        options: ["Call every day", "Send a thank-you email", "Send a gift", "Do nothing"],
        correct: 1,
        feedback: [
            "Incorrect! Calling too frequently may come off as pushy.",
            "Correct! A polite thank-you email reinforces your interest.",
            "Incorrect! Sending gifts can be unprofessional.",
            "Incorrect! It’s always good to follow up professionally."
        ]
    },
    {
        question: "Which industry is currently experiencing the fastest job growth?",
        options: ["Healthcare", "Retail", "Manufacturing", "Travel and Tourism"],
        correct: 0,
        feedback: [
            "Correct! Healthcare is expanding rapidly due to advancements and an aging population.",
            "Incorrect! Retail is not growing as fast as healthcare.",
            "Incorrect! Manufacturing is not leading in job growth.",
            "Incorrect! Travel and tourism are recovering, but healthcare is growing faster."
        ]
    },
    {
        question: "Which soft skill is crucial for career success?",
        options: ["Critical thinking", "Typing speed", "Coding", "Memorizing facts"],
        correct: 0,
        feedback: [
            "Correct! Critical thinking helps in solving complex problems in any job role.",
            "Incorrect! Typing speed is useful but not a key factor for long-term success.",
            "Incorrect! While coding is important in some fields, soft skills like critical thinking apply to all careers.",
            "Incorrect! Memorizing facts is not as important as critical thinking in most roles."
        ]
    },
    {
        question: "How should you respond if a coworker disagrees with your idea in a meeting?",
        options: ["Defend your idea aggressively", "Ignore them", "Politely ask for their reasoning", "Change the subject"],
        correct: 2,
        feedback: [
            "Incorrect! Aggressively defending your idea may hurt professional relationships.",
            "Incorrect! Ignoring them can come off as rude and uncooperative.",
            "Correct! Asking for reasoning and listening to others shows professionalism.",
            "Incorrect! Changing the subject may show a lack of engagement."
        ]
    }
];


let quizData = level1Questions;
let currentQuestion = 0;
let score = 0;
let level = 1;
let correctAnswersInLevel = 0;
const questionsPerLevel = 5;
const levelThreshold = 3; // Minimum score to pass the level

// Load the first question
window.onload = function() {
    loadQuestion(currentQuestion);
    updateScoreboard();
}

function loadQuestion(index) {
    const questionEl = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answers button');
    const feedbackEl = document.getElementById('feedback');
    const nextButton = document.getElementById('next-question');

    // Load question and answers
    questionEl.innerText = quizData[index].question;
    
    // Update each answer button with the corresponding options
    answerButtons.forEach((button, idx) => {
        if (quizData[index].options[idx]) {
            button.innerText = quizData[index].options[idx]; // Set button text to the option
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
    const correctAnswer = quizData[currentQuestion].correct;
    const nextButton = document.getElementById('next-question');
    const answerButtons = document.querySelectorAll('.answers button');

    // Disable all buttons after an answer is selected
    answerButtons.forEach(button => button.disabled = true);

    if (selectedIndex === correctAnswer) {
        feedbackEl.innerText = quizData[currentQuestion].feedback[selectedIndex];
        feedbackEl.className = 'feedback correct';
        score++;
        correctAnswersInLevel++; // Increment correct answers for this level
    } else {
        feedbackEl.innerText = quizData[currentQuestion].feedback[selectedIndex];
        feedbackEl.className = 'feedback incorrect';
    }

    feedbackEl.style.display = 'block';
    nextButton.style.display = 'block';
    updateScoreboard();

    // Check if Level 1 is complete
    if (level === 1 && currentQuestion === questionsPerLevel - 1) {
        checkLevelProgression();
    }
}

function loadNextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion(currentQuestion);
    } else {
        displayFinalScore();
    }
}

function checkLevelProgression() {
    const level2Button = document.getElementById('level2-button');
    const levelStatusEl = document.getElementById('level-status');

     // Check if the user passed Level 1 (minimum 3 correct answers)
     console.log("Correct answers in Level:", correctAnswersInLevel);  // Debugging statement
     if (correctAnswersInLevel >= levelThreshold) {
         levelStatusEl.innerText = `Level ${level} Achieved!`;
         level2Button.style.display = 'block'; // Show Level 2 button if the user passes
         console.log("Level 2 button should be visible now.");  // Debugging statement
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
    questionEl.innerText = `Quiz Complete! You scored ${score} out of ${quizData.length}!`;
    answerButtons.style.display = 'none';
    feedbackEl.style.display = 'none';
    nextButton.style.display = 'none';
}

// Function to open Level 2
function openLevel2() {
    window.open("level2.html", "_blank");
}

