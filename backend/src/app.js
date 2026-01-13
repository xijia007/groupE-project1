import express from 'express';
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ success: true, data: 'ok'});
});

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});