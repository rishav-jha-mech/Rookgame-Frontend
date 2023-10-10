// gameSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStateType } from "../hooks/game";
import { kYellow } from "../chalk";

const initialState: GameStateType = {
  gameId: undefined,
  rookCol: 7,
  rookRow: 0,
  timeLeft: 0,
  playerTurn: false,
  player1: {
    socketId: "",
    playerName: "",
  },
  player2: {
    socketId: "",
    playerName: "",
  },
  isGameStarted: false,
  isGameOver: false,
  winner: undefined,
  reason: undefined,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGameState: (state, action: PayloadAction<GameStateType>) => {
      kYellow({REDUX_PAYLOAD: action, result : { ...action.payload }})
      return { ...action.payload };
    },
  },
});

export const { updateGameState } = gameSlice.actions;
export default gameSlice.reducer;
