import React from "react";
import { TextField, InputAdornment, Button, Stack, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBox() {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      <Stack
        direction="row"
        spacing={0}
        sx={{
          border: "1px solid #fff",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 4px 4px 0 rgba(212, 212, 212, 0.25)",
          background: "#fffcfc",
        }}
      >
        <TextField
          placeholder="Type here"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              borderTopLeftRadius: "30px",
              borderBottomLeftRadius: "30px",
              height: "29px",
              width: "250px",
              backgroundColor: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            borderRadius: 0,
            borderTopRightRadius: "30px",
            borderBottomRightRadius: "30px",
            backgroundColor: "#2a2a2a",
            color: "#f4c27c",
            fontWeight: "bold",
            px: 2,
            height: "29px",
          }}
          endIcon={<SearchIcon />}
        >
          SEARCH
        </Button>
      </Stack>
    </Box>
  );
}
