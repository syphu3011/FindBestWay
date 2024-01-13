const Character = require("./Character")
const Position = require("./Position")

function User(id, name, coin, numberCharacter) {
    this.id = id
    this.name = name 
    this.coin = coin
    this.numberCharacter = numberCharacter
    this.listChar = []
    for (let i = 0; i < this.numberCharacter; i++) {
        this.listChar.push(new Character(this, 1,1,new Position(0,0)))
    }
}
module.exports = User