import React from "react";
import { Die } from "./db";
import { Box, Input, Slider, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useLocalState } from "./state";
import { winProbMatch } from "./math";
import { blue, red } from "@mui/material/colors";

export const DiceFightTable: React.FC<{ dice: Die[]; gameId: string }> = ({
  dice,
  gameId,
}) => {
  const goalScore = useLocalState(
    (state) => state.gameScreen[gameId].goalScore
  );
  const setGoalScore = useLocalState((state) => state.setGoalScore);

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "values", headerName: "Values" },
    ...dice.map(({ name }) => ({
      field: name,
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        const color = rdBuScale(params.value);
        return (
          <Box
            sx={{
              backgroundColor: color,
              width: "100%",
              height: "100%",
            }}
          >
            {`${(params.value * 100).toFixed(2)}%`}
          </Box>
        );
      },
    })),
    {
      field: "total",
      headerName: "Total",
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        const color = rdBuScale(
          (params.value - minResult) / (maxResult - minResult)
        );
        return (
          <Box
            sx={{
              backgroundColor: color,
              width: "100%",
              height: "100%",
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
  ] as GridColDef[]; // TODO

  const results = Object.fromEntries(
    dice.map((d) => [
      d.id,
      Object.fromEntries(
        dice.map((o) => [o.id, winScore(d.values, o.values, goalScore)])
      ),
    ])
  );

  const allDiceResults = Object.values(results).map((diceResults) =>
    Object.values(diceResults).reduce((a, b) => a + b, 0)
  );

  const minResult = allDiceResults.reduce((a, b) => Math.min(a, b), 0);
  const maxResult = allDiceResults.reduce((a, b) => Math.max(a, b), 0);

  const rows = dice.map((d) => ({
    id: d.id,
    name: d.name,
    values: d.values.join(","),
    ...Object.fromEntries(
      dice.map((o) => {
        const winProb = results[d.id][o.id];
        return [o.name, winProb];
      })
    ),
    total: Object.values(results[d.id])
      .reduce((a, b) => a + b, 0)
      .toFixed(2),
  }));

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Typography>Goal score</Typography>
        <Slider
          value={goalScore}
          onChange={(_, newValue) => setGoalScore(newValue as number, gameId)}
          max={10}
          min={1}
        />
        <Input
          value={goalScore}
          size="small"
          onChange={(e) =>
            setGoalScore(
              e.target.value === "" ? 1 : Number(e.target.value),
              gameId
            )
          }
          inputProps={{
            step: 1,
            min: 1,
            max: 10,
            type: "number",
          }}
        />
      </Stack>
      <DataGrid columns={columns} rows={rows} disableColumnFilter hideFooter />
    </Box>
  );
};

function winScore(
  values: number[],
  opponentValues: number[],
  goalScore: number
): number {
  let wins = 0;
  let losses = 0;
  for (const value of values) {
    for (const opponentValue of opponentValues) {
      if (value > opponentValue) {
        wins += 1;
      }
      if (opponentValue > value) {
        losses += 1;
      }
    }
  }

  const winProb = wins === 0 && losses == 0 ? 0.5 : wins / (wins + losses);
  return winProbMatch(winProb, goalScore);
}

const RD_BU_RGB = [
  red[600],
  red[500],
  red[400],
  red[300],
  red[50], // white
  blue[300],
  blue[400],
  blue[500],
  blue[600],
];

function rdBuScale(x: number): string {
  const val = Math.max(Math.min(x, 1), 0) * (RD_BU_RGB.length - 1);
  //   const low = Math.floor(val);
  //   const up = Math.ceil(val);
  //   const dec = val % 1;
  //   const r = RD_BU_RGB[low]![0] * (1 - dec) + RD_BU_RGB[up]![0] * dec;
  //   const g = RD_BU_RGB[low]![1] * (1 - dec) + RD_BU_RGB[up]![1] * dec;
  //   const b = RD_BU_RGB[low]![2] * (1 - dec) + RD_BU_RGB[up]![2] * dec;
  //   return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

  const i =
    x < 0.5 ? Math.floor(val) : x > 0.5 ? Math.ceil(val) : Math.round(val);

  return RD_BU_RGB[i];
}
