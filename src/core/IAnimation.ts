interface IAnimation {
    isCompleted: boolean;
    draw(animationTimeElapsed: number): void;
}

export default IAnimation;