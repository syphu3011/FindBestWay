const Position = require("./Position");
const { randomOnRange } = require("./util");

function randomPositionOnMatrix(matrix, listPosition = [new Position(0,0)]) {
    let position = new Position(0, 0)
    do {
        position.x = randomOnRange(1, matrix[0].length - 1)
        position.y = randomOnRange(1, matrix.length - 1)
    }
    while(!isValid(position, listPosition, matrix));
    return position
}
function isValid(position, listPosition, matrix) {
    if (matrix[position.y][position.x] == 1 || isRepeat(position, listPosition)) {
        return false
    }
    return true
}
function isRepeat(position, listPosition) {
    for(const pos of listPosition) {
        if (position.equals(pos)) {
            return true
        }
    }
    return false
}
module.exports = {randomPositionOnMatrix, isValid, isRepeat}