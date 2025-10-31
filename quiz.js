document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
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
    
    // Variáveis do quiz
    let currentQuestion = 0;
    let userAnswers = [];
    let score = 0;
    let timer;
    let timeLeft = 30;
    let shuffledQuestions = [];
    
    // Perguntas do quiz
    const quizQuestions = [
        {
            question: "Em que ano foi inventado o Telautograph, um dos primeiros dispositivos de transmissão de imagens?",
            options: ["1886", "1888", "1893", "1897"],
            correctAnswer: 1
        },
        {
            question: "Quem inventou a Válvula-Diodo, um componente fundamental para o desenvolvimento da eletrônica?",
            options: ["John Ambrose Fleming", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
            correctAnswer: 0
        },
        {
            question: "Em que ano a IBM foi fundada?",
            options: ["1911", "1924", "1903", "1897"],
            correctAnswer: 1
        },
        {
            question: "Qual foi a invenção de 1897 que se tornou a base para os monitores de televisão e computador por décadas?",
            options: ["Telautograph", "Telegraphone", "Monitor CRT", "Calculadora Analógica"],
            correctAnswer: 2
        },
        {
            question: "O que é um 'Flip-Flop' no contexto da eletrônica?",
            options: ["Um tipo de válvula termiônica", "Um circuito biestável", "Um dispositivo de gravação magnética", "Um tipo de display"],
            correctAnswer: 1
        },
        {
            question: "Qual empresa foi formada em 1911 através da fusão de três empresas e mais tarde se tornou a IBM?",
            options: ["CTR Company", "Burroughs Corporation", "General Electric", "Western Electric"],
            correctAnswer: 0
        },
        {
            question: "Em que ano foi descoberto o Cristal Líquido (LCD), que mais tarde se tornaria a base para telas planas?",
            options: ["1888", "1904", "1913", "1924"],
            correctAnswer: 1
        },
        {
            question: "Qual dispositivo, inventado em 1898, foi um precursor dos gravadores de fita magnética?",
            options: ["Telautograph", "Telegraphone", "Monitor CRT", "Calculadora Analógica"],
            correctAnswer: 1
        },
        {
            question: "Quem desenvolveu as Calculadoras Analógicas em 1893?",
            options: ["Leonardo Torres y Quevedo", "William S. Burroughs", "John Ambrose Fleming", "Percy Ludgate"],
            correctAnswer: 0
        },
        {
            question: "Qual invenção de 1918 é considerada fundamental para o desenvolvimento da memória de computador?",
            options: ["Válvula-Diodo", "Flip-Flop", "Monitor CRT", "Telegraphone"],
            correctAnswer: 1
        }
    ];
    
    // Embaralhar as perguntas
    function shuffleQuestions() {
        shuffledQuestions = [...quizQuestions];
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }
    }
    
    // Iniciar o quiz
    startQuizBtn.addEventListener('click', startQuiz);
    
    // Reiniciar quiz
    restartQuizBtn.addEventListener('click', restartQuiz);
    
    // Função para iniciar o quiz
    function startQuiz() {
        quizIntro.style.display = 'none';
        quizContent.style.display = 'block';
        
        // Embaralhar perguntas
        shuffleQuestions();
        
        // Inicializar array de respostas do usuário
        userAnswers = new Array(shuffledQuestions.length).fill(null);
        currentQuestion = 0;
        
        // Mostrar primeira pergunta
        showQuestion(currentQuestion);
        
        // Iniciar timer
        startTimer();
    }
    
    // Função para mostrar uma pergunta
    function showQuestion(index) {
        // Atualizar contador de perguntas
        questionCounter.textContent = `Pergunta ${index + 1}/${shuffledQuestions.length}`;
        
        // Atualizar barra de progresso
        const progress = ((index + 1) / shuffledQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Mostrar pergunta
        const question = shuffledQuestions[index];
        questionText.textContent = question.question;
        
        // Limpar opções anteriores
        optionsContainer.innerHTML = '';
        
        // Adicionar novas opções
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = i;
            optionElement.addEventListener('click', selectOption);
            optionsContainer.appendChild(optionElement);
        });
        
        // Reiniciar timer
        resetTimer();
    }
    
    // Função para selecionar uma opção
    function selectOption(e) {
        const selectedOption = e.target;
        const optionIndex = parseInt(selectedOption.dataset.index);
        
        // Remover seleção anterior e estilos
        const options = optionsContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect', 'show-correct');
        });
        
        // Adicionar seleção atual
        selectedOption.classList.add('selected');
        
        // Salvar resposta do usuário
        userAnswers[currentQuestion] = optionIndex;
        
        // Verificar se a resposta está correta
        const isCorrect = optionIndex === shuffledQuestions[currentQuestion].correctAnswer;
        
        // Marcar visualmente a resposta
        if (isCorrect) {
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            // Mostrar a resposta correta
            const correctOption = options[shuffledQuestions[currentQuestion].correctAnswer];
            correctOption.classList.add('show-correct');
        }
        
        // Desabilitar clique em outras opções
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Parar o timer
        clearInterval(timer);
        
        // Avançar automaticamente após 2 segundos
        setTimeout(() => {
            if (currentQuestion < shuffledQuestions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                finishQuiz();
            }
        }, 2000);
    }
    
    // Função para iniciar o timer
    function startTimer() {
        resetTimer();
    }
    
    // Função para atualizar o timer
    function updateTimer() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Avançar automaticamente para a próxima pergunta
            if (currentQuestion < shuffledQuestions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                finishQuiz();
            }
        }
    }
    
    // Função para resetar o timer
    function resetTimer() {
        clearInterval(timer);
        timeLeft = 30;
        timerElement.textContent = timeLeft;
        timer = setInterval(updateTimer, 1000);
    }
    
    // Função para finalizar o quiz
    function finishQuiz() {
        clearInterval(timer);
        
        // Calcular pontuação
        score = 0;
        for (let i = 0; i < shuffledQuestions.length; i++) {
            if (userAnswers[i] === shuffledQuestions[i].correctAnswer) {
                score++;
            }
        }
        
        // Mostrar resultados
        showResults();
    }
    
    // Função para mostrar resultados
    function showResults() {
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';
        
        // Calcular porcentagem
        const percentage = Math.round((score / shuffledQuestions.length) * 100);
        
        // Atualizar elementos de resultado
        scorePercentage.textContent = `${percentage}%`;
        correctAnswers.textContent = score;
        
        // Mensagem de feedback baseada na pontuação
        let message = '';
        if (percentage >= 90) {
            message = 'Excelente! Você é um expert na história da eletrônica!';
        } else if (percentage >= 70) {
            message = 'Muito bom! Você conhece bem a história da eletrônica.';
        } else if (percentage >= 50) {
            message = 'Bom trabalho! Você tem um conhecimento básico sobre o assunto.';
        } else {
            message = 'Continue estudando! A história da eletrônica é fascinante.';
        }
        
        feedbackMessage.textContent = message;
        
        // Mostrar revisão das questões
        showQuestionsReview();
    }
    
    // Função para mostrar revisão das questões
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
                    ${isCorrect ? '✓ Correto' : '✗ Incorreto'}
                </div>
            `;
            
            reviewQuestion.innerHTML = reviewHTML;
            reviewContainer.appendChild(reviewQuestion);
        });
    }
    
    // Função para reiniciar o quiz
    function restartQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        score = 0;
        
        quizResults.style.display = 'none';
        quizIntro.style.display = 'block';
    }
});