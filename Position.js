function Position(x, y) {
    this.x = x;
    this.y = y;
    this.Up = () => {
        return new Position(this.x, this.y - 1)
    }
    this.Down = () => {
        return new Position(this.x, this.y + 1)
    }
    this.Left = () => {
        return new Position(this.x - 1, this.y)
    }
    this.Right = () => {
        return new Position(this.x + 1, this.y)
    }
    this.equals = (pos) => {
        if (this.x == pos.x && this.y == pos.y) {
            return true
        }
        return false
    }
}

module.exports = Position
