const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const messageElement = document.getElementById('message');
const gameBoard = document.getElementById('game-board');
const totalScoreElement = document.getElementById('total-score');
const upgradeButton = document.getElementById('upgrade-button');
const mobileControls = document.getElementById('mobile-controls');
let currentArrow;
let score = 0;
let all_score = parseInt(localStorage.getItem('all_score')) || 0;
let score_per_tap = parseInt(localStorage.getItem('score_per_tap')) || 1;

// Обновляем отображение общего счёта на странице
totalScoreElement.textContent = all_score;

function getRandomArrow() {
    return arrows[Math.floor(Math.random() * arrows.length)];
}

function getRandomPosition() {
    const x = Math.floor(Math.random() * (window.innerWidth - 100));
    const y = Math.floor(Math.random() * (window.innerHeight - 100));
    return { x, y };
}

function createArrowItem(arrow) {
    const arrowItem = document.createElement('div');
    arrowItem.classList.add('arrow-item');
    arrowItem.textContent = arrowSymbol(arrow);
    const x = 50;
    const y = 50;
    arrowItem.style.left = `${x}px`;
    arrowItem.style.top = `${y}px`;
    gameBoard.appendChild(arrowItem);

    setTimeout(() => {
        if (gameBoard.contains(arrowItem)) {
            arrowItem.remove();
            gameOver();
        }
    }, 2000);
}

function arrowSymbol(arrow) {
    switch (arrow) {
        case 'ArrowLeft':
            return '←';
        case 'ArrowRight':
            return '→';
        case 'ArrowUp':
            return '↑';
        case 'ArrowDown':
            return '↓';
        default:
            return '';
    }
}

function displayNewArrow() {
    currentArrow = getRandomArrow();
    createArrowItem(currentArrow);
}

function gameOver() {
    messageElement.textContent = `Вы проиграли! Ваш счёт: ${score}. Общий счёт: ${all_score}`;
    setTimeout(() => {
        messageElement.textContent = 'Нажмите стрелочку!';
        score = 0;
        gameBoard.innerHTML = '';
        displayNewArrow();
    }, 2000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('keydown', (event) => {
    if (event.key === currentArrow) {
        async function key() {
            document.body.style.backgroundColor = 'red';
            score += score_per_tap;
            all_score += score_per_tap;
            localStorage.setItem('all_score', all_score); // Сохраняем общий счёт
            messageElement.textContent = `Счёт: ${score}`;
            gameBoard.innerHTML = '';
            totalScoreElement.textContent = all_score; // Обновляем общий счёт на экране
            displayNewArrow();   
            await sleep(15);
            document.body.style.backgroundColor = 'black';
        }
        key();
    } else {
        gameOver();
    }
});

upgradeButton.addEventListener('click', () => {
    if (all_score >= 100) {
        all_score -= 100;
        score_per_tap++;
        localStorage.setItem('all_score', all_score); // Сохраняем общий счёт
        localStorage.setItem('score_per_tap', score_per_tap); // Сохраняем прибыль за тап
        totalScoreElement.textContent = all_score; // Обновляем общий счёт на экране
        alert(`Прибыль за нажатие увеличена до ${score_per_tap}!`);
    } else {
        alert('Недостаточно общего счёта для улучшения!');
    }
});

// Проверка устройства пользователя
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    mobileControls.style.display = 'flex'; // Показываем кнопки управления на мобильных устройствах
    document.getElementById('left-button').addEventListener('click', () => simulateKeyPress('ArrowLeft'));
    document.getElementById('up-button').addEventListener('click', () => simulateKeyPress('ArrowUp'));
    document.getElementById('right-button').addEventListener('click', () => simulateKeyPress('ArrowRight'));
    document.getElementById('down-button').addEventListener('click', () => simulateKeyPress('ArrowDown'));
}

function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(event);
}

displayNewArrow();
