
const apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'; // URL to fetch questions

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false; // Variable to track if an answer has been selected

const questionContainer = document.querySelector('.question');
const choicesContainer = document.querySelector('.choices');
const feedbackContainer = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result');

async function fetchQuizData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        quizData = data.results.map(item => ({
            question: item.question,
            choices: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
            correct: item.correct_answer
        }));
        loadQuestion();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        questionContainer.textContent = 'Failed to load quiz data. Please try again later.';
    }
}

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion.question;
    choicesContainer.innerHTML = '';
    currentQuestion.choices.forEach(choice => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.onclick = () => selectAnswer(choice);
        choicesContainer.appendChild(li);
    });
    feedbackContainer.textContent = '';
    nextButton.style.display = 'none';
    answerSelected = false; // Reset the flag for the new question
    
    // Update question counter
    const questionCounter = document.getElementById('question-counter');
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
}

function selectAnswer(choice) {
    if (answerSelected) return; // If an answer is already selected, do nothing
    
    const currentQuestion = quizData[currentQuestionIndex];
    answerSelected = true; // Set the flag to true when an answer is selected
    
    // Disable all choices
    const choiceElements = choicesContainer.querySelectorAll('li');
    choiceElements.forEach(li => li.style.pointerEvents = 'none');
    
    if (choice === currentQuestion.correct) {
        score++;
        feedbackContainer.textContent = 'Correct!';
        feedbackContainer.style.color = 'green';
    } else {
        feedbackContainer.textContent = `Wrong! The correct answer is ${currentQuestion.correct}.`;
        feedbackContainer.style.color = 'red';
    }
    nextButton.style.display = 'block';
}

nextButton.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    questionContainer.style.display = 'none';
    choicesContainer.style.display = 'none';
    feedbackContainer.style.display = 'none';
    nextButton.style.display = 'none';
    resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!<br>Good job ${localStorage.getItem('username')}!`;
}

// Start the quiz by fetching quiz data
fetchQuizData();