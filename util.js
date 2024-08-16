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
    let result = []
    let base = y * 10 + x
    result.push(base);
    if (x + 1 < 10) {
        let right = y * 10 + 1
        result.push(right);
    }
    if (x - 1 > -1) {
        let left = y * 10 - 1
        result.push(left);
    }
    if (y - 1 > -1) {
        let up = (y - 1) * 10 + x;
        result.push(up);

        if (x - 1 > -1) {
            let upLeft = (y - 1) * 10 + x - 1;
            result.push(upLeft);
        }

        if (x + 1 < 10) {
            let upRight = (y - 1) * 10 + x + 1;
            result.push(upRight);
        }

    }
    if (y + 1 < 10) {
        let down = (y + 1) * 10 + x;
        result.push(down);

        if (x - 1 > -1){
            let downLeft = (y + 1) * 10 + x - 1;
            result.push(downLeft);
        }

        if (x + 1 < 10) {
            let downRight = (y + 1) * 10 + x + 1;
            result.push(downRight);
        }

    }
    return result;
}

function switchScene(currentScene, nextScene) {
    currentScene.style.display = 'none';
    nextScene.style.display = 'block';
}