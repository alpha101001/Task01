import {CustomForm} from "./Components/CustomForm.jsx";
import {Box} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
const App = ()=> {
  return (
      <Box
          sx={{
              backgroundColor: "black",
              minHeight: "100vh",
              display: "flex",

              justifyContent: "center",
              padding: "2rem",
          }}
      >
          <CssBaseline />

      <CustomForm />
    </Box>
  )
}

export default App;