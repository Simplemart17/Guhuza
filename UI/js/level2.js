// Questions and Answers for Level 2
const level2Questions = [
    {
        question: "Which of the following leadership styles is characterized by decision-making based on input from all team members?",
        options: ["Autocratic","Democratic","Laissez-faire","Transformational"],
        correct: 1,
        feedback: [
            "Incorrect! Autocratic leaders make decisions unilaterally without input from others.",
            "Correct! Democratic leaders consider the input of all team members before making decisions.",
            "Incorrect! Laissez-faire leaders offer little guidance and let employees take most decisions.",
            "Incorrect! Transformational leaders focus on inspiring and motivating change, but decision-making is not primarily based on input from the team."
        ]
    },
    {
        question: "Which of the following is the primary advantage of SWOT analysis in business strategy?",
        options: ["It predicts future market trends", "It provides a detailed competitor analysis", "It helps identify internal strengths and weaknesses", "It guarantees increased profits"],
        correct: 2,
        feedback: [
            "Incorrect! SWOT analysis helps in identifying the current internal and external factors but doesn’t predict market trends.",
            "Incorrect! SWOT analysis involves both internal and external factors but is not focused solely on competitors.",
            "Correct! SWOT analysis helps companies identify their internal strengths and weaknesses.",
            "Incorrect! SWOT analysis itself does not guarantee profits but can guide a company toward more informed strategic decisions."
        ]
    },
    {
        question: "Which of these techniques is the most effective when resolving workplace conflicts between two team members?",
        options: ["Avoiding the conflict", "Confronting one employee and asking them to apologize", "Facilitating a mediation session between the employees", "Threatening disciplinary action"],
        correct: 2,
        feedback: [
            "Incorrect! Avoiding conflict can lead to unresolved issues and greater tension.",
            "Incorrect! Confronting only one employee without hearing both sides can worsen the situation.",
            "Correct! Mediation helps both parties communicate effectively and find a mutual solution.",
            "Incorrect! Disciplinary action can escalate tensions and should be used as a last resort."
        ]
    },
    {
        question: "Which of the following is a key feature of transformational leadership?",
        options: ["Maintaining the status quo", "Focusing on short-term goals", "Inspiring and motivating employees to achieve long-term change", "Providing constant supervision and instructions"],
        correct: 2,
        feedback: [
            "Incorrect! Transformational leaders focus on inspiring change, not maintaining the status quo.",
            "Incorrect! Transformational leaders aim for long-term vision and growth.",
            "Correct! Transformational leaders inspire their teams to achieve long-term, innovative goals.",
            "Incorrect! Transformational leaders encourage autonomy rather than providing constant supervision."
        ]
    },
    {
        question: "Which of the following scenarios best represents ethical decision-making in the workplace?",
        options: ["A manager ignores a minor issue to maintain good relations with the team", "An employee decides to report a safety violation despite fear of retaliation", "A team leader avoids delegating difficult tasks to underperforming employees to keep them happy", "A supervisor approves overtime work but denies extra compensation to save company costs"],
        correct: 1,
        feedback: [
            "Incorrect! Ethical decision-making involves addressing all issues, even minor ones",
            "Correct! Reporting safety violations despite potential personal repercussions is an example of ethical decision-making.",
            "Incorrect! Ethical leadership requires fairness in task distribution, even if it’s difficult.",
            "Incorrect! Ethical leaders ensure fair compensation for extra work done by employees."
        ]
    },
]



let quizData = level2Questions;
let currentQuestion = 0;
let score = 0;
let level = 2;
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

    // Check if Level 2 is complete
    if (level === 2 && currentQuestion === questionsPerLevel - 1) {
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
    const level3Button = document.getElementById('level3-button');
    const levelStatusEl = document.getElementById('level-status');

     // Check if the user passed Level 2 (minimum 3 correct answers)
     console.log("Correct answers in Level:", correctAnswersInLevel);  // Debugging statement
     if (correctAnswersInLevel >= levelThreshold) {
         levelStatusEl.innerText = `Level ${level} Achieved!`;
         level3Button.style.display = 'block'; // Show Level 3 button if the user passes
         console.log("Level 3 button should be visible now.");  // Debugging statement
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
function openLevel3() {
    window.open("level3.html", "_blank");
}

