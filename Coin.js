const Character = require("./Character")
const Position = require("./Position")
function Coin(position = new Position(0,0)) {
    this.position = position
    this.character = []
    this.cost = 0
}
module.exports = Coin