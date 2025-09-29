import { LinearProgress } from "@mui/material";
import React from "react";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
export default function Banner({ message, type }) {
    const [open, setOpen] = React.useState(true); 

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  if (!message) return null; 

    return (
       
        <>
        
        <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={type === "success" ? "success" : "error"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
        
        </>
        

    )
}