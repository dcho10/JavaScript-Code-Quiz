// Create a variable for the questions:
var questions = [
    {
        question:"What does console.log(window) give you?",
        answers: [
            {text: "Window", correct: true},
            {text: "Object Window", correct: false},
            {text: "Document Window", correct: false},
            {text: "None of the above", correct: false},
        ]
    },
    {
        question: "What does the append() method do?",
        answers: [
            {text: "Inserts and object or string before the first child element", correct: false},
            {text: "Inserts an object or string after the first child element", correct: false},
            {text: "Inserts an object or string after the last child element", correct: true},
            {text: "Inserts an object or string before the last child element", correct: false},
        ]
    },
    {
        question: "Which of the following will NOT cancel the default action?",
        answers: [
            {text: "event.preventDefault()", correct: false},
            {text: "stopPropagation()", correct: false},
            {text: "stopImmediatePropagation()", correct: false},
            {text: "event.stopDefault()", correct: true},
        ]
    },
    {
        question: "Which of the following is NOT a JavaScript message box?",
        answers: [
            {text: "alert()", correct: false},
            {text: "message()", correct: true},
            {text: "prompt()", correct: false},
            {text: "confirm()", correct: false},
        ]
    }
    
]

// Variables for set values:
var shuffledQuestions, currentQuestionIndex
var currentQuestionIndex = 0;
var time = 0;
var correctAnswers = 0;
var penalty = false;
var questionAnswered = false;

// Variables for buttons:
var answerButtonEl = document.getElementById("answer-buttons");
var startButton = document.getElementById("start-button")
var nextButton = document.getElementById("next-button")

// Variables for questions: 
var questionEl = document.getElementById("question");
var containerEl = document.getElementById("container");

// Variables for scores:
var submitScore = document.getElementById("form");
var highscores = [];

// Other variables:
var timerEl = document.getElementById("timer");
var responseEl = document.getElementById("response");

// classLists throughout the code were found from: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
nextButton.classList.add("hide");
containerEl.classList.remove("hide");

// When you load the app, you get the start screen with buttons that do not have a function yet. When you click to start the quiz, it will load the questions in a shuffled order
startButton.addEventListener("click", function() {

function startQuiz() {
    correctAnswers = 0;
    startButton.classList.add("hide");
    nextButton.classList.add("hide");
    containerEl.classList.remove("hide");
    answerButtonEl.classList.remove("hide");
    // shuffledQuestions was found from: https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    startTimer()
    setNextQuestion()
}

// Timer starts, the user has 2 minutes to complete the quiz, when the timer expires, the message "Time's up!" will display
function startTimer() {
    var minutesLeft = 2
    time = minutesLeft * 60;

    // Building minute countdown timer was found from: https://www.youtube.com/watch?v=x7WJEmxNlEs
    var timerInterval = setInterval (function () {
    if (time > 0) {
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        time--;
        timerEl.textContent = minutes + ":" + seconds;
    } else {
        // clearInterval ensures the timerInterval does not go into the negatives
        clearInterval(timerInterval);
        timerEl.textContent = "Time's up!";
        endQuiz();
        
    }
}, 1000 )} startQuiz()})

// This function will display the next question if it is right and only deduct the time once if the user answers wrong
function setNextQuestion() {
    showQuestion(shuffledQuestions[currentQuestionIndex])
    penalty = false;
}

// If the index is less than or equal to the array length, the quiz will end 
function showQuestion(question) {
    if (currentQuestionIndex >= shuffledQuestions.length) {
        return;
    }
    // Formats the answers onto the buttons:
    questionEl.innerText = question.question
    answerButtonEl.innerHTML="";
    question.answers.forEach(answer => {
        var button = document.createElement("button")
        button.innerText = answer.text
        button.classList.add("button")
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer);
        answerButtonEl.appendChild(button);
    })
    }

// User only gets one chance to answer the question before moving onto next
function selectAnswer(event) {
if (!questionAnswered) {
    questionAnswered = true;
}
    // Event listener for the select answer target
    var selectedAnswer = event.target;
    if (shuffledQuestions[currentQuestionIndex]) {

        var correctAnswer = shuffledQuestions[currentQuestionIndex].answers.find(answer => answer.correct);
        
        // Verifies if the selected answer matches the correct answer that's in the questions variable. If it's correct, their score goes up by 1, if it's wrong, the user loses 10 seconds and the penalty is only applied once
        if (selectedAnswer.innerText === correctAnswer.text) {
        response.textContent = "Correct!"
        correctAnswers++;
            } else {
            response.textContent = "Incorrect! You lost 10 seconds!"
            time = Math.max(0, time - 10);
            penalty = true;
            }
        
        // Moves onto next question
        currentQuestionIndex++;

            // Call for setNextQuestion function, but if no more questions to display, calls endQuiz function
            if (shuffledQuestions[currentQuestionIndex]) {
            setNextQuestion();
            } else {
                endQuiz();
}
    } else {
        endQuiz();
    }}

// Displays final score, questions and timer are reset if the user wants to restart
function endQuiz () {
    response.textContent = "Congratulations! Your final score is " + correctAnswers + "." + " Submit your score!";

    currentQuestionIndex = 0;
    time = 0;
    penalty = false;

    containerEl.classList.add("hide");
    startButton.innerText = "Restart";
    startButton.classList.remove("hide");
    nextButton.classList.add("hide");

    // Submit high scores form
    var submitForm = document.getElementById("form");
    submitForm.classList.remove("hide");
}

// Submit and sorts the high scores
submitScore.addEventListener("submit", function(event) {
    event.preventDefault()
    var initials = document.getElementById("user").value;
    var highscore = {user: initials, score: correctAnswers };
    highscores.push(highscore);
    highscores.sort((a,b) => b.score - a.score);
    displayHighscores();

});

// Formats the high scores
function displayHighscores() {
    var highScoreList = document.getElementById("highscore-list");
    highScoreList.innerHTML = "";
    highscores.forEach((hs, index) => {
        var listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${hs.user}: ${hs.score}`;
        highScoreList.appendChild(listItem);
    });
}