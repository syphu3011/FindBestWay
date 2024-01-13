const Position = require("./Position")
const User = require("./User")

function Character(user = new User(1,"sdf",29, 5), speed_atk = 1, speed_run = 1, position = new Position(0,0)) {
    this.speed_atk = speed_atk
    this.speed_run = speed_run
    this.position = position
    this.coin = null
    this.cost = 0
    this.road = []
    this.pastRoad = []
    this.countMove = 0
    this.countCoin = 0
    this.move = () => {
        if (this.road && this.road.length > this.countMove) {
            this.position = this.road[this.countMove]
            this.countMove += 1
        }
    }
    this.takeCoin = (coin) => {
        user.coin += 1
        this.pastPosCoin = coin.position
        if (this.coin == coin) {
            this.countMove = 0
        }
        this.countCoin += 1
    }
}
module.exports = Character