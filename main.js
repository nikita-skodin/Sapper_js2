const fieldSize = 10;
const table = document.getElementById('game-table');
const buttonRestart = document.getElementById('restart-button');
const buttonFlag = document.getElementById('flag-button');
const offsets = [
    {dx: 0, dy: 0},    // Self
    {dx: 1, dy: 0},    // Right
    {dx: -1, dy: 0},   // Left
    {dx: 0, dy: -1},   // Up
    {dx: 1, dy: -1},   // Up-right
    {dx: -1, dy: -1},  // Up-left
    {dx: 0, dy: 1},    // Down
    {dx: 1, dy: 1},    // Down-right
    {dx: -1, dy: 1}    // Down-left
];

let isFlag = false;
let emptyCellCount = 100 - 10
let inGame = false;
let dataArray;
window.emptyCellCounter = 0

document.addEventListener('DOMContentLoaded', () => {
    initEmptyTable(table, fieldSize);

    table.addEventListener('click', (event) => {

        if (window.isGameOver) {
            return;
        }

        const target = event.target;
        if (target.tagName === 'DIV' && target.parentElement.tagName === 'TD') {
            const rowIndex = target.parentElement.parentElement.rowIndex;
            const cellIndex = target.parentElement.cellIndex;

            if (inGame) {
                openCell(table, target, dataArray, rowIndex, cellIndex)
            } else {
                startGame(cellIndex, rowIndex);
                inGame = true;
                openField(table, dataArray, rowIndex, cellIndex);
                openCell(table, target, dataArray, rowIndex, cellIndex) // убрать после реализации метода выше
            }

        }
    })
    buttonRestart.addEventListener('click', (event) => {
        const rows = table.getElementsByTagName('tr');

        while (rows.length > 0) {
            table.deleteRow(0);
        }

        initEmptyTable(table, fieldSize);
        window.isGameOver = false
        inGame = false
        window.emptyCellCounter = 0
        buttonFlag.style.backgroundColor = '#333'
    })

    buttonFlag.addEventListener('click', (event) => {
        if (buttonFlag.style.backgroundColor !== 'yellow') {
            buttonFlag.style.backgroundColor = 'yellow'
            isFlag = true
        } else if (buttonFlag.style.backgroundColor === 'yellow') {
            buttonFlag.style.backgroundColor = '#333'
            isFlag = false
        }
    })

});

function startGame(firstX, firstY) {
    dataArray = initGameTable(table, fieldSize, firstX, firstY);
    console.log(dataArray)
}

function initEmptyTable(table, fieldSize) {
    for (let i = 0; i < fieldSize; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < fieldSize; j++) {
            const cell = document.createElement('td');
            const div = document.createElement('div');
            div.className = 'square';
            cell.appendChild(div);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function initGameTable(table, fieldSize, firstX, firstY) {
    let excludedCells = getExcludedCells(fieldSize, firstX, firstY);
    return initDataArray(fieldSize, excludedCells)
}

function initDataArray(size, excludedCells) {
    let counter = 0
    let randomArray = getRandomIntArrExcluded(size, excludedCells)
    let array = []
    for (let i = 0; i < size; i++) {
        let nestedArray = []
        for (let j = 0; j < size; j++) {
            if (randomArray.includes(counter)) {
                nestedArray.push(true);
            } else {
                nestedArray.push(false);
            }
            counter++
        }
        array.push(nestedArray);
    }

    for (let i = 0; i < array.length; i++) {
        let next = array[i];
        for (let j = 0; j < next.length; j++) {
            let number = getBombsNumberAround(j, i, array);
            if (array[i][j] === false && number !== 0) {
                array[i][j] = number;
            }
        }
    }

    return array;
}

function openField(table, dataArray, rowIndex, cellIndex) {
    // TODO: реализовать логику открывания при первом нажатии
}

function openCell(table, target, dataArray, rowIndex, cellIndex) {
    const cell = dataArray[rowIndex][cellIndex];

    if (isFlag) {

        if (target.style.backgroundColor === 'yellow') {
            target.style.backgroundColor = '#d3d3d3'
        } else if (target.style.backgroundColor !== 'lightgreen') {
            target.style.backgroundColor = 'yellow'
        }

        buttonFlag.style.backgroundColor = '#333'
        isFlag = false
        return
    }

    if (target.style.backgroundColor === 'yellow') {
        return;
    }

    if (cell === true) {
        target.style.backgroundColor = 'red';
        colorAllBombs(table, dataArray)
        window.isGameOver = true;

    } else {
        if (target.style.backgroundColor !== 'lightgreen') {
            window.emptyCellCounter++
        }

        target.style.backgroundColor = 'lightgreen';
        if (cell.toString().match(/\d+/) !== null) {
            target.textContent = cell;
        }
        if (window.emptyCellCounter === emptyCellCount) {
            colorAllBombs(table, dataArray)
            window.isGameOver = true;
        }
    }
}

function colorAllBombs(table, arr) {
    let trs = getTrs();
    for (let x = 0; x < trs.length; x++) {
        let tds = trs[x].getElementsByTagName('td');
        for (let y = 0; y < tds.length; y++) {
            let div = tds[y].getElementsByTagName('div')[0];
            if (arr[x][y] === true && div.style.backgroundColor !== 'red') {
                div.style.backgroundColor = 'red';
            }
        }
    }
}

function getTrs() {
    const table = document.getElementById('game-table');
    return table.getElementsByTagName('tr');
}

function getRandomIntArrExcluded(elCount, excluded) {
    let arr = []
    while (arr.length < elCount) {
        let value = getRandomNumber(0, 99);
        if (!(arr.includes(value) || excluded.includes(value))) {
            arr.push(value);
        }
    }
    return arr
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getExcludedCells(size, x, y) {
    const result = [];

    offsets.forEach(({dx, dy}) => {
        const newX = x + dx;
        const newY = y + dy;
        if (isValid(newX, newY, size, size)) {
            result.push(newY * size + newX);
        }
    });

    return result;
}

function getBombsNumberAround(x, y, arr) {
    const rowsLength = arr.length;
    const colsLength = arr[0].length;
    let counter = 0;

    offsets.forEach(({dx, dy}) => {
        const newX = x + dx;
        const newY = y + dy;
        if (isValid(newX, newY, rowsLength, colsLength) && arr[newY][newX] === true) {
            counter++;
        }
    });

    return counter;
}

function isValid(x, y, xLength, yLength) {
    return x >= 0 && x < xLength && y >= 0 && y < yLength;
}