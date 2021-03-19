class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    getVectorFromArgs(args) {
        if (args.length === 2) {
            return new Vector(args[0], args[1]);
        }
        if (typeof args[0] === 'number') {
            return new Vector(args[0], args[0]);
        }
        return args[0];
    }
    add() {
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    divide() {
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x / vector.x, this.y / vector.y);
    }
    multiply() {
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x * vector.x, this.y * vector.y);
    }
    subtract() {
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
}
export default Vector;
