import { Button } from "@mui/material";
import React from "react";

import GridViewIcon from "@mui/icons-material/GridView";
import { useLocalState } from "./state";

export const DashboardButton: React.FC<unknown> = () => {
  const setActiveScreen = useLocalState((state) => state.setActiveScreen);
  return (
    <Button
      variant="contained"
      onClick={() => setActiveScreen({ type: "main" })}
    >
      <GridViewIcon></GridViewIcon>
    </Button>
  );
};
