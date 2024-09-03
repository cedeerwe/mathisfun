import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";
import { db } from "./db";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import ClearIcon from "@mui/icons-material/Clear";
import { id, tx } from "@instantdb/core";
import { NewGame, useLocalState } from "./state";

export const GameList: React.FC<unknown> = () => {
  const newGame = useLocalState((state) => state.newGame);
  const setNewGameName = useLocalState((state) => state.setNewGameName);
  const setNewGameDieSidesText = useLocalState(
    (state) => state.setNewGameDieSidesText
  );
  const setNewGameDieSumText = useLocalState(
    (state) => state.setNewGameDieSumText
  );
  const setActiveScreen = useLocalState((state) => state.setActiveScreen);
  const initializeGameDice = useLocalState((state) => state.initGameDice);

  const { isLoading, error, data } = db.useQuery({ games: {}, dice: {} });
  if (isLoading) {
    return <div>Fetching data...</div>;
  }
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }
  const { games, dice } = data;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Die Sides</TableCell>
          <TableCell>Die Sum</TableCell>
          {/* <TableCell>Id</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {games.map(({ id, name, dieSides, dieSum }, i) => (
          <TableRow key={i}>
            <TableCell>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  db.transact([
                    tx.games[id].delete(),
                    ...dice
                      .filter((d) => d.gameId === id)
                      .map((d) => tx.dice[d.id].delete()),
                  ]);
                }}
              >
                <ClearIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  initializeGameDice(id);
                  setActiveScreen({ type: "game", gameId: id });
                }}
              >
                <LoginIcon />
              </Button>
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{dieSides}</TableCell>
            <TableCell>{dieSum}</TableCell>
            {/* <TableCell>{id}</TableCell> */}
          </TableRow>
        ))}
        <TableRow>
          <TableCell>
            <Button
              variant="contained"
              color="success"
              disabled={!validateNewGame(newGame)}
              onClick={() => {
                const gameId = id();
                const dieSides = parseInt(newGame.dieSidesText); // validated already
                db.transact(
                  tx.games[gameId].update({
                    name: newGame.name,
                    dieSides,
                    dieSum: parseInt(newGame.dieSumText), // validated already
                  })
                );
              }}
            >
              <AddIcon />
            </Button>
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <TextField
              value={newGame.name}
              onChange={(e) => setNewGameName(e.target.value)}
              error={!validateNewGameName(newGame.name)}
              helperText={
                validateNewGameName(newGame.name) ? "" : "has to be non-empty"
              }
            />
          </TableCell>
          <TableCell>
            <TextField
              value={newGame.dieSidesText}
              onChange={(e) => setNewGameDieSidesText(e.target.value)}
              error={!validatePositiveInt(newGame.dieSidesText)}
              slotProps={{
                htmlInput: {
                  step: 1,
                  min: 1,
                  type: "number",
                },
              }}
            />
          </TableCell>
          <TableCell>
            <TextField
              value={newGame.dieSumText}
              onChange={(e) => setNewGameDieSumText(e.target.value)}
              error={!validatePositiveInt(newGame.dieSumText)}
              slotProps={{
                htmlInput: {
                  step: 1,
                  min: 1,
                  type: "number",
                },
              }}
            />
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

function validateNewGame(newGame: NewGame): boolean {
  return (
    validateNewGameName(newGame.name) &&
    validatePositiveInt(newGame.dieSidesText) &&
    validatePositiveInt(newGame.dieSumText)
  );
}

function validateNewGameName(value: string): boolean {
  return value !== "";
}

function validatePositiveInt(value: string): boolean {
  try {
    return parseInt(value) > 0;
  } catch {
    return false;
  }
}
