const fieldSize = 10;
const table = document.getElementById('game-table');
const scene1 = document.getElementById('scene1');
const scene2 = document.getElementById('scene2');

let inGame = false;
let dataArray;

document.addEventListener('DOMContentLoaded', () => {
    initEmptyTable(table, fieldSize);

    table.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'DIV' && target.parentElement.tagName === 'TD') {
            const rowIndex = target.parentElement.parentElement.rowIndex;
            const cellIndex = target.parentElement.cellIndex;

            if (!inGame){
                startGame(rowIndex, cellIndex);
            }

        }
    })

});

function startGame(firstX, firstY) {
    dataArray = initGameTable(table, fieldSize, firstX, firstY);
}

function stopGame() {

}