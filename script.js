// 1. БИБЛИОТЕКА (puzzle - начальное, solution - правильное)
const allBoards = {
    "2026-07-13": {
        puzzle: [[5,3,0,0,7,0,0,0,0], [6,0,0,1,9,5,0,0,0], [0,9,8,0,0,0,0,6,0], [8,0,0,0,6,0,0,0,3], [4,0,0,8,0,3,0,0,1], [7,0,0,0,2,0,0,0,6], [0,6,0,0,0,0,2,8,0], [0,0,0,4,1,9,0,0,5], [0,0,0,0,8,0,0,7,9]],
        solution: [[5,3,4,6,7,8,9,1,2], [6,7,2,1,9,5,3,4,8], [1,9,8,3,4,2,5,6,7], [8,5,9,7,6,1,4,2,3], [4,2,6,8,5,3,7,9,1], [7,1,3,9,2,4,8,5,6], [9,6,1,5,3,7,2,8,4], [2,8,7,4,1,9,6,3,5], [3,4,5,2,8,6,1,7,9]]
    }
};

const today = new Date().toISOString().split('T')[0];
const boardData = allBoards[today] || allBoards["2026-07-13"];
const board = boardData.puzzle;

// Инициализация
const savedDate = localStorage.getItem('sudokuDate');
if (savedDate !== today) {
    localStorage.removeItem('sudokuProgress');
    localStorage.setItem('sudokuDate', today);
}

const currentBoard = JSON.parse(localStorage.getItem('sudokuProgress')) || JSON.parse(JSON.stringify(board));

function createBoard() {
    const boardElement = document.getElementById('sudoku-board');
    if (!boardElement) return; // Защита, если мы на другой странице
    
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.createElement('input');
            input.type = 'number';
            
            if (currentBoard[row][col] !== 0) input.value = currentBoard[row][col];
            
            if (board[row][col] !== 0) {
                input.disabled = true;
                input.style.backgroundColor = '#f0f0f0';
            } else {
                input.addEventListener('input', function() {
                    if (this.value.length > 1) this.value = this.value.slice(0, 1);
                    const val = this.value ? parseInt(this.value) : 0;
                    currentBoard[row][col] = val;
                    localStorage.setItem('sudokuProgress', JSON.stringify(currentBoard));
                    updateScore();
                });
            }
            boardElement.appendChild(input);
        }
    }
    updateScore();
}

function updateScore() {
    let score = 0;
    const sol = boardData.solution;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            // ПРОВЕРКА: ячейка изначально была пустой (0) в исходном пазле,
            // но сейчас в ней стоит правильная цифра из решения
            if (board[r][c] === 0 && currentBoard[r][c] === sol[r][c]) {
                score += 10;
            }
        }
    }
    const scoreEl = document.getElementById('sudoku-score');
    if (scoreEl) scoreEl.innerText = score;
}

// Навигация
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
        document.querySelector(this.getAttribute('href') + '-view').classList.add('active');
    });
});

createBoard();