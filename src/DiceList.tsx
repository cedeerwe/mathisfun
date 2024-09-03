import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";
import { db, Die, Game, Schema } from "./db";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { id, tx } from "@instantdb/react";
import { NewDice, useLocalState } from "./state";

export const DiceList: React.FC<{
  game: Game;
  dice: Die[];
}> = ({ game, dice }) => {
  const newDice = useLocalState((state) => state.gameScreen[game.id].newDice);
  const setNewDiceName = useLocalState((state) => state.setNewDiceName);
  const setNewDiceValues = useLocalState((state) => state.setNewDiceValue);
  const initNewDice = useLocalState((state) => state.initNewDice);
  const nullNewDice = useLocalState((state) => state.nullNewDice);

  const allDiceNames = new Set([...dice.map((d) => d.name)]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Name</TableCell>
          {[...Array(game.dieSides).keys()].map((i) => (
            <TableCell key={i}>Side {i + 1}</TableCell>
          ))}
          {/* <TableCell>Id</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {dice.map(({ id: diceId, name, values }) => (
          <TableRow key={diceId}>
            <TableCell>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  db.transact(tx.dice[diceId].delete());
                }}
              >
                <ClearIcon />
              </Button>
            </TableCell>
            <TableCell>{name}</TableCell>
            {values.map((value, i) => (
              <TableCell key={i}>{value}</TableCell>
            ))}
            {/* <TableCell>{diceId}</TableCell> */}
          </TableRow>
        ))}
        {newDice === null ? (
          <TableRow>
            <TableCell>
              <Button
                variant="contained"
                color="success"
                onClick={() => initNewDice(game.id, game.dieSides)}
              >
                <AddIcon />
              </Button>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell>
              <Stack sx={{ alignItems: "center" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!validateNewDice(newDice, game, allDiceNames)}
                  onClick={() => {
                    db.transact(
                      tx.dice[id()]
                        .update({
                          name: newDice.name,
                          values: newDice.values,
                          gameId: game.id,
                        })
                        .link({ games: game.id })
                    );
                    nullNewDice(game.id);
                  }}
                >
                  <CheckIcon />
                </Button>
                {validateDiceValues(newDice.values, game) ? (
                  ""
                ) : (
                  <Box sx={{ color: "red", fontSize: 13 }}>
                    sum != {game.dieSum}
                  </Box>
                )}
              </Stack>
            </TableCell>
            <TableCell>
              <TextField
                value={newDice.name}
                onChange={(e) => setNewDiceName(e.target.value, game.id)}
                error={
                  !validateDiceName(newDice.name) ||
                  allDiceNames.has(newDice.name)
                }
                helperText={
                  !validateDiceName(newDice.name)
                    ? "has to be non-empty"
                    : allDiceNames.has(newDice.name)
                    ? "has to be unique"
                    : ""
                }
              />
            </TableCell>
            {[...Array(game.dieSides).keys()].map((i) => (
              <TableCell key={i}>
                <TextField
                  value={newDice.values[i]}
                  onChange={(e) => setNewDiceValues(e.target.value, game.id, i)}
                  error={!validateNewDice(newDice, game, allDiceNames)}
                  slotProps={{
                    htmlInput: {
                      step: 1,
                      min: 0,
                      type: "number",
                    },
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

function validateNewDice(
  newDice: NewDice,
  game: Schema["games"],
  allDice: Set<string>
): boolean {
  return (
    validateDiceName(newDice.name) &&
    !allDice.has(newDice.name) &&
    validateDiceValues(newDice.values, game)
  );
}

function validateDiceName(value: string): boolean {
  return value !== "";
}

function validateDiceValues(values: string[], game: Schema["games"]): boolean {
  try {
    const numValues = values.map((x) => parseInt(x));
    const sumSides = numValues.reduce((a, b) => a + b, 0);
    return numValues.length === game.dieSides && sumSides === game.dieSum;
  } catch {
    return false;
  }
}
