import { init } from "@instantdb/react";

// ID for app: mathgames
const APP_ID = "1a3ce19d-4769-437e-8676-d1984f8ce446";

// Optional: Declare your schema for intellisense!
export type Schema = {
  games: {
    name: string;
    dieSides: number;
    dieSum: number;
  };
  dice: {
    name: string;
    gameId: string;
    values: number[];
  };
};

export type Game = Schema["games"] & { id: string };
export type Die = Schema["dice"] & { id: string };

export const db = init<Schema>({ appId: APP_ID });
