const findBestWay = require("./findBestWay")
function assignCharWithCoin(listChar = [Character], listCoin = [Coin], matrix =[[]]) {
    for (const e of listChar) {
        assignCoin(e, listCoin, matrix)
    }
}
function assignCoin(char = new Character(), listCoin = [new Coin()], matrix) {
    let min = 0
    let chooseCoin = null
    for(const coin of listCoin) {
        if (coin.character.length == 0) {
            const perfectCost = calcPerfectCost(coin.position, char.position)
            if (min == 0 || min > perfectCost) {
                min = perfectCost
                chooseCoin = coin
            }        
        }
    }
    if (!chooseCoin) {
        for(const coin of listCoin) {
            const perfectCost = calcPerfectCost(coin.position, char.position)
            if (min == 0 || min > perfectCost) {
                min = perfectCost
                chooseCoin = coin
            }        
        }
    }
    if (chooseCoin) {
        chooseCoin.character.push(char)
        const way = findBestWay(matrix, char.position, chooseCoin.position, null, 0)
        char.pastRoad = char.road
        char.road = way.road
        char.cost = way.cost
        chooseCoin.cost = way.cost
    }
    else {
        char.road = []
    }
    char.coin = chooseCoin
    return chooseCoin
}
function takeCoin(char, coin) {
    if (coin.character != char) {
        findNearestCoin(coin.character)
    }
}
function calcPerfectCost(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
}
module.exports = {assignCharWithCoin, assignCoin, takeCoin}