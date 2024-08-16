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
    let excludedCells = getExcludedCells(firstX, firstY);
    console.log(excludedCells)
}

function getExcludedCells(x, y) {
    const size = 10;
    const result = [];

    function isValid(x, y) {
        return x >= 0 && x < size && y >= 0 && y < size;
    }

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

    offsets.forEach(({dx, dy}) => {
        const newX = x + dx;
        const newY = y + dy;
        if (isValid(newX, newY)) {
            result.push(newY * size + newX);
        }
    });

    return result;
}

function switchScene(currentScene, nextScene) {
    currentScene.style.display = 'none';
    nextScene.style.display = 'block';
}