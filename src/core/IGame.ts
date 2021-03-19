interface IGame {
    input?(keyCode: number): void;
    update(time: number): void;
}

export default IGame;