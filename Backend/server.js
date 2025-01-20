const express = require("express");
const elementRoutes = require("./api/Routes/elementRoutes.js");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());
app.use(cors());
// Routes
app.use("/", elementRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
