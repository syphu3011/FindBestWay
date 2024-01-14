function randomOnRange(from, to) {
    let rand = 0
    do {
        rand = Math.floor(Math.random() * to)
    }
    while (rand < from)
    return rand
}
module.exports = {randomOnRange}