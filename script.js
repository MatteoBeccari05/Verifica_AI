// Funzione per salvare la risposta nel localStorage
function saveAnswer(questionId, answer) {
    localStorage.setItem(questionId, answer);
}

// Funzione per caricare la risposta dal localStorage
function loadAnswer(questionId) {
    return localStorage.getItem(questionId) || ''; // Se non c'è una risposta salvata, ritorna una stringa vuota
}

// Funzione per avviare il timer
let timeLeft = localStorage.getItem('timeLeft') ? parseInt(localStorage.getItem('timeLeft')) : 60 * 60;
let timerDisplay = document.getElementById('timer');

// Funzione per aggiornare il timer ogni secondo
function startTimer() {
    let timerInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerHTML = "Tempo scaduto!";
        } else {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            timerDisplay.innerHTML = minutes + ":" + seconds;
            timeLeft--;
            localStorage.setItem('timeLeft', timeLeft);
        }
    }, 1000);
}

// Avvia il timer se non è già partito
window.onload = function() {
    if (timeLeft > 0) {
        startTimer();
    }

    // Carica le risposte salvate nel localStorage per le domande testuali (textarea)
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
        const savedAnswer = loadAnswer(textarea.id);
        if (savedAnswer) {
            textarea.value = savedAnswer;
        }

        // Salva la risposta nel localStorage mentre l'utente digita
        textarea.addEventListener('input', function() {
            saveAnswer(textarea.id, this.value); // Salva la risposta nel localStorage
        });
    });

    // Carica le risposte delle domande a scelta multipla (radio buttons)
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
        // Carica la risposta salvata, se presente
        if (loadAnswer(radio.name) === radio.value) {
            radio.checked = true;
        }

        radio.addEventListener('change', function() {
            saveAnswer(this.name, this.value); // Salva la risposta nel localStorage
        });
    });
};

// Funzione per raccogliere tutte le risposte dal localStorage e generare il file
function generaFileRisposte() {
    let risposte = '';

    // Definisci tutte le domande che vuoi raccogliere
    const domande = [
        { id: 'textarea-question1', label: 'Cos\'è un algoritmo in informatica?' },
        { id: 'textarea-question2', label: 'Cos\'è la "memoria RAM" in un computer?' },
        { id: 'textarea-question3', label: 'Cos\'è il "cloud computing"?' }
    ];

    // Raccogli le risposte per ogni domanda
    domande.forEach((domanda) => {
        let risposta = loadAnswer(domanda.id).trim();
        if (!risposta) {
            risposta = 'Nessuna risposta';
        }
        risposte += `${domanda.label}\nRisposta: ${risposta}\n\n`; // Aggiungi la risposta al testo
    });

    // Aggiungi le risposte delle domande del quiz1
    const quiz1Domande = [
        { name: 'q11', label: '1. Cosa significa "informatica"?' },
        { name: 'q21', label: '2. Quali sono alcuni dei principali settori dell\'informatica?' },
        { name: 'q31', label: '3. Qual è l\'obiettivo principale dell\'informatica?' },
        { name: 'q41', label: '4. In quale ambito l\'informatica ha influenzato maggiormente la vita quotidiana?' },
        { name: 'q51', label: '5. Cosa combina il termine "informatica"?' }
    ];

    quiz1Domande.forEach((domanda) => {
        const risposta = loadAnswer(domanda.name) || 'Nessuna risposta';
        risposte += `${domanda.label}\nRisposta: ${risposta}\n\n`;
    });

    // Aggiungi le risposte delle domande del quiz2
    const quiz2Domande = [
        { name: 'q12', label: '1. Cosa rappresenta una socket in informatica?' },
        { name: 'q22', label: '2. Qual è il principale protocollo utilizzato dalle socket per garantire una comunicazione affidabile?' },
        { name: 'q32', label: '3. Cosa identifica una socket su una rete?' },
        { name: 'q42', label: '4. In quale situazione un server crea una socket?' },
        { name: 'q52', label: '5. Qual è la differenza principale tra TCP e UDP nelle socket?' }
    ];

    quiz2Domande.forEach((domanda) => {
        const risposta = loadAnswer(domanda.name) || 'Nessuna risposta';
        risposte += `${domanda.label}\nRisposta: ${risposta}\n\n`;
    });

    // Crea un Blob con le risposte
    const blob = new Blob([risposte], { type: 'text/plain' });

    // Crea un link per il download del file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'risposte_verifica.txt'; // Nome del file di testo da scaricare

    // Clicca automaticamente sul link per scaricare il file
    link.click();
}

// Aggiungi l'evento per il tasto "Consegna"
document.getElementById('submitButton').addEventListener('click', function() {
    generaFileRisposte(); // Genera e scarica il file delle risposte
});

// Funzione per resettare il quiz
function resetQuiz() {
    // Ripristina il timer
    timeLeft = 60 * 60; // 1 ora
    localStorage.setItem('timeLeft', timeLeft);
    timerDisplay.innerHTML = "60:00"; // Imposta il timer a 1 ora
    startTimer(); // Avvia di nuovo il timer

    // Cancella le risposte dal localStorage
    localStorage.clear();

    // Ripristina tutte le risposte nel form
    const formElements = document.querySelectorAll('textarea, input[type="radio"]');
    formElements.forEach(el => {
        if (el.tagName === 'TEXTAREA') {
            el.value = '';
        } else if (el.type === 'radio') {
            el.checked = false;
        }
    });
}

// Aggiungi l'evento per il tasto "Reset"
document.getElementById('resetButton').addEventListener('click', resetQuiz);
