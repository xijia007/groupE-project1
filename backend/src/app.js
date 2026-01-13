import express from 'express';
import { errorHandler } from "./middlewares/errorHandler";
require('dotenv').config();
const PORT = 3000;
const dbURI = process.env.MONGODB_URI;
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ success: true, data: 'ok'});
});

app.use(errorHandler);

const port = process.PORT || 3001;
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});