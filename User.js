const Character = require("./Character")
const Position = require("./Position")
const { randomOnRange } = require("./util")

function User(id, name, coin, numberCharacter, socketId) {
    this.id = id
    this.name = name 
    this.coin = coin
    this.numberCharacter = numberCharacter
    this.socketId = socketId
    this.listChar = []
    for (let i = 0; i < this.numberCharacter; i++) {
        this.listChar.push(new Character(this, randomOnRange(1,5),1,new Position(0,0)))
    }
}
module.exports = User