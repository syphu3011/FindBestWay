const {assignCharWithCoin, assignCoin} = require("./Assign")
const Character = require("./Character")
const Coin = require("./Coin")
const Position = require("./Position")
const mazeGenerator = require("./mazeGenerator")

function Game(user, widthMap = 50, heightMap = 30, io) {
    this.user = user
    this.map = initMap(widthMap / 2, heightMap / 2)
    this.listChar = initListChar(this.user, this.map)
    this.listCoin = initListCoin(this.user, 100, this.map)
    const self = this
    assignCharWithCoin(this.listChar,  this.listCoin, this.map)
    const newMap = changeMapWithCharAndCoin(this.listChar, this.listCoin, this.map)
    playingGame()
    function playingGame() {
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
                }
            })
            content += "</tr>"
            contentTable += content
        })
        contentTable += "</table>"
        io.emit("updateContent", contentTable)

        // logic game
        self.listChar.forEach((e) => {
            newMap[e.position.y][e.position.x] = 0
            e.move()
            if (newMap[e.position.y][e.position.x] == 4) {
                // Check collect coin
                for (const coin of self.listCoin) {
                    // check is valid to collect
                    if (coin.position.equals(e.position)) {
                        // remove coin
                        self.listCoin = self.listCoin.filter(c => c != coin)
                        // collect
                        e.takeCoin(coin)
                        if (self.listCoin.length == 0) {
                            self.listChar.forEach(e => {
                                e.road = []
                            })
                            return
                        }
                        // assign new
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
                        break
                    }
                }
            }
            newMap[e.position.y][e.position.x] = 3
        })

        // refresh every 100 ms
        setTimeout(playingGame, 100)
    }
}
function initMap(width, height) {
    return mazeGenerator(width, height).map
}
function initListChar(user, matrix) {
    const listPosition = []

    for (const char of user.listChar) {
        const position = randomPositionOnMatrix(matrix, listPosition)
        char.position = position 
        // matrix[position.y][position.x] = 3
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
        // matrix[position.y][position.x] = 4
    }
    return listCoin
}
function changeMapWithCharAndCoin(listChar, listCoin, matrix) {
    const newMatrix = [...(matrix.map(row => [...row]))]
    listChar.forEach(e => {
        const posChar = e.position
        newMatrix[posChar.y][posChar.x] = 3 
    })
    listCoin.forEach(e => {
        const posCoin = e.position
        newMatrix[posCoin.y][posCoin.x] = 4
    })
    return newMatrix
}
function randomPositionOnMatrix(matrix, listPosition = [new Position(0,0)]) {
    let position = new Position(0, 0)
    do {
        position.x = randomOnRange(1, matrix.length - 1)
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
function randomOnRange(from, to) {
    let rand = 0
    do {
        rand = Math.floor(Math.random() * to)
    }
    while (rand < from)
    return rand
}
module.exports = Game