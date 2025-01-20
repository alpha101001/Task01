import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import './api/Config/db.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));
app.get('/', (req, res) => {
    res.send('Hello');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;