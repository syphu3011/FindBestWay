const Position = require("./Position")
const Direction = require("./Direction")
const Character = require("./Character")
const Coin = require("./Coin")

let count = 0
function findBestWay(matrix, position = new Position(0, 0), target = new Position(0,0), direction, cost = 0, matrixChecked =[[]], road = []) {
    // check processing
    count += 1
    const _matrixChecked = matrixChecked
    _matrixChecked[position.y][position.x] = 1

    // end
    if (position.x == target.x && position.y == target.y) {
        _matrixChecked[position.y][position.x] = 0
        return {cost, road}
    }
    
    // check valid direction
    const up = checkUp(matrix, position, direction)
    const down = checkDown(matrix, position, direction)
    const left = checkLeft(matrix, position, direction)
    const right = checkRight(matrix, position, direction)

    // push to stack: up, down, left, right
    let listAsync = []
    pushListAsync(matrix, up, target, Direction.DOWN,cost, _matrixChecked, listAsync, road)
    pushListAsync(matrix, down, target, Direction.UP,cost, _matrixChecked, listAsync, road)
    pushListAsync(matrix, left, target, Direction.RIGHT,cost, _matrixChecked, listAsync, road)
    pushListAsync(matrix, right, target, Direction.LEFT,cost, _matrixChecked, listAsync, road)

    // process move
    if (listAsync.length > 0) {
        // calc cost of next road
        let listCost= []
        for (const f of listAsync) {
            listCost.push(f())
        }

        // choose min cost
        let newCost = Math.pow(matrix.length, 2)
        let newRoad = []
        listCost.forEach((value) => {
            if (value && value.cost && value.cost < newCost) {
                newCost = value.cost
                newRoad = value.road
            }
        })
        _matrixChecked[position.y][position.x] = 0
        return newCost < 2500 ? {cost: newCost, road: newRoad} : false
    }
    
    // wrong path
    _matrixChecked[position.y][position.x] = 0
    return false
}

function findFastWay(matrix, position = new Position(0, 0), target = new Position(0,0), direction, cost = 0, road = []) {
    // check processing
    count += 1
    const _matrixChecked = matrix
    _matrixChecked[position.y][position.x] = 1

    // end
    if (position.x == target.x && position.y == target.y) {
        _matrixChecked[position.y][position.x] = 0
        return {cost, road}
    }
    
    // check valid direction
    const up = checkUp(matrix, position, direction)
    const down = checkDown(matrix, position, direction)
    const left = checkLeft(matrix, position, direction)
    const right = checkRight(matrix, position, direction)

    // push to stack: up, down, left, right
    let listAsync = []
    pushListAsync(matrix, up, target, Direction.DOWN, cost, listAsync, road)
    pushListAsync(matrix, down, target, Direction.UP, cost, listAsync, road)
    pushListAsync(matrix, left, target, Direction.RIGHT, cost, listAsync, road)
    pushListAsync(matrix, right, target, Direction.LEFT, cost, listAsync, road)

    // process move
    if (listAsync.length > 0) {
        // calc cost of next road
        for (const f of listAsync) {
            const c = f()
            if (c && c.cost) {
                _matrixChecked[position.y][position.x] = 0
                return c
            }
        }
    }
    
    // wrong path
    _matrixChecked[position.y][position.x] = 0
    return false
}
function checkUp(matrix = [[]], position = new Position(0, 0), direction) {
    if (direction == Direction.UP) {
        return false
    }
    if (0 < position.y) {
        if (matrix[position.y - 1][position.x] == 0) {
            return position.Up()
        }
    }
    return false
}
function checkDown(matrix = [[]], position = new Position(0, 0), direction) {
    if (direction == Direction.DOWN) {
        return false
    }
    if (matrix.length > position.y + 1) {
        if (matrix[position.y + 1][position.x] == 0) {
            return position.Down()
        }
    }
    return false
}
function checkLeft(matrix=[[]], position = new Position(0, 0), direction) {
    if (direction == Direction.LEFT) {
        return false
    }
    if (0 < position.x) {
        if (matrix[position.y][position.x - 1] == 0) {
            return position.Left()
        }
    }
    return false
}

function checkRight(matrix=[[]], position = new Position(0, 0), direction) {
    if (direction == Direction.RIGHT) {
        return false
    }
    if (matrix[0].length > position.x + 1) {
        if (matrix[position.y][position.x + 1] == 0) {
            return position.Right()
        }
    }
    return false
}
function pushListAsync(matrix, newPos, target, direction, cost, listAsync, road) {
    if (newPos && matrix[newPos.y][newPos.x] == 0) {
        listAsync.push(() => {
            return findFastWay(matrix, newPos, target, direction, cost + 1, [...road, new Position(newPos.x, newPos.y)])
        })
    }
}


function main(matrix, position = new Position(0, 0), target = new Position(0,0), direction, cost = 0) {
    const rs = findFastWay(matrix, position, target, direction, cost)
    return rs
}
module.exports = main