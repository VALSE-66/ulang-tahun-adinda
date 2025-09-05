// Atur bulan, tanggal, jam, dan menit ulang tahunmu di sini
const birthdayMonth = 8; // Bulan (0-11): 0 = Januari, 11 = Desember
const birthdayDay = 6;   // Tanggal (1-31)
const birthdayHour = 0;  // Jam ulang tahun (0-23)
const birthdayMinute = 0; // Menit ulang tahun (0-59)

// Elemen HTML
const introScreen = document.getElementById('intro-screen');
const thanksScreen = document.getElementById('thanks-screen');
const mainContainer = document.querySelector('.container'); // Kontainer utama untuk kuis, countdown, pesan
const optionsContainer = document.querySelector('.options');

// Tombol intro
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

const quizContainer = document.getElementById('quiz-container');
const countdownContainer = document.getElementById('countdown-container');
const messageElement = document.getElementById('message');

// Elemen pop-up
const popupWrapper = document.getElementById('popup-wrapper');
const popupMessage = document.getElementById('popup-message');

const questionText = document.getElementById('question-text');
const quizMessage = document.getElementById('quiz-message');

let currentQuestionIndex = 0;
let quizCompleted = false;
let countdownInterval;

// Soal-soal kuis pilihan ganda
const quizQuestions = [
    {
        question: "Berapa tanggal lahir Nency",
        options: ["28 juni 2007", "6 september 2006", "10 oktober 2006"],
        correctAnswer: "6 september 2006"
    },
    {
        question: "siapa artis kpop favorit Nency",
        options: ["Bang chan", "Hyunjin", "Jungkook"],
        correctAnswer: "Jungkook"
    },
    {
        question: "Apa nama marga Nency?",
        options: ["sitorus", "sinaga", "rajagukguk"],
        correctAnswer: "sitorus"
    }
];

// Fungsi untuk transisi layar dengan animasi
function transitionScreen(hideElement, showElement, callback) {
    if (hideElement && !hideElement.classList.contains('hidden')) {
        hideElement.classList.add('fade-out');
        hideElement.addEventListener('animationend', function handler() {
            hideElement.classList.add('hidden');
            hideElement.classList.remove('fade-out');
            hideElement.removeEventListener('animationend', handler);
            
            if (showElement) {
                showElement.classList.remove('hidden');
                showElement.classList.add('fade-in');
                showElement.addEventListener('animationend', function handler2() {
                    showElement.classList.remove('fade-in');
                    showElement.removeEventListener('animationend', handler2);
                    if (callback) callback();
                }, { once: true });
            } else if (callback) {
                callback();
            }
        }, { once: true });
    } else if (showElement) {
        showElement.classList.remove('hidden');
        showElement.classList.add('fade-in');
        showElement.addEventListener('animationend', function handler3() {
            showElement.classList.remove('fade-in');
            showElement.removeEventListener('animationend', handler3);
            if (callback) callback();
        }, { once: true });
    } else if (callback) {
        callback();
    }
}


// Event listener untuk tombol intro
yesBtn.addEventListener('click', () => {
    transitionScreen(introScreen, mainContainer, showContent);
});

noBtn.addEventListener('click', () => {
    transitionScreen(introScreen, thanksScreen);
});

// Fungsi untuk menampilkan pop-up dengan animasi
function showPopup(isCorrect) {
    if (isCorrect) {
        popupMessage.textContent = "Benar! 🎉";
        popupMessage.style.color = "var(--pixel-green)";
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        popupMessage.textContent = "Salah! 😔";
        popupMessage.style.color = "var(--pixel-red)";
    }

    popupWrapper.classList.remove('hidden');
    popupMessage.style.animation = 'popupIn 0.5s ease-out forwards';
    
    setTimeout(() => {
        popupMessage.style.animation = 'popupOut 0.5s ease-in forwards';
        popupMessage.addEventListener('animationend', function handler() {
            popupWrapper.classList.add('hidden');
            popupMessage.removeEventListener('animationend', handler);
        }, {once: true});
    }, 1500);
}

// Fungsi untuk menampilkan pertanyaan kuis
function showQuestion(questionIndex) {
    const questionData = quizQuestions[questionIndex];
    questionText.textContent = questionData.question;
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn', 'pixel-btn');
        button.textContent = option;
        button.dataset.answer = option;
        button.addEventListener('click', handleAnswerClick, { once: true });
        optionsContainer.appendChild(button);
    });
    quizMessage.textContent = '';
}

// Fungsi untuk menangani jawaban kuis
function handleAnswerClick(event) {
    const selectedAnswer = event.target.dataset.answer;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(button => button.disabled = true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
        event.target.classList.add('correct');
        showPopup(true);
        currentQuestionIndex++;
        
        setTimeout(() => {
            if (currentQuestionIndex < quizQuestions.length) {
                showQuestion(currentQuestionIndex);
            } else {
                quizMessage.textContent = "Kamu berhasil menjawab semua pertanyaan! Selamat 🎉";
                quizCompleted = true;
                setTimeout(() => {
                    transitionScreen(quizContainer, countdownContainer, startCountdown);
                }, 1500);
            }
        }, 1000);
    } else {
        event.target.classList.add('wrong');
        showPopup(false);
        setTimeout(() => {
            currentQuestionIndex = 0;
            showQuestion(currentQuestionIndex);
        }, 1500);
    }
}

// Fungsi utama untuk menampilkan konten
function showContent() {
    if (!quizCompleted) {
        quizContainer.classList.remove('hidden');
        countdownContainer.classList.add('hidden');
        messageElement.classList.add('hidden');
        showQuestion(currentQuestionIndex);
    } else {
        transitionScreen(quizContainer, countdownContainer, startCountdown);
    }
}

function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}


// Fungsi hitungan mundur
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const actualBirthday = new Date(currentYear, birthdayMonth, birthdayDay, birthdayHour, birthdayMinute, 0);

    let nextBirthday = new Date(currentYear, birthdayMonth, birthdayDay, birthdayHour, birthdayMinute, 0);
    if (now > nextBirthday) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    const timeUntilBirthday = nextBirthday.getTime() - now.getTime();
    
    const timeToDisplayMessage = 24 * 60 * 60 * 1000;
    const birthdayHasPassed = now.getTime() >= actualBirthday.getTime();
    const messageDisplayedTime = localStorage.getItem('birthdayMessageTimestamp');
    
    if (birthdayHasPassed && (now.getTime() - actualBirthday.getTime() < timeToDisplayMessage)) {
        clearInterval(countdownInterval);
        transitionScreen(countdownContainer, messageElement);
        localStorage.setItem('birthdayMessageTimestamp', now.getTime().toString());
    } 
    else if (messageDisplayedTime && (now.getTime() - parseInt(messageDisplayedTime) >= timeToDisplayMessage)) {
        localStorage.removeItem('birthdayMessageTimestamp');
        transitionScreen(null, countdownContainer);
    } 
    else {
        if (timeUntilBirthday <= 0) {
            clearInterval(countdownInterval);
            transitionScreen(countdownContainer, messageElement);
            localStorage.setItem('birthdayMessageTimestamp', now.getTime().toString());
        } else {
            const days = Math.floor(timeUntilBirthday / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeUntilBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilBirthday % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeUntilBirthday % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        }
    }
}

// Inisiasi awal: Sembunyikan semua kecuali layar intro
mainContainer.classList.add('hidden');
thanksScreen.classList.add('hidden');
popupWrapper.classList.add('hidden');

// Tambahkan library confetti
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
document.body.appendChild(script);

// Fungsi untuk memberikan random delay pada animasi partikel
document.querySelectorAll('.pixel-background div').forEach((div, index) => {
    const delay = (Math.random() * 15) + 's';
    const duration = (Math.random() * 10 + 10) + 's';
    const scale = (Math.random() * 0.5 + 0.5);
    div.style.animationDelay = delay;
    div.style.animationDuration = duration;
    div.style.setProperty('--scale', scale);
    div.style.top = Math.random() * 100 + '%';
    div.style.left = Math.random() * 100 + '%';
});