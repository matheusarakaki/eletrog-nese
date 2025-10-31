document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const startQuizBtn = document.getElementById('start-quiz');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionCounter = document.getElementById('question-counter');
    const progressFill = document.getElementById('progress-fill');
    const timerElement = document.getElementById('timer');
    const scorePercentage = document.getElementById('score-percentage');
    const correctAnswers = document.getElementById('correct-answers');
    const feedbackMessage = document.getElementById('feedback-message');
    const reviewContainer = document.getElementById('review-container');
    const restartQuizBtn = document.getElementById('restart-quiz');
    
    // Quiz variables
    let currentQuestion = 0;
    let userAnswers = [];
    let score = 0;
    let timer;
    let timeLeft = 30;
    let shuffledQuestions = [];
    
    // Quiz questions in English
    const quizQuestions = [
        {
            question: "In what year was the Telautograph invented, one of the first image transmission devices?",
            options: ["1886", "1888", "1893", "1897"],
            correctAnswer: 1
        },
        {
            question: "Who invented the Diode Valve, a fundamental component for the development of electronics?",
            options: ["John Ambrose Fleming", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
            correctAnswer: 0
        },
        {
            question: "In what year was IBM founded?",
            options: ["1911", "1924", "1903", "1897"],
            correctAnswer: 1
        },
        {
            question: "What 1897 invention became the basis for television and computer monitors for decades?",
            options: ["Telautograph", "Telegraphone", "CRT Monitor", "Analog Calculator"],
            correctAnswer: 2
        },
        {
            question: "What is a 'Flip-Flop' in the context of electronics?",
            options: ["A type of thermionic valve", "A bistable circuit", "A magnetic recording device", "A type of display"],
            correctAnswer: 1
        },
        {
            question: "Which company was formed in 1911 through the merger of three companies and later became IBM?",
            options: ["CTR Company", "Burroughs Corporation", "General Electric", "Western Electric"],
            correctAnswer: 0
        },
        {
            question: "In what year was Liquid Crystal (LCD) discovered, which would later become the basis for flat screens?",
            options: ["1888", "1904", "1913", "1924"],
            correctAnswer: 1
        },
        {
            question: "Which device, invented in 1898, was a precursor to magnetic tape recorders?",
            options: ["Telautograph", "Telegraphone", "CRT Monitor", "Analog Calculator"],
            correctAnswer: 1
        },
        {
            question: "Who developed the Analog Calculators in 1893?",
            options: ["Leonardo Torres y Quevedo", "William S. Burroughs", "John Ambrose Fleming", "Percy Ludgate"],
            correctAnswer: 0
        },
        {
            question: "Which 1918 invention is considered fundamental for the development of computer memory?",
            options: ["Diode Valve", "Flip-Flop", "CRT Monitor", "Telegraphone"],
            correctAnswer: 1
        }
    ];
    
    // Shuffle questions
    function shuffleQuestions() {
        shuffledQuestions = [...quizQuestions];
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }
    }
    
    // Start the quiz
    startQuizBtn.addEventListener('click', startQuiz);
    
    // Restart quiz
    restartQuizBtn.addEventListener('click', restartQuiz);
    
    // Function to start the quiz
    function startQuiz() {
        quizIntro.style.display = 'none';
        quizContent.style.display = 'block';
        
        // Shuffle questions
        shuffleQuestions();
        
        // Initialize user answers array
        userAnswers = new Array(shuffledQuestions.length).fill(null);
        currentQuestion = 0;
        
        // Show first question
        showQuestion(currentQuestion);
        
        // Start timer
        startTimer();
    }
    
    // Function to show a question
    function showQuestion(index) {
        // Update question counter
        questionCounter.textContent = `Question ${index + 1}/${shuffledQuestions.length}`;
        
        // Update progress bar
        const progress = ((index + 1) / shuffledQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Show question
        const question = shuffledQuestions[index];
        questionText.textContent = question.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Add new options
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = i;
            optionElement.addEventListener('click', selectOption);
            optionsContainer.appendChild(optionElement);
        });
        
        // Reset timer
        resetTimer();
    }
    
    // Function to select an option
    function selectOption(e) {
        const selectedOption = e.target;
        const optionIndex = parseInt(selectedOption.dataset.index);
        
        // Remove previous selection and styles
        const options = optionsContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect', 'show-correct');
        });
        
        // Add current selection
        selectedOption.classList.add('selected');
        
        // Save user answer
        userAnswers[currentQuestion] = optionIndex;
        
        // Check if answer is correct
        const isCorrect = optionIndex === shuffledQuestions[currentQuestion].correctAnswer;
        
        // Mark answer visually
        if (isCorrect) {
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            // Show correct answer
            const correctOption = options[shuffledQuestions[currentQuestion].correctAnswer];
            correctOption.classList.add('show-correct');
        }
        
        // Disable clicking on other options
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Stop the timer
        clearInterval(timer);
        
        // Advance automatically after 2 seconds
        setTimeout(() => {
            if (currentQuestion < shuffledQuestions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                finishQuiz();
            }
        }, 2000);
    }
    
    // Function to start the timer
    function startTimer() {
        resetTimer();
    }
    
    // Function to update the timer
    function updateTimer() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Advance automatically to next question
            if (currentQuestion < shuffledQuestions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                finishQuiz();
            }
        }
    }
    
    // Function to reset the timer
    function resetTimer() {
        clearInterval(timer);
        timeLeft = 30;
        timerElement.textContent = timeLeft;
        timer = setInterval(updateTimer, 1000);
    }
    
    // Function to finish the quiz
    function finishQuiz() {
        clearInterval(timer);
        
        // Calculate score
        score = 0;
        for (let i = 0; i < shuffledQuestions.length; i++) {
            if (userAnswers[i] === shuffledQuestions[i].correctAnswer) {
                score++;
            }
        }
        
        // Show results
        showResults();
    }
    
    // Function to show results
    function showResults() {
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';
        
        // Calculate percentage
        const percentage = Math.round((score / shuffledQuestions.length) * 100);
        
        // Update result elements
        scorePercentage.textContent = `${percentage}%`;
        correctAnswers.textContent = score;
        
        // Feedback message based on score
        let message = '';
        if (percentage >= 90) {
            message = 'Excellent! You are an expert in the history of electronics!';
        } else if (percentage >= 70) {
            message = 'Very good! You know the history of electronics well.';
        } else if (percentage >= 50) {
            message = 'Good job! You have basic knowledge about the subject.';
        } else {
            message = 'Keep studying! The history of electronics is fascinating.';
        }
        
        feedbackMessage.textContent = message;
        
        // Show questions review
        showQuestionsReview();
    }
    
    // Function to show questions review
    function showQuestionsReview() {
        reviewContainer.innerHTML = '';
        
        shuffledQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            const reviewQuestion = document.createElement('div');
            reviewQuestion.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;
            
            let reviewHTML = `
                <div class="review-question-text">${index + 1}. ${question.question}</div>
                <div class="review-options">
            `;
            
            question.options.forEach((option, i) => {
                let optionClass = 'review-option';
                
                if (i === question.correctAnswer) {
                    optionClass += ' correct-answer';
                }
                
                if (i === userAnswer) {
                    optionClass += ` user-answer ${isCorrect ? 'correct' : 'incorrect'}`;
                }
                
                reviewHTML += `<div class="${optionClass}">${option}</div>`;
            });
            
            reviewHTML += `
                </div>
                <div class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
            `;
            
            reviewQuestion.innerHTML = reviewHTML;
            reviewContainer.appendChild(reviewQuestion);
        });
    }
    
    // Function to restart the quiz
    function restartQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        score = 0;
        
        quizResults.style.display = 'none';
        quizIntro.style.display = 'block';
    }
});