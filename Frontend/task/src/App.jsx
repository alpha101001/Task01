import {CustomForm} from "./Components/CustomForm.jsx";
import {Box} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
const App = ()=> {
  return (
      <Box
          sx={{
              backgroundColor: "black", // Replace with your desired color
              minHeight: "100vh", // Ensures the background covers the full height
              display: "flex",
              // alignItems: "center",
              justifyContent: "center", // Optional: Center your content
              padding: "2rem", // Optional: Add some padding
          }}
      >
          <CssBaseline />

      <CustomForm />
    </Box>
  )
}

export default App;