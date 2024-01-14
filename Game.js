const {assignCharWithCoin, assignCoin} = require("./Assign")
const Character = require("./Character")
const Coin = require("./Coin")
const Position = require("./Position")
const { randomPositionOnMatrix } = require("./PositionUtils")
const Wall = require("./Wall")
const mazeGenerator = require("./mazeGenerator")

function Game(user, widthMap = 50, heightMap = 30, io) {
    this.user = user
    this.map = initMap(widthMap / 2, heightMap / 2)
    this.listChar = initListChar(this.user, this.map)
    this.listCoin = initListCoin(this.user, 100, this.map)
    this.listWall = initListWall(this.user, this.listCoin, 50, this.map)
    this.isActive = true
    const self = this
    assignCharWithCoin(this.listChar, this.listCoin, this.map)
    const newMap = changeMapWithCharAndCoin(this.listChar, this.listCoin, this.listWall, this.map)
    this.playingGame = () => {
        // set up
        let contentTable = `<table>`
        // let head = `<tr><td style="color: white"></td>`
        // for (let i = 0; i < newMap[0].length; i++) {
        //     head += `<td style="color: white">`+i+"</td>"
        // }
        // head += "</tr>"
        // contentTable += head

        // browse map and show game
        newMap.forEach((row, i) => {
            // let content = `<tr><td style="color: white">`+i+"</td>"
            let content = "<tr>"
            row.forEach(e => {
                switch (e) {
                    case 0: 
                        content += `<td style="color: green">+ `+"</td>"
                        break
                    case 1:
                        content += `<td style="color: red">+ `+"</td>"
                        break
                    case 3: 
                        content += `<td style="color: aqua">8 `+"</td>"
                        break
                    case 4: 
                        content += `<td style="color: yellow">0 `+"</td>"
                        break
                    default:
                        content += `<td style="color: orange">`+(e-5)+"</td>"
                        break
                }
            })
            content += "</tr>"
            contentTable += content
        })
        contentTable += "</table>"
        io.to(self.user.socketId).emit("updateContent", contentTable)
        next(self, newMap)
        // refresh every 100 ms
        if (self.isActive) {
            setTimeout(self.playingGame, 100)
        }
    }
    this.playingGame()
}

// init
function initMap(width, height) {
    return mazeGenerator(width, height).map
}
function initListChar(user, matrix) {
    const listPosition = []

    for (const char of user.listChar) {
        const position = randomPositionOnMatrix(matrix, listPosition)
        char.position = position 
        listPosition.push(position)
    }
    return user.listChar
}
function initListCoin(user, numberCoin, matrix) {
    const listPosition = user.listChar.map(e => e.position)
    const listCoin = []
    for (let i = 0; i < numberCoin; i++) {
        const position = randomPositionOnMatrix(matrix, listPosition)
        const coin = new Coin(position)
        listCoin.push(coin)
        listPosition.push(position)
    }
    return listCoin
}
function initListWall(user, listCoin, numberWall, matrix) {
    const listPosition = user.listChar.map(e => e.position)
    listPosition.push(...(listCoin.map(e => e.position)))
    const listWall = []
    for (let i = 0; i < numberWall; i++) {
        const position = randomPositionOnMatrix(matrix, listPosition)
        const wall = new Wall(10, position)
        listWall.push(wall)
        listPosition.push(position)
    }
    return listWall
}
function changeMapWithCharAndCoin(listChar, listCoin, listWall, matrix) {
    const newMatrix = [...(matrix.map(row => [...row]))]
    listChar.forEach(e => {
        const posChar = e.position
        newMatrix[posChar.y][posChar.x] = 3 
    })
    listCoin.forEach(e => {
        const posCoin = e.position
        newMatrix[posCoin.y][posCoin.x] = 4
    })
    listWall.forEach(e => {
        const posWall = e.position
        newMatrix[posWall.y][posWall.x] = 5 + e.hp
    })
    return newMatrix
}

// Game
function next(self, newMap) {
    // logic game
    self.listChar.forEach((e) => {
        move(e, self, newMap)
    })
}
function updateMap(newMap, char, value) {
    newMap[char.position.y][char.position.x] = value
}

function move(char, self, newMap) {
    let nextPos = null
    if (char.road.length > char.countMove) {
        nextPos = char.road[char.countMove]
    }
    if (nextPos) {
        if (newMap[nextPos.y][nextPos.x] > 5) {
            checkAndAttackWall(self, char, nextPos, newMap)
        }
        else {
            updateMap(newMap, char, 0)
            char.move()
            if (newMap[char.position.y][char.position.x] == 4) {
                // Check collect coin
                checkAndCollectCoin(self, char)
            }
            updateMap(newMap, char, 3)
        }
    }
}
function checkAndAttackWall(self, char, pos, newMap) {
    for (const wall of self.listWall) {
        // check is valid to attack
        if (wall.position.equals(pos)) {
            attackWall(char, wall, self, newMap)
            break
        }
    }
}
function attackWall(char, wall, self, newMap) {
    char.attack(wall)
    newMap[wall.position.y][wall.position.x] -= char.speed_atk
    if (wall.hp <= 0) {
        self.listWall = self.listWall.filter(e => e != wall)
        updateMap(newMap, char, 0)
    }
}
function checkAndCollectCoin(self, char) {
    for (const coin of self.listCoin) {
        // check is valid to collect
        if (coin.position.equals(char.position)) {
            // remove coin
            removeCoin(self, coin)
            // collect
            collectCoin(char, self, coin)
            // assign new
            assignNew(coin, char, self)
            break
        }
    }
}

function removeCoin(self, coin) {
    self.listCoin = self.listCoin.filter(c => c != coin)
}

function collectCoin(char, self, coin) {
    char.takeCoin(coin)
    if (self.listCoin.length == 0) {
        self.listChar.forEach(e => {
            e.road = []
        })
        return
    }
}

function assignNew(coin, e, self) {
    if (coin == e.coin) {
        assignCoin(e, self.listCoin, self.map)
    }
    else if (coin.character.length > 0){
        coin.character.forEach(ch => {
            if (ch != e) {
                ch.countMove = 0
                assignCoin(ch, self.listCoin, self.map)
            }
        })
    }
}
module.exports = Game