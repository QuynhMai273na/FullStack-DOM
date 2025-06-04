const quizQuestions = [
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'London', correct: false },
      { text: 'Berlin', correct: false },
      { text: 'Paris', correct: true },
      { text: 'Madrid', correct: false },
    ],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Venus', correct: false },
      { text: 'Mars', correct: true },
      { text: 'Jupiter', correct: false },
      { text: 'Saturn', correct: false },
    ],
  },
  {
    question: 'What is the largest ocean on Earth?',
    answers: [
      { text: 'Atlantic Ocean', correct: false },
      { text: 'Indian Ocean', correct: false },
      { text: 'Arctic Ocean', correct: false },
      { text: 'Pacific Ocean', correct: true },
    ],
  },
  {
    question: 'Which of these is NOT a programming language?',
    answers: [
      { text: 'Java', correct: false },
      { text: 'Python', correct: false },
      { text: 'Banana', correct: true },
      { text: 'JavaScript', correct: false },
    ],
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: [
      { text: 'Go', correct: false },
      { text: 'Gd', correct: false },
      { text: 'Au', correct: true },
      { text: 'Ag', correct: false },
    ],
  },
];

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-btn');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

startButton.addEventListener('click', () => {
  startScreen.classList.remove('active');
  quizScreen.classList.add('active');
  showQuestion();
});

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  // Show question
  quizScreen.innerHTML = '';
  const quizHeader = document.createElement('div');
  quizHeader.classList.add('quiz-header');
  quizHeader.innerHTML = `
    <h2 id="question-text">${currentQuestion.question}</h2>
    <div class="quiz-info">
        <p>
          Question <span id="current-question">${
            currentQuestionIndex + 1
          }</span> of
          <span id="total-questions">${quizQuestions.length}</span>
        </p>
        <p>Score: <span id="score">${score}</span></p>
    </div>
    `;
  quizScreen.appendChild(quizHeader);
  // Show answers
  const answerContainer = document.createElement('div');
  answerContainer.classList.add('answers-container');
  currentQuestion.answers.forEach((answer) => {
    const answerButton = document.createElement('button');
    answerButton.classList.add('answer-btn');
    answerButton.setAttribute('data-correct', answer.correct);
    answerButton.textContent = answer.text;
    answerButton.addEventListener('click', checkAnswer);
    answerContainer.appendChild(answerButton);
  });
  quizScreen.appendChild(answerContainer);
  // Show progress bar
  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');
  const progress = document.createElement('div');
  progress.classList.add('progress');
  progress.style.width = `${
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
  }%`;
  progressBar.appendChild(progress);
  quizScreen.appendChild(progressBar);
}
function checkAnswer(event) {
  const selectedAnswer = event.target;
  const isCorrect = selectedAnswer.getAttribute('data-correct') === 'true';
  if (isCorrect) {
    selectedAnswer.classList.add('correct');
    score++;
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
  } else {
    selectedAnswer.classList.add('incorrect');
    const correctAnswer = document.querySelector(
      '.answer-btn[data-correct="true"]' //lấy button có thuộc tính data-correct = true
    );
    correctAnswer.classList.add('correct');
  }
  setTimeout(() => {
    currentQuestionIndex++;
    currentQuestionIndex < quizQuestions.length ? showQuestion() : showResult();
  }, 1000);
}

function showResult() {
  quizScreen.classList.remove('active');
  resultScreen.classList.add('active');
  const finalScore = document.getElementById('final-score');
  finalScore.textContent = score;
  const maxScore = document.getElementById('max-score');
  maxScore.textContent = quizQuestions.length;

  const percentScore = (score / quizQuestions.length) * 100;
  const resultMessage = document.getElementById('result-message');
  if (percentScore < 40) {
    resultMessage.textContent = 'Keep studying! You will get better!';
  } else if (percentScore === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else {
    resultMessage.textContent = 'Great job! You know your stuff!';
  }
}

const restartButton = document.getElementById('restart-btn');
restartButton.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  resultScreen.classList.remove('active');
  startScreen.classList.add('active');
});
