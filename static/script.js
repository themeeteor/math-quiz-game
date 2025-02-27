document.addEventListener("DOMContentLoaded", () => {
    let startTime, interval;
    let bestTime = localStorage.getItem("bestTime") || null;
    
    const startBtn = document.getElementById("start-btn");
    const quizContainer = document.getElementById("quiz-container");
    const resultContainer = document.getElementById("result-container");
    const timerDisplay = document.getElementById("timer");
    const questionDisplay = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitBtn = document.getElementById("submit-btn");
    const finalTimeDisplay = document.getElementById("final-time");
    const bestTimeDisplay = document.getElementById("best-time");
    const restartBtn = document.getElementById("restart-btn");
    
    let currentQuestion, correctAnswer, questionCount = 0;
    let totalQuestions = 7;
    
    function generateQuestion() {
        const operators = ["+", "-", "*"];
        const left = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
        const right = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
        const operator = operators[Math.floor(Math.random() * operators.length)];
        currentQuestion = `${left} ${operator} ${right}`;
        correctAnswer = eval(currentQuestion);
        questionDisplay.textContent = currentQuestion;
    }

    function startCountdown(callback) {
        let countdown = 3;
        timerDisplay.textContent = `Starting in ${countdown}`;
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerDisplay.textContent = `Starting in ${countdown}`;
            } else {
                clearInterval(countdownInterval);
                callback(); // Start quiz after countdown
            }
        }, 1000);
    }

    function startQuiz() {
        startBtn.style.display = "none";
        quizContainer.classList.remove("hidden");
        resultContainer.classList.add("hidden");
        questionCount = 0;
        
        let countdown = 3;
        timerDisplay.textContent = `Starting in ${countdown}...`;
    
        let countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerDisplay.textContent = `Starting in ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                timerDisplay.textContent = "00:00"; // Reset the timer display
    
                setTimeout(() => {
                    startTime = Date.now();
                    updateTimer();
                    interval = setInterval(updateTimer, 100);
                    generateQuestion();
                    answerInput.focus(); // Ensure focus happens with a slight delay
                }, 50); // Small delay to allow the DOM to update properly
            }
        }, 1000);
    }
    
    

    function updateTimer() {
        let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        timerDisplay.textContent = elapsedTime;
    }

    function checkAnswer() {
        const feedbackMessage = document.getElementById("feedback-message"); // Add a feedback element in HTML
    
        if (answerInput.value.trim() === correctAnswer.toString()) {
            feedbackMessage.textContent = ""; // Clear feedback when correct
            questionCount++;
            if (questionCount < totalQuestions) {
                answerInput.value = ""; // Clear the answer box
                generateQuestion();
            } else {
                endQuiz();
            }
        } else {
            feedbackMessage.textContent = "Wrong answer, try again!"; // Show feedback
        }
    }
    
    function checkEnter(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    }

    function endQuiz() {
        clearInterval(interval);
        let elapsedTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
        finalTimeDisplay.textContent = `Your Time: ${elapsedTime} sec`;

        let storedBestTime = localStorage.getItem("bestTime");
        let bestTimeValue = storedBestTime ? parseFloat(storedBestTime) : null;

        if (bestTimeValue === null || elapsedTime < bestTimeValue) {
            bestTimeValue = elapsedTime;
            localStorage.setItem("bestTime", bestTimeValue.toFixed(2));
            bestTimeDisplay.textContent = `New Best Time: ${bestTimeValue} sec`;
        } else {
            bestTimeDisplay.textContent = `Best Time: ${bestTimeValue} sec`;
        }

        quizContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");
    }

    function restartQuiz() {
        quizContainer.classList.remove("hidden");
        resultContainer.classList.add("hidden");
        
        // Reset the question text
        questionDisplay.textContent = "Questions here";
        
        // Clear the answer box
        answerInput.value = "";
        
        // Reset the feedback message
        document.getElementById("feedback-message").textContent = "";
    
        startQuiz();
    }
    
    

    startBtn.addEventListener("click", startQuiz);
    submitBtn.addEventListener("click", checkAnswer);
    restartBtn.addEventListener("click", restartQuiz);
    answerInput.addEventListener("keypress", checkEnter);

    if (bestTime) {
        bestTimeDisplay.textContent = `Best Time: ${bestTime} sec`;
    }
});
