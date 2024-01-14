function Wall(hp = 1, position) {
    this.hp = hp
    this.position = position
    this.beAttacked = (damage = 1) => {
        this.hp -= damage
    }
}
module.exports = Wall