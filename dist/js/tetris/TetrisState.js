var TetrisState;
(function (TetrisState) {
    TetrisState[TetrisState["Start"] = 0] = "Start";
    TetrisState[TetrisState["Gameplay"] = 1] = "Gameplay";
    TetrisState[TetrisState["Paused"] = 2] = "Paused";
    TetrisState[TetrisState["Ended"] = 3] = "Ended";
})(TetrisState || (TetrisState = {}));
export default TetrisState;
