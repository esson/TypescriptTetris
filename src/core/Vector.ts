class Vector {
    
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    private getVectorFromArgs(args: IArguments) {

        if (args.length === 2) {
            return new Vector(args[0], args[1]);
        }

        if (typeof args[0] === 'number') {
            return new Vector(args[0], args[0]);
        }

        return <Vector>args[0];
    }    
    
    public add(x: number, y: number): Vector;
    public add(xy: number): Vector;
    public add(vector: Vector): Vector;
    public add() {
        
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    public divide(x: number, y: number): Vector;
    public divide(xy: number): Vector;
    public divide(vector: Vector): Vector;
    public divide() {
        
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x / vector.x, this.y / vector.y);
    }

    public multiply(x: number, y: number): Vector;
    public multiply(xy: number): Vector;
    public multiply(vector: Vector): Vector;
    public multiply() {
        
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x * vector.x, this.y * vector.y);
    }

    public subtract(x: number, y: number): Vector;
    public subtract(xy: number): Vector;
    public subtract(vector: Vector): Vector;
    public subtract() {
        
        const vector = this.getVectorFromArgs(arguments);
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
}

export default Vector;