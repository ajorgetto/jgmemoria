let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let errors = 0;
let matches = 0;
let timer;
let timeElapsed = 0;
let currentPlayer = 1;
let scores = [0, 0];
let isTwoPlayers = false;

function startGame(mode) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    isTwoPlayers = mode === 'dupla';
    if (isTwoPlayers) {
        document.getElementById('turn').classList.remove('hidden');
        updateTurnDisplay();
    }
    initializeBoard();
    startTimer();
}

function initializeBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    cards = generateCards();
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.innerHTML = `<span class="hidden">${card}</span>`;
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
}

function generateCards() {
    let values = [];
    const numPairs = getCardCount() / 2;
    for (let i = 1; i <= numPairs; i++) {
        values.push(i);
    }
    return shuffle([...values, ...values]);
}

function getCardCount() {
    const difficulty = document.getElementById('difficulty').value;
    switch (difficulty) {
        case 'facil': return 6;
        case 'medio': return 12;
        case 'dificil': return 20;
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.querySelector('span').classList.remove('hidden');
    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    if (isMatch) {
        disableCards();
        matches++;
        checkWin();
    } else {
        unflipCards();
        errors++;
        updateErrorCount();
        if (isTwoPlayers) {
            switchTurn();
        }
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.querySelector('span').classList.add('hidden');
        secondCard.querySelector('span').classList.add('hidden');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateErrorCount() {
    document.getElementById('errors').textContent = `Erros: ${errors}`;
}

function updateTurnDisplay() {
    document.getElementById('turn').textContent = `Vez do Jogador ${currentPlayer}`;
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnDisplay();
}

function checkWin() {
    const totalMatches = getCardCount() / 2;
    if (matches === totalMatches) {
        clearInterval(timer);
        setTimeout(() => alert(`Parabéns! Você venceu em ${timeElapsed} segundos com ${errors} erros.`), 500);
    }
}

function startTimer() {
    timeElapsed = 0;
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Tempo: ${formatTime(timeElapsed)}`;
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function resetGame() {
    clearInterval(timer);
    [errors, matches, timeElapsed] = [0, 0, 0];
    [firstCard, secondCard, lockBoard] = [null, null, false];
    currentPlayer = 1;
    scores = [0, 0];
    updateErrorCount();
    document.getElementById('timer').textContent = "Tempo: 00:00";
    if (isTwoPlayers) updateTurnDisplay();
    initializeBoard();
    startTimer();
}

function goBackToMenu() {
    clearInterval(timer);
    document.getElementById('game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    resetGame(); // Reseta o estado do jogo ao voltar para o menu
}
