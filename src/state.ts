import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  activeScreen: ActiveScreen;
  newGame: NewGame;
  gameScreen: {
    [gameId: string]: { newDice: NewDice | null; goalScore: number };
  };
};

type Actions = {
  setActiveScreen: (value: ActiveScreen) => void;
  setNewGameName: (value: string) => void;
  setNewGameDieSidesText: (value: string) => void;
  setNewGameDieSumText: (value: string) => void;
  setNewDiceName: (value: string, gameId: string) => void;
  setNewDiceValue: (value: string, gameId: string, i: number) => void;
  initNewDice: (gameId: string, dieSides: number) => void;
  nullNewDice: (gameId: string) => void;
  initGameDice: (gameId: string) => void;
  setGoalScore: (value: number, gameId: string) => void;
};

type ActiveScreen = { type: "main" } | { type: "game"; gameId: string };
export type NewGame = {
  name: string;
  dieSidesText: string;
  dieSumText: string;
};
export type NewDice = {
  name: string;
  values: string[];
};

export const useLocalState = create<State & Actions>()(
  immer((set) => ({
    activeScreen: { type: "main" },
    newGame: {
      name: "myGame",
      dieSidesText: "6",
      dieSumText: "21",
    },
    gameScreen: {},

    setActiveScreen: (value: ActiveScreen): void =>
      set((state) => {
        state.activeScreen = value;
      }),
    setNewGameName: (value: string) =>
      set((state) => {
        state.newGame.name = value;
      }),
    setNewGameDieSidesText: (value: string) =>
      set((state) => {
        state.newGame.dieSidesText = value;
      }),
    setNewGameDieSumText: (value: string) =>
      set((state) => {
        state.newGame.dieSumText = value;
      }),
    setNewDiceName: (value: string, gameId: string) =>
      set((state) => {
        if (state.gameScreen[gameId].newDice != null) {
          state.gameScreen[gameId].newDice.name = value;
        }
      }),
    setNewDiceValue: (value: string, gameId: string, i: number) =>
      set((state) => {
        if (state.gameScreen[gameId].newDice != null) {
          state.gameScreen[gameId].newDice.values[i] = value;
        }
      }),
    initNewDice: (gameId: string, dieSides: number) =>
      set((state) => {
        state.gameScreen[gameId].newDice = {
          name: "",
          values: Array(dieSides).fill("0"),
        };
      }),
    nullNewDice: (gameId: string) =>
      set((state) => {
        state.gameScreen[gameId].newDice = null;
      }),
    setGoalScore: (value: number, gameId: string) =>
      set((state) => {
        state.gameScreen[gameId].goalScore = value;
      }),
    initGameDice: (gameId: string) =>
      set((state) => {
        if (state.gameScreen[gameId] === undefined)
          state.gameScreen[gameId] = {
            goalScore: 1,
            newDice: null,
          };
      }),
  }))
);
