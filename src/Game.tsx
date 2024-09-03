import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { db } from "./db";
import { DashboardButton } from "./DashboardButton";
import { DiceList } from "./DiceList";
import { DiceFightTable } from "./DiceFightTable";

export const Game: React.FC<{ gameId: string }> = ({ gameId }) => {
  const { isLoading, error, data } = db.useQuery({
    games: {
      $: {
        where: {
          id: gameId,
        },
      },
    },
    dice: {
      $: {
        where: {
          gameId,
        },
      },
    },
  });
  if (isLoading) {
    return <div>Fetching data...</div>;
  }
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }
  const { games, dice } = data;

  if (games.length === 0) {
    return (
      <Box>
        <div>Game with the id {gameId} doesn't exist.</div>
        <DashboardButton />
      </Box>
    );
  }

  const game = games[0];

  return (
    <Stack>
      <Stack direction="row" spacing={5}>
        <DashboardButton />
        <Typography>Active Game ID: {gameId}</Typography>
      </Stack>
      <h2>Dice</h2>
      <DiceList game={game} dice={dice} />
      <h2>Fights</h2>
      <DiceFightTable dice={dice} gameId={game.id} />
    </Stack>
  );
};
